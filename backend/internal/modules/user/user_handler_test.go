package user

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/pkg/ctxutil"
)

func newJSONCtx(body string) (*gin.Context, *httptest.ResponseRecorder) {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(w)
	ctx.Request = httptest.NewRequest(http.MethodPost, "/", strings.NewReader(body))
	ctx.Request.Header.Set("Content-Type", "application/json")
	return ctx, w
}

func withUserID(ctx *gin.Context, id uuid.UUID) { ctx.Set(ctxutil.UserIDKey, id) }

func TestUserHandler_GetCurrentProfile_NoUserIDRejected(t *testing.T) {
	svc := &fakeUserService{getMyProfile: func(context.Context, uuid.UUID) (UserProfileResponse, error) {
		t.Fatal("service must not be called without a user id")
		return UserProfileResponse{}, nil
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx("")
	h.GetCurrentProfile(ctx)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401", w.Code)
	}
	if !strings.Contains(w.Body.String(), "authentication required") {
		t.Errorf("expected 'authentication required', got %s", w.Body.String())
	}
}

func TestUserHandler_GetCurrentProfile_Success(t *testing.T) {
	uid := uuid.MustParse("11111111-1111-1111-1111-111111111111")
	svc := &fakeUserService{getMyProfile: func(_ context.Context, id uuid.UUID) (UserProfileResponse, error) {
		if id != uid {
			t.Errorf("id forwarded: got %v", id)
		}
		return UserProfileResponse{
			FullName: "Alice",
			EmailID:  "alice@farmdeck.app",
			Role:     domain.UserRoleOwner,
			TenantDetails: TenantDetails{Name: "Alice's Farm"},
		}, nil
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx("")
	withUserID(ctx, uid)
	h.GetCurrentProfile(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	var resp struct {
		Success bool              `json:"success"`
		Data    UserProfileResponse `json:"data"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if resp.Data.FullName != "Alice" {
		t.Errorf("FullName: got %q", resp.Data.FullName)
	}
	if resp.Data.TenantDetails.Name != "Alice's Farm" {
		t.Errorf("TenantDetails.Name: got %q", resp.Data.TenantDetails.Name)
	}
}

func TestUserHandler_GetCurrentProfile_NotFoundMapped(t *testing.T) {
	svc := &fakeUserService{getMyProfile: func(context.Context, uuid.UUID) (UserProfileResponse, error) {
		return UserProfileResponse{}, domain.ErrUserNotFound
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx("")
	withUserID(ctx, uuid.MustParse("22222222-2222-2222-2222-222222222222"))
	h.GetCurrentProfile(ctx)

	if w.Code != http.StatusNotFound {
		t.Fatalf("status: got %d want 404", w.Code)
	}
}

func TestUserHandler_UpdateProfile_NoUserIDRejected(t *testing.T) {
	svc := &fakeUserService{updateUserProfile: func(context.Context, uuid.UUID, UpdateUserProfileRequest) error {
		t.Fatal("service must not be called without a user id")
		return nil
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx(`{"fullName":"Alice"}`)
	h.UpdateProfile(ctx)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401", w.Code)
	}
}

func TestUserHandler_UpdateProfile_InvalidBodyRejected(t *testing.T) {
	svc := &fakeUserService{updateUserProfile: func(context.Context, uuid.UUID, UpdateUserProfileRequest) error {
		t.Fatal("service must not be called on validation failure")
		return nil
	}}
	h := NewUserHandler(svc)

	// fullName too short (min=2)
	ctx, w := newJSONCtx(`{"fullName":"a"}`)
	withUserID(ctx, uuid.MustParse("33333333-3333-3333-3333-333333333333"))
	h.UpdateProfile(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400", w.Code)
	}
	if !strings.Contains(w.Body.String(), "VALIDATION_ERROR") {
		t.Errorf("expected VALIDATION_ERROR, got %s", w.Body.String())
	}
}

func TestUserHandler_UpdateProfile_Success(t *testing.T) {
	uid := uuid.MustParse("44444444-4444-4444-4444-444444444444")
	called := false
	svc := &fakeUserService{updateUserProfile: func(_ context.Context, id uuid.UUID, r UpdateUserProfileRequest) error {
		called = true
		if id != uid {
			t.Errorf("id forwarded: got %v", id)
		}
		if r.FullName != "Alice Updated" {
			t.Errorf("FullName: got %q", r.FullName)
		}
		return nil
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx(`{"fullName":"Alice Updated"}`)
	withUserID(ctx, uid)
	h.UpdateProfile(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	if !called {
		t.Error("expected UpdateUserProfile to be called")
	}
}

func TestUserHandler_UpdateProfile_ServiceErrorMapped(t *testing.T) {
	svc := &fakeUserService{updateUserProfile: func(context.Context, uuid.UUID, UpdateUserProfileRequest) error {
		return domain.ErrUserNotFound
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx(`{"fullName":"Alice Updated"}`)
	withUserID(ctx, uuid.MustParse("55555555-5555-5555-5555-555555555555"))
	h.UpdateProfile(ctx)

	if w.Code != http.StatusNotFound {
		t.Fatalf("status: got %d want 404", w.Code)
	}
}

func TestUserHandler_CreateMember_Success(t *testing.T) {
	tenantID := uuid.MustParse("66666666-6666-6666-6666-666666666666")
	inviterID := uuid.MustParse("77777777-7777-7777-7777-777777777777")
	userID := uuid.MustParse("88888888-8888-8888-8888-888888888888")
	invID := uuid.MustParse("99999999-9999-9999-9999-999999999999")

	svc := &fakeUserService{createMember: func(_ context.Context, tID, iID uuid.UUID, r CreateMemberRequest) (CreateMemberResponse, error) {
		if tID != tenantID {
			t.Errorf("tenantID forwarded: got %v want %v", tID, tenantID)
		}
		if iID != inviterID {
			t.Errorf("inviterID forwarded: got %v want %v", iID, inviterID)
		}
		return CreateMemberResponse{UserID: userID, InvitationID: invID}, nil
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx(`{"fullName":"Bob","emailId":"bob@farmdeck.app","role":"grower"}`)
	withUserID(ctx, inviterID)
	ctx.Set(ctxutil.TenantIDKey, tenantID)
	h.CreateMember(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
}
