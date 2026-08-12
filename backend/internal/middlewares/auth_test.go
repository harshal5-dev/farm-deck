package middlewares

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/pkg/ctxutil"
	"github.com/harshal5-dev/farm-deck/backend/pkg/jwt"
)

const (
	testCookieName = "access_token"
	testJWTSecret  = "test-secret-key"
)

type errorBody struct {
	Success bool `json:"success"`
	Error   struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	} `json:"error"`
}

// validToken builds a real HS256 token for the given user and secret.
func validToken(t *testing.T, uid, tid uuid.UUID, role, secret string) string {
	t.Helper()
	tok, err := jwt.GenerateToken(
		jwt.UserDetails{UserId: uid, TenantId: tid, Role: role},
		jwt.JwtConfig{AccessTokenDuration: time.Hour, Issuer: "test", JWTSecret: secret},
	)
	if err != nil {
		t.Fatalf("generate token: %v", err)
	}
	return tok
}

// newAuthRouter wires the middleware under test to a handler that echoes the
// values it finds in the context, recording whether it was reached.
func newAuthRouter(cookieName, secret string, reached *bool) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(AuthMiddleware(cookieName, secret))
	r.GET("/protected", func(c *gin.Context) {
		*reached = true
		uid, _ := ctxutil.GetUserID(c)
		tid, _ := ctxutil.GetTenantID(c)
		role, _ := ctxutil.GetRole(c)
		c.JSON(http.StatusOK, gin.H{"userId": uid, "tenantId": tid, "role": role})
	})
	return r
}

func doGet(r *gin.Engine, cookie *http.Cookie) *httptest.ResponseRecorder {
	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	if cookie != nil {
		req.AddCookie(cookie)
	}
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestAuthMiddleware_RequiresCookie(t *testing.T) {
	var reached bool
	r := newAuthRouter(testCookieName, testJWTSecret, &reached)

	w := doGet(r, nil)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401", w.Code)
	}
	if reached {
		t.Error("downstream handler should not be reached without a cookie")
	}
	var body errorBody
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if body.Error.Code != "UNAUTHORIZED" {
		t.Errorf("code: got %q want UNAUTHORIZED", body.Error.Code)
	}
	if body.Error.Message != "authentication required" {
		t.Errorf("message: got %q want %q", body.Error.Message, "authentication required")
	}
}

func TestAuthMiddleware_RejectsInvalidToken(t *testing.T) {
	var reached bool
	r := newAuthRouter(testCookieName, testJWTSecret, &reached)

	w := doGet(r, &http.Cookie{Name: testCookieName, Value: "not-a-jwt"})

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401", w.Code)
	}
	if reached {
		t.Error("downstream handler should not be reached for an invalid token")
	}
	var body errorBody
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if body.Error.Message != "invalid or expired token" {
		t.Errorf("message: got %q want %q", body.Error.Message, "invalid or expired token")
	}
}

func TestAuthMiddleware_RejectsTokenSignedWithWrongSecret(t *testing.T) {
	var reached bool
	r := newAuthRouter(testCookieName, testJWTSecret, &reached)

	uid := uuid.MustParse("11111111-1111-1111-1111-111111111111")
	tid := uuid.MustParse("22222222-2222-2222-2222-222222222222")
	tok := validToken(t, uid, tid, "owner", "a-different-secret")

	w := doGet(r, &http.Cookie{Name: testCookieName, Value: tok})

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401", w.Code)
	}
	if reached {
		t.Error("downstream handler should not be reached for a token signed with the wrong secret")
	}
}

func TestAuthMiddleware_AcceptsValidTokenAndPopulatesContext(t *testing.T) {
	var reached bool
	r := newAuthRouter(testCookieName, testJWTSecret, &reached)

	uid := uuid.MustParse("33333333-3333-3333-3333-333333333333")
	tid := uuid.MustParse("44444444-4444-4444-4444-444444444444")
	tok := validToken(t, uid, tid, "owner", testJWTSecret)

	w := doGet(r, &http.Cookie{Name: testCookieName, Value: tok})

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	if !reached {
		t.Fatal("downstream handler should have been reached for a valid token")
	}
	var body struct {
		UserID   uuid.UUID `json:"userId"`
		TenantID uuid.UUID `json:"tenantId"`
		Role     string    `json:"role"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if body.UserID != uid {
		t.Errorf("userId: got %v want %v", body.UserID, uid)
	}
	if body.TenantID != tid {
		t.Errorf("tenantId: got %v want %v", body.TenantID, tid)
	}
	if body.Role != "owner" {
		t.Errorf("role: got %q want %q", body.Role, "owner")
	}
}
