package ctxutil

import (
	"errors"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func newCtx() *gin.Context {
	gin.SetMode(gin.TestMode)
	ctx, _ := gin.CreateTestContext(httptest.NewRecorder())
	ctx.Request = httptest.NewRequest("GET", "/", nil)
	return ctx
}

func TestGetUserID(t *testing.T) {
	uid := uuid.MustParse("11111111-1111-1111-1111-111111111111")

	t.Run("returns the id when set as uuid.UUID", func(t *testing.T) {
		ctx := newCtx()
		ctx.Set(UserIDKey, uid)

		got, err := GetUserID(ctx)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != uid {
			t.Errorf("got %v want %v", got, uid)
		}
	})

	t.Run("missing returns ErrUserIDNotFound", func(t *testing.T) {
		_, err := GetUserID(newCtx())
		if !errors.Is(err, ErrUserIDNotFound) {
			t.Fatalf("expected ErrUserIDNotFound, got %v", err)
		}
	})

	t.Run("wrong type returns ErrInvalidType", func(t *testing.T) {
		ctx := newCtx()
		ctx.Set(UserIDKey, "not-a-uuid")
		_, err := GetUserID(ctx)
		if !errors.Is(err, ErrInvalidType) {
			t.Fatalf("expected ErrInvalidType, got %v", err)
		}
	})
}

func TestGetTenantID(t *testing.T) {
	tid := uuid.MustParse("22222222-2222-2222-2222-222222222222")

	t.Run("returns the id when set", func(t *testing.T) {
		ctx := newCtx()
		ctx.Set(TenantIDKey, tid)

		got, err := GetTenantID(ctx)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != tid {
			t.Errorf("got %v want %v", got, tid)
		}
	})

	t.Run("missing returns ErrTenantIDNotFound", func(t *testing.T) {
		_, err := GetTenantID(newCtx())
		if !errors.Is(err, ErrTenantIDNotFound) {
			t.Fatalf("expected ErrTenantIDNotFound, got %v", err)
		}
	})

	t.Run("wrong type returns ErrInvalidType", func(t *testing.T) {
		ctx := newCtx()
		ctx.Set(TenantIDKey, 42)
		_, err := GetTenantID(ctx)
		if !errors.Is(err, ErrInvalidType) {
			t.Fatalf("expected ErrInvalidType, got %v", err)
		}
	})
}

func TestGetRole(t *testing.T) {
	t.Run("returns the role when set as string", func(t *testing.T) {
		ctx := newCtx()
		ctx.Set(RoleKey, "owner")

		got, err := GetRole(ctx)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != "owner" {
			t.Errorf("got %q want %q", got, "owner")
		}
	})

	t.Run("missing returns ErrRoleNotFound", func(t *testing.T) {
		_, err := GetRole(newCtx())
		if !errors.Is(err, ErrRoleNotFound) {
			t.Fatalf("expected ErrRoleNotFound, got %v", err)
		}
	})

	t.Run("wrong type returns ErrInvalidType", func(t *testing.T) {
		ctx := newCtx()
		ctx.Set(RoleKey, 123)
		_, err := GetRole(ctx)
		if !errors.Is(err, ErrInvalidType) {
			t.Fatalf("expected ErrInvalidType, got %v", err)
		}
	})
}
