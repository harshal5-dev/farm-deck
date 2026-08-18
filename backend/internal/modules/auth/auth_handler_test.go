package auth

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

func handlerCfg() config.Config {
	return config.Config{
		CookieTokenName:        "access_token",
		CookieRefreshTokenName: "refresh_token",
		AccessTokenDuration:    time.Hour,
		RefreshTokenDuration:   720 * time.Hour,
	}
}

func newJSONCtx(body string) (*gin.Context, *httptest.ResponseRecorder) {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(w)
	ctx.Request = httptest.NewRequest(http.MethodPost, "/", strings.NewReader(body))
	ctx.Request.Header.Set("Content-Type", "application/json")
	return ctx, w
}

func withRefreshCookie(ctx *gin.Context, name, value string) {
	ctx.Request.AddCookie(&http.Cookie{Name: name, Value: value})
}

func cookieValue(t *testing.T, w *httptest.ResponseRecorder, name string) string {
	t.Helper()
	for _, c := range w.Result().Cookies() {
		if c.Name == name {
			return c.Value
		}
	}
	return ""
}

func TestAuthHandler_Register_Success(t *testing.T) {
	svc := &fakeAuthService{registerUser: func(context.Context, RegisterUserRequest) error { return nil }}
	h := NewAuthHandler(svc, handlerCfg())

	body := `{"fullName":"Alice","emailId":"alice@farmdeck.app","password":"supersecret","tenantName":"Alice's Farm"}`
	ctx, w := newJSONCtx(body)
	h.Register(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	if svc.registerCalls != 1 {
		t.Errorf("expected RegisterUser called once, got %d", svc.registerCalls)
	}
	var resp struct {
		Success bool              `json:"success"`
		Data    map[string]string `json:"data"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if !resp.Success {
		t.Error("expected success=true")
	}
	if resp.Data["message"] != "user registered successfully" {
		t.Errorf("message: got %q", resp.Data["message"])
	}
}

func TestAuthHandler_Register_InvalidBodyDoesNotCallService(t *testing.T) {
	svc := &fakeAuthService{registerUser: func(context.Context, RegisterUserRequest) error {
		t.Fatal("service must not be called on a validation failure")
		return nil
	}}
	h := NewAuthHandler(svc, handlerCfg())

	// missing required fields
	ctx, w := newJSONCtx(`{"emailId":"not-an-email"}`)
	h.Register(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400", w.Code)
	}
	if !strings.Contains(w.Body.String(), "VALIDATION_ERROR") {
		t.Errorf("expected VALIDATION_ERROR, got %s", w.Body.String())
	}
}

func TestAuthHandler_Register_ServiceErrorMappedByHttperr(t *testing.T) {
	svc := &fakeAuthService{registerUser: func(context.Context, RegisterUserRequest) error {
		return domain.ErrUserExists
	}}
	h := NewAuthHandler(svc, handlerCfg())

	ctx, w := newJSONCtx(`{"fullName":"Alice","emailId":"alice@farmdeck.app","password":"supersecret","tenantName":"Acme"}`)
	h.Register(ctx)

	if w.Code != http.StatusConflict {
		t.Fatalf("status: got %d want 409 (body=%s)", w.Code, w.Body.String())
	}
}

func TestAuthHandler_Login_SuccessSetsCookies(t *testing.T) {
	svc := &fakeAuthService{loginUser: func(_ context.Context, _ LoginRequest, _ SessionMeta) (TokenPair, error) {
		return TokenPair{AccessToken: "access-val", RefreshToken: "refresh-val"}, nil
	}}
	h := NewAuthHandler(svc, handlerCfg())

	ctx, w := newJSONCtx(`{"emailId":"alice@farmdeck.app","password":"supersecret"}`)
	h.Login(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	if cookieValue(t, w, "access_token") != "access-val" {
		t.Error("expected access_token cookie to be set")
	}
	if cookieValue(t, w, "refresh_token") != "refresh-val" {
		t.Error("expected refresh_token cookie to be set")
	}
	var resp struct {
		Success bool              `json:"success"`
		Data    map[string]string `json:"data"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if resp.Data["accessToken"] != "access-val" {
		t.Errorf("accessToken: got %q", resp.Data["accessToken"])
	}
}

func TestAuthHandler_Login_InvalidBodyMappedTo400(t *testing.T) {
	svc := &fakeAuthService{loginUser: func(context.Context, LoginRequest, SessionMeta) (TokenPair, error) {
		t.Fatal("service must not be called on validation failure")
		return TokenPair{}, nil
	}}
	h := NewAuthHandler(svc, handlerCfg())

	ctx, w := newJSONCtx(`{"password":"x"}`) // missing email
	h.Login(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400", w.Code)
	}
}

func TestAuthHandler_Login_InvalidCredentialsMappedTo401(t *testing.T) {
	svc := &fakeAuthService{loginUser: func(context.Context, LoginRequest, SessionMeta) (TokenPair, error) {
		return TokenPair{}, domain.ErrInvalidCredentials
	}}
	h := NewAuthHandler(svc, handlerCfg())

	ctx, w := newJSONCtx(`{"emailId":"alice@farmdeck.app","password":"wrong"}`)
	h.Login(ctx)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401", w.Code)
	}
}

func TestAuthHandler_Refresh_MissingCookieRejected(t *testing.T) {
	svc := &fakeAuthService{refreshTokens: func(context.Context, string, SessionMeta) (TokenPair, error) {
		t.Fatal("service must not be called without a refresh cookie")
		return TokenPair{}, nil
	}}
	h := NewAuthHandler(svc, handlerCfg())

	ctx, w := newJSONCtx("")
	h.Refresh(ctx)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401", w.Code)
	}
	if !strings.Contains(w.Body.String(), "refresh token missing") {
		t.Errorf("expected 'refresh token missing', got %s", w.Body.String())
	}
}

func TestAuthHandler_Refresh_SuccessRotatesCookies(t *testing.T) {
	var receivedRaw string
	svc := &fakeAuthService{refreshTokens: func(_ context.Context, raw string, _ SessionMeta) (TokenPair, error) {
		receivedRaw = raw
		return TokenPair{AccessToken: "new-access", RefreshToken: "new-refresh"}, nil
	}}
	h := NewAuthHandler(svc, handlerCfg())

	ctx, w := newJSONCtx("")
	withRefreshCookie(ctx, "refresh_token", "raw-refresh")
	h.Refresh(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	if receivedRaw != "raw-refresh" {
		t.Errorf("service received raw token %q, want %q", receivedRaw, "raw-refresh")
	}
	if cookieValue(t, w, "access_token") != "new-access" {
		t.Error("expected rotated access_token cookie")
	}
	if cookieValue(t, w, "refresh_token") != "new-refresh" {
		t.Error("expected rotated refresh_token cookie")
	}
}

func TestAuthHandler_Refresh_ServiceErrorMappedTo401(t *testing.T) {
	svc := &fakeAuthService{refreshTokens: func(context.Context, string, SessionMeta) (TokenPair, error) {
		return TokenPair{}, domain.ErrRefreshTokenInvalid
	}}
	h := NewAuthHandler(svc, handlerCfg())

	ctx, w := newJSONCtx("")
	withRefreshCookie(ctx, "refresh_token", "raw")
	h.Refresh(ctx)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401", w.Code)
	}
}

func TestAuthHandler_Logout_SuccessClearsCookies(t *testing.T) {
	svc := &fakeAuthService{logout: func(context.Context, string) error { return nil }}
	h := NewAuthHandler(svc, handlerCfg())

	ctx, w := newJSONCtx("")
	withRefreshCookie(ctx, "refresh_token", "raw")
	h.Logout(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200", w.Code)
	}
	if svc.logoutCalls != 1 {
		t.Errorf("expected Logout called once, got %d", svc.logoutCalls)
	}
	// Cleared cookies have an empty value.
	if cv := cookieValue(t, w, "access_token"); cv != "" {
		t.Errorf("expected cleared access_token cookie, got %q", cv)
	}
	if cv := cookieValue(t, w, "refresh_token"); cv != "" {
		t.Errorf("expected cleared refresh_token cookie, got %q", cv)
	}
}

func TestAuthHandler_Logout_ServiceErrorMapped(t *testing.T) {
	svc := &fakeAuthService{logout: func(context.Context, string) error { return domain.ErrUserNotFound }}
	h := NewAuthHandler(svc, handlerCfg())

	ctx, w := newJSONCtx("")
	h.Logout(ctx)

	if w.Code != http.StatusNotFound {
		t.Fatalf("status: got %d want 404", w.Code)
	}
}

func newQueryCtx(target string) (*gin.Context, *httptest.ResponseRecorder) {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(w)
	ctx.Request = httptest.NewRequest(http.MethodGet, target, nil)
	return ctx, w
}

func TestAuthHandler_VerifyInvitation_MissingTokenMappedTo400(t *testing.T) {
	svc := &fakeAuthService{verifyInvitation: func(context.Context, string) (VerifyInvitationResponse, error) {
		t.Fatal("service must not be called without a token")
		return VerifyInvitationResponse{}, nil
	}}
	h := NewAuthHandler(svc, handlerCfg())

	ctx, w := newQueryCtx("/api/v1/auth/verify-invitation")
	h.VerifyInvitation(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400 (body=%s)", w.Code, w.Body.String())
	}
}

func TestAuthHandler_VerifyInvitation_Success(t *testing.T) {
	var receivedRaw string
	svc := &fakeAuthService{verifyInvitation: func(_ context.Context, raw string) (VerifyInvitationResponse, error) {
		receivedRaw = raw
		return VerifyInvitationResponse{
			FullName: "Bob", EmailID: "bob@farmdeck.app",
			Role: domain.UserRoleGrower, TenantName: "Green Acres",
		}, nil
	}}
	h := NewAuthHandler(svc, handlerCfg())

	ctx, w := newQueryCtx("/api/v1/auth/verify-invitation?token=raw-invite-token")
	h.VerifyInvitation(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	if receivedRaw != "raw-invite-token" {
		t.Errorf("service received token %q, want the raw token from the query", receivedRaw)
	}
	var resp struct {
		Success bool                     `json:"success"`
		Data    VerifyInvitationResponse `json:"data"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if resp.Data.FullName != "Bob" || resp.Data.TenantName != "Green Acres" {
		t.Errorf("data = %+v", resp.Data)
	}
}

func TestAuthHandler_VerifyInvitation_ExpiredMappedTo400(t *testing.T) {
	svc := &fakeAuthService{verifyInvitation: func(context.Context, string) (VerifyInvitationResponse, error) {
		return VerifyInvitationResponse{}, domain.ErrInvitationExpired
	}}
	h := NewAuthHandler(svc, handlerCfg())

	ctx, w := newQueryCtx("/api/v1/auth/verify-invitation?token=raw")
	h.VerifyInvitation(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400 (body=%s)", w.Code, w.Body.String())
	}
	if !strings.Contains(w.Body.String(), "invitation has expired") {
		t.Errorf("expected expiry message, got %s", w.Body.String())
	}
}

func TestAuthHandler_AcceptInvitation_SuccessSetsCookies(t *testing.T) {
	var receivedReq AcceptInvitationRequest
	svc := &fakeAuthService{acceptInvitation: func(_ context.Context, r AcceptInvitationRequest, _ SessionMeta) (TokenPair, error) {
		receivedReq = r
		return TokenPair{AccessToken: "access-val", RefreshToken: "refresh-val"}, nil
	}}
	h := NewAuthHandler(svc, handlerCfg())

	ctx, w := newJSONCtx(`{"token":"raw-invite-token","password":"chosenpassword1"}`)
	h.AcceptInvitation(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	if receivedReq.Token != "raw-invite-token" || receivedReq.Password != "chosenpassword1" {
		t.Errorf("service received %+v", receivedReq)
	}
	if svc.acceptInviteCalls != 1 {
		t.Errorf("expected AcceptInvitation called once, got %d", svc.acceptInviteCalls)
	}
	if cookieValue(t, w, "access_token") != "access-val" {
		t.Error("expected access_token cookie to be set")
	}
	if cookieValue(t, w, "refresh_token") != "refresh-val" {
		t.Error("expected refresh_token cookie to be set")
	}
}

func TestAuthHandler_AcceptInvitation_InvalidBodyMappedTo400(t *testing.T) {
	svc := &fakeAuthService{acceptInvitation: func(context.Context, AcceptInvitationRequest, SessionMeta) (TokenPair, error) {
		t.Fatal("service must not be called on a validation failure")
		return TokenPair{}, nil
	}}
	h := NewAuthHandler(svc, handlerCfg())

	// password too short: min=8
	ctx, w := newJSONCtx(`{"token":"raw-invite-token","password":"short"}`)
	h.AcceptInvitation(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400", w.Code)
	}
	if !strings.Contains(w.Body.String(), "VALIDATION_ERROR") {
		t.Errorf("expected VALIDATION_ERROR, got %s", w.Body.String())
	}
}

func TestAuthHandler_AcceptInvitation_AlreadyAcceptedMappedTo409(t *testing.T) {
	svc := &fakeAuthService{acceptInvitation: func(context.Context, AcceptInvitationRequest, SessionMeta) (TokenPair, error) {
		return TokenPair{}, domain.ErrInvitationAccepted
	}}
	h := NewAuthHandler(svc, handlerCfg())

	ctx, w := newJSONCtx(`{"token":"raw-invite-token","password":"chosenpassword1"}`)
	h.AcceptInvitation(ctx)

	if w.Code != http.StatusConflict {
		t.Fatalf("status: got %d want 409 (body=%s)", w.Code, w.Body.String())
	}
}
