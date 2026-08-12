package tenant

import (
	"context"
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
	ctx.Request = httptest.NewRequest(http.MethodPatch, "/", strings.NewReader(body))
	ctx.Request.Header.Set("Content-Type", "application/json")
	return ctx, w
}

func withTenantID(ctx *gin.Context, id uuid.UUID) { ctx.Set(ctxutil.TenantIDKey, id) }

func TestTenantHandler_UpdateTenant_NoTenantIDRejected(t *testing.T) {
	svc := &fakeTenantService{updateTenant: func(context.Context, uuid.UUID, UpdateTenantRequest) error {
		t.Fatal("service must not be called without a tenant id")
		return nil
	}}
	h := NewTenantHandler(svc)

	ctx, w := newJSONCtx(`{"name":"Acme"}`)
	h.UpdateTenant(ctx)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401", w.Code)
	}
}

func TestTenantHandler_UpdateTenant_InvalidBodyRejected(t *testing.T) {
	svc := &fakeTenantService{updateTenant: func(context.Context, uuid.UUID, UpdateTenantRequest) error {
		t.Fatal("service must not be called on validation failure")
		return nil
	}}
	h := NewTenantHandler(svc)

	// name too short (min=2)
	ctx, w := newJSONCtx(`{"name":"a"}`)
	withTenantID(ctx, uuidMust("11111111-1111-1111-1111-111111111111"))
	h.UpdateTenant(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400", w.Code)
	}
	if !strings.Contains(w.Body.String(), "VALIDATION_ERROR") {
		t.Errorf("expected VALIDATION_ERROR, got %s", w.Body.String())
	}
}

func TestTenantHandler_UpdateTenant_Success(t *testing.T) {
	tid := uuidMust("22222222-2222-2222-2222-222222222222")
	called := false
	svc := &fakeTenantService{updateTenant: func(_ context.Context, id uuid.UUID, r UpdateTenantRequest) error {
		called = true
		if id != tid {
			t.Errorf("id forwarded: got %v", id)
		}
		if r.Name != "Acme" {
			t.Errorf("Name: got %q", r.Name)
		}
		return nil
	}}
	h := NewTenantHandler(svc)

	ctx, w := newJSONCtx(`{"name":"Acme"}`)
	withTenantID(ctx, tid)
	h.UpdateTenant(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	if !called {
		t.Error("expected UpdateTenant to be called")
	}
}

func TestTenantHandler_UpdateTenant_NotFoundMapped(t *testing.T) {
	svc := &fakeTenantService{updateTenant: func(context.Context, uuid.UUID, UpdateTenantRequest) error {
		return domain.ErrTenantNotFound
	}}
	h := NewTenantHandler(svc)

	ctx, w := newJSONCtx(`{"name":"Acme"}`)
	withTenantID(ctx, uuidMust("33333333-3333-3333-3333-333333333333"))
	h.UpdateTenant(ctx)

	if w.Code != http.StatusNotFound {
		t.Fatalf("status: got %d want 404", w.Code)
	}
}

// runAllowed builds a router that optionally injects a role, then runs the
// IsUpdateTenantAllowed middleware followed by a probe handler, returning the
// recorder so the caller can assert on the outcome.
func runAllowed(role string, setRole bool) *httptest.ResponseRecorder {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	g := r.Group("/t")
	if setRole {
		g.Use(func(c *gin.Context) { c.Set(ctxutil.RoleKey, role) })
	}
	h := NewTenantHandler(&fakeTenantService{updateTenant: func(context.Context, uuid.UUID, UpdateTenantRequest) error {
		return nil
	}})
	g.Use(h.IsUpdateTenantAllowed)
	g.PATCH("/", func(c *gin.Context) { c.String(http.StatusOK, "reached") })

	req := httptest.NewRequest(http.MethodPatch, "/t/", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestIsUpdateTenantAllowed_OwnerPassesThrough(t *testing.T) {
	w := runAllowed(domain.UserRoleOwner, true)
	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (owner should pass through)", w.Code)
	}
	if w.Body.String() != "reached" {
		t.Errorf("expected the downstream handler to run, got %q", w.Body.String())
	}
}

func TestIsUpdateTenantAllowed_NonOwnerForbidden(t *testing.T) {
	w := runAllowed(domain.UserRoleGrower, true)
	if w.Code != http.StatusForbidden {
		t.Fatalf("status: got %d want 403", w.Code)
	}
	if !strings.Contains(w.Body.String(), "only owner can update tenant") {
		t.Errorf("expected 'only owner' message, got %s", w.Body.String())
	}
	if strings.Contains(w.Body.String(), "reached") {
		t.Error("downstream handler must not run for a non-owner")
	}
}

func TestIsUpdateTenantAllowed_NoRoleRejected(t *testing.T) {
	w := runAllowed("", false) // role never set
	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401", w.Code)
	}
	if !strings.Contains(w.Body.String(), "authentication required") {
		t.Errorf("expected 'authentication required', got %s", w.Body.String())
	}
}
