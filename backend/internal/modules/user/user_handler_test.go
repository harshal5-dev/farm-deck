package user

import (
	"context"
	"encoding/json"
	"errors"
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

func withMemberID(ctx *gin.Context, id uuid.UUID) { ctx.AddParam("memberId", id.String()) }

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
			FullName:      "Alice",
			EmailID:       "alice@farmdeck.app",
			Role:          domain.UserRoleOwner,
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
		Success bool                `json:"success"`
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

func TestUserHandler_ListMember_NoUserIDRejected(t *testing.T) {
	svc := &fakeUserService{listMember: func(context.Context, uuid.UUID, uuid.UUID) (ListMembersResponse, error) {
		t.Fatal("service must not be called without a user id")
		return ListMembersResponse{}, nil
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx("")
	h.ListMember(ctx)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401", w.Code)
	}
}

func TestUserHandler_ListMember_NoTenantIDRejected(t *testing.T) {
	svc := &fakeUserService{listMember: func(context.Context, uuid.UUID, uuid.UUID) (ListMembersResponse, error) {
		t.Fatal("service must not be called without a tenant id")
		return ListMembersResponse{}, nil
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx("")
	withUserID(ctx, uuid.MustParse("11111111-1111-1111-1111-111111111111"))
	h.ListMember(ctx)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401", w.Code)
	}
}

func TestUserHandler_ListMember_Success(t *testing.T) {
	tenantID := uuid.MustParse("22222222-2222-2222-2222-222222222222")
	userID := uuid.MustParse("33333333-3333-3333-3333-333333333333")

	svc := &fakeUserService{listMember: func(_ context.Context, tID, eID uuid.UUID) (ListMembersResponse, error) {
		if tID != tenantID {
			t.Errorf("tenantID forwarded: got %v want %v", tID, tenantID)
		}
		if eID != userID {
			t.Errorf("excludeID (userID) forwarded: got %v want %v", eID, userID)
		}
		return ListMembersResponse{Total: 1, ActiveCount: 1, Members: []MemberResponse{{FullName: "Bob"}}}, nil
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx("")
	withUserID(ctx, userID)
	ctx.Set(ctxutil.TenantIDKey, tenantID)
	h.ListMember(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	var resp struct {
		Success bool                `json:"success"`
		Data    ListMembersResponse `json:"data"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if resp.Data.Total != 1 {
		t.Errorf("Total: got %d want 1", resp.Data.Total)
	}
	if len(resp.Data.Members) != 1 || resp.Data.Members[0].FullName != "Bob" {
		t.Errorf("Members: got %+v", resp.Data.Members)
	}
}

func TestUserHandler_ListMember_ServiceErrorMapped(t *testing.T) {
	svc := &fakeUserService{listMember: func(context.Context, uuid.UUID, uuid.UUID) (ListMembersResponse, error) {
		return ListMembersResponse{}, errors.New("db down")
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx("")
	withUserID(ctx, uuid.MustParse("44444444-4444-4444-4444-444444444444"))
	ctx.Set(ctxutil.TenantIDKey, uuid.MustParse("55555555-5555-5555-5555-555555555555"))
	h.ListMember(ctx)

	if w.Code != http.StatusInternalServerError {
		t.Fatalf("status: got %d want 500 (body=%s)", w.Code, w.Body.String())
	}
}

func TestUserHandler_IsCreateMemberAllowed(t *testing.T) {
	t.Run("owner proceeds", func(t *testing.T) {
		h := NewUserHandler(&fakeUserService{})
		ctx, w := newJSONCtx("")
		ctx.Set(ctxutil.RoleKey, domain.UserRoleOwner)
		h.IsCreateMemberAllowed(ctx)

		if w.Code != http.StatusOK {
			t.Errorf("owner should proceed: got %d want 200", w.Code)
		}
		if ctx.IsAborted() {
			t.Error("owner request must not be aborted")
		}
	})

	t.Run("non-owner forbidden", func(t *testing.T) {
		h := NewUserHandler(&fakeUserService{})
		ctx, w := newJSONCtx("")
		ctx.Set(ctxutil.RoleKey, domain.UserRoleGrower)
		h.IsCreateMemberAllowed(ctx)

		if w.Code != http.StatusForbidden {
			t.Errorf("non-owner: got %d want 403", w.Code)
		}
		if !ctx.IsAborted() {
			t.Error("non-owner request must be aborted")
		}
	})

	t.Run("missing role unauthorized", func(t *testing.T) {
		h := NewUserHandler(&fakeUserService{})
		ctx, w := newJSONCtx("")
		h.IsCreateMemberAllowed(ctx)

		if w.Code != http.StatusUnauthorized {
			t.Errorf("missing role: got %d want 401", w.Code)
		}
		if !ctx.IsAborted() {
			t.Error("missing-role request must be aborted")
		}
	})
}

func TestUserHandler_IsListMembersAllowed(t *testing.T) {
	t.Run("owner proceeds", func(t *testing.T) {
		h := NewUserHandler(&fakeUserService{})
		ctx, w := newJSONCtx("")
		ctx.Set(ctxutil.RoleKey, domain.UserRoleOwner)
		h.IsListMembersAllowed(ctx)

		if w.Code != http.StatusOK {
			t.Errorf("owner should proceed: got %d want 200", w.Code)
		}
		if ctx.IsAborted() {
			t.Error("owner request must not be aborted")
		}
	})

	t.Run("non-owner forbidden", func(t *testing.T) {
		h := NewUserHandler(&fakeUserService{})
		ctx, w := newJSONCtx("")
		ctx.Set(ctxutil.RoleKey, domain.UserRoleManager)
		h.IsListMembersAllowed(ctx)

		if w.Code != http.StatusForbidden {
			t.Errorf("non-owner: got %d want 403", w.Code)
		}
		if !ctx.IsAborted() {
			t.Error("non-owner request must be aborted")
		}
	})

	t.Run("missing role unauthorized", func(t *testing.T) {
		h := NewUserHandler(&fakeUserService{})
		ctx, w := newJSONCtx("")
		h.IsListMembersAllowed(ctx)

		if w.Code != http.StatusUnauthorized {
			t.Errorf("missing role: got %d want 401", w.Code)
		}
		if !ctx.IsAborted() {
			t.Error("missing-role request must be aborted")
		}
	})
}

func TestUserHandler_UpdateMember_InvalidMemberIDRejected(t *testing.T) {
	svc := &fakeUserService{updateMember: func(context.Context, uuid.UUID, UpdateMemberRequest) error {
		t.Fatal("service must not be called with an invalid member id")
		return nil
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx(`{"fullName":"Bob","role":"grower"}`)
	ctx.AddParam("memberId", "not-a-uuid")
	h.UpdateMember(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400", w.Code)
	}
}

func TestUserHandler_UpdateMember_InvalidBodyRejected(t *testing.T) {
	svc := &fakeUserService{updateMember: func(context.Context, uuid.UUID, UpdateMemberRequest) error {
		t.Fatal("service must not be called on validation failure")
		return nil
	}}
	h := NewUserHandler(svc)

	// fullName too short (min=2)
	ctx, w := newJSONCtx(`{"fullName":"a","role":"grower"}`)
	withMemberID(ctx, uuid.MustParse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"))
	h.UpdateMember(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400", w.Code)
	}
	if !strings.Contains(w.Body.String(), "VALIDATION_ERROR") {
		t.Errorf("expected VALIDATION_ERROR, got %s", w.Body.String())
	}
}

func TestUserHandler_UpdateMember_Success(t *testing.T) {
	memberID := uuid.MustParse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")
	called := false
	svc := &fakeUserService{updateMember: func(_ context.Context, id uuid.UUID, r UpdateMemberRequest) error {
		called = true
		if id != memberID {
			t.Errorf("id forwarded: got %v", id)
		}
		if r.FullName != "Bob Updated" {
			t.Errorf("FullName: got %q", r.FullName)
		}
		if r.Role != domain.UserRoleGrower {
			t.Errorf("Role: got %q", r.Role)
		}
		return nil
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx(`{"fullName":"Bob Updated","role":"grower"}`)
	withMemberID(ctx, memberID)
	h.UpdateMember(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	if !called {
		t.Error("expected UpdateMember to be called")
	}
}

func TestUserHandler_UpdateMember_ServiceErrorMapped(t *testing.T) {
	svc := &fakeUserService{updateMember: func(context.Context, uuid.UUID, UpdateMemberRequest) error {
		return domain.ErrUserNotFound
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx(`{"fullName":"Bob Updated","role":"grower"}`)
	withMemberID(ctx, uuid.MustParse("cccccccc-cccc-cccc-cccc-cccccccccccc"))
	h.UpdateMember(ctx)

	if w.Code != http.StatusNotFound {
		t.Fatalf("status: got %d want 404", w.Code)
	}
}

func TestUserHandler_DeleteMember_InvalidMemberIDRejected(t *testing.T) {
	svc := &fakeUserService{deleteMember: func(context.Context, uuid.UUID) error {
		t.Fatal("service must not be called with an invalid member id")
		return nil
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx("")
	ctx.AddParam("memberId", "not-a-uuid")
	h.DeleteMember(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400", w.Code)
	}
}

func TestUserHandler_DeleteMember_Success(t *testing.T) {
	memberID := uuid.MustParse("dddddddd-dddd-dddd-dddd-dddddddddddd")
	called := false
	svc := &fakeUserService{deleteMember: func(_ context.Context, id uuid.UUID) error {
		called = true
		if id != memberID {
			t.Errorf("id forwarded: got %v", id)
		}
		return nil
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx("")
	withMemberID(ctx, memberID)
	h.DeleteMember(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	if !called {
		t.Error("expected DeleteMember to be called")
	}
}

func TestUserHandler_DeleteMember_ServiceErrorMapped(t *testing.T) {
	svc := &fakeUserService{deleteMember: func(context.Context, uuid.UUID) error {
		return domain.ErrUserNotFound
	}}
	h := NewUserHandler(svc)

	ctx, w := newJSONCtx("")
	withMemberID(ctx, uuid.MustParse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"))
	h.DeleteMember(ctx)

	if w.Code != http.StatusNotFound {
		t.Fatalf("status: got %d want 404", w.Code)
	}
}

func TestUserHandler_IsUpdateMemberAllowed(t *testing.T) {
	t.Run("owner proceeds", func(t *testing.T) {
		h := NewUserHandler(&fakeUserService{})
		ctx, w := newJSONCtx("")
		ctx.Set(ctxutil.RoleKey, domain.UserRoleOwner)
		h.IsUpdateMemberAllowed(ctx)

		if w.Code != http.StatusOK {
			t.Errorf("owner should proceed: got %d want 200", w.Code)
		}
		if ctx.IsAborted() {
			t.Error("owner request must not be aborted")
		}
	})

	t.Run("non-owner forbidden", func(t *testing.T) {
		h := NewUserHandler(&fakeUserService{})
		ctx, w := newJSONCtx("")
		ctx.Set(ctxutil.RoleKey, domain.UserRoleViewer)
		h.IsUpdateMemberAllowed(ctx)

		if w.Code != http.StatusForbidden {
			t.Errorf("non-owner: got %d want 403", w.Code)
		}
		if !ctx.IsAborted() {
			t.Error("non-owner request must be aborted")
		}
	})

	t.Run("missing role unauthorized", func(t *testing.T) {
		h := NewUserHandler(&fakeUserService{})
		ctx, w := newJSONCtx("")
		h.IsUpdateMemberAllowed(ctx)

		if w.Code != http.StatusUnauthorized {
			t.Errorf("missing role: got %d want 401", w.Code)
		}
		if !ctx.IsAborted() {
			t.Error("missing-role request must be aborted")
		}
	})
}

func TestUserHandler_IsDeleteMemberAllowed(t *testing.T) {
	t.Run("owner proceeds", func(t *testing.T) {
		h := NewUserHandler(&fakeUserService{})
		ctx, w := newJSONCtx("")
		ctx.Set(ctxutil.RoleKey, domain.UserRoleOwner)
		h.IsDeleteMemberAllowed(ctx)

		if w.Code != http.StatusOK {
			t.Errorf("owner should proceed: got %d want 200", w.Code)
		}
		if ctx.IsAborted() {
			t.Error("owner request must not be aborted")
		}
	})

	t.Run("non-owner forbidden", func(t *testing.T) {
		h := NewUserHandler(&fakeUserService{})
		ctx, w := newJSONCtx("")
		ctx.Set(ctxutil.RoleKey, domain.UserRoleGrower)
		h.IsDeleteMemberAllowed(ctx)

		if w.Code != http.StatusForbidden {
			t.Errorf("non-owner: got %d want 403", w.Code)
		}
		if !ctx.IsAborted() {
			t.Error("non-owner request must be aborted")
		}
	})

	t.Run("missing role unauthorized", func(t *testing.T) {
		h := NewUserHandler(&fakeUserService{})
		ctx, w := newJSONCtx("")
		h.IsDeleteMemberAllowed(ctx)

		if w.Code != http.StatusUnauthorized {
			t.Errorf("missing role: got %d want 401", w.Code)
		}
		if !ctx.IsAborted() {
			t.Error("missing-role request must be aborted")
		}
	})
}
