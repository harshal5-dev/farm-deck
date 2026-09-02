package middlewares

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
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

// -------------------------------------------------------------------------
//  RequirePermission
// -------------------------------------------------------------------------
//
// Each test wires RequirePermission into a mini-router so we exercise the
// real gin middleware path: AuthMiddleware sets the role → RequirePermission
// reads it → handler runs (200) or middleware aborts (401/403). Roles are
// injected via a tiny middleware that mirrors what AuthMiddleware does.

func withRole(role string) gin.HandlerFunc {
	return func(c *gin.Context) { c.Set(ctxutil.RoleKey, role) }
}

// runPerm wires RequirePermission followed by a probe handler that returns
// 200 with the literal body "reached". `setRole` toggles whether the role
// is actually placed on the context (we use it to drive the missing-role
// path).
func runPerm(perm domain.Permission, role string, setRole bool) *httptest.ResponseRecorder {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	g := r.Group("/p")
	if setRole {
		g.Use(withRole(role))
	}
	g.Use(RequirePermission(perm))
	g.GET("/", func(c *gin.Context) { c.String(http.StatusOK, "reached") })

	req := httptest.NewRequest(http.MethodGet, "/p/", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestRequirePermission_OwnerAlwaysPasses(t *testing.T) {
	// Owner is a wildcard in HasPermission — no matter which permission
	// we ask for, an owner passes through.
	for _, p := range []domain.Permission{
		domain.PermViewMembers, domain.PermManageMembers, domain.PermManageWorkspace,
	} {
		w := runPerm(p, domain.RoleOwner, true)
		if w.Code != http.StatusOK {
			t.Errorf("owner + %s: got %d want 200", p, w.Code)
		}
		if w.Body.String() != "reached" {
			t.Errorf("owner + %s: downstream handler must run, got %q", p, w.Body.String())
		}
	}
}

func TestRequirePermission_ManagerPassesMemberPerms(t *testing.T) {
	// Manager has PermManageMembers + PermViewMembers per the role map.
	cases := []struct {
		perm     domain.Permission
		wantCode int
		pass     bool
	}{
		{domain.PermManageMembers, http.StatusOK, true},
		{domain.PermViewMembers, http.StatusOK, true},
		// Manager does NOT have billing/workspace perms.
		{domain.PermManageWorkspace, http.StatusForbidden, false},
	}
	for _, c := range cases {
		w := runPerm(c.perm, domain.RoleManager, true)
		if w.Code != c.wantCode {
			t.Errorf("manager + %s: got %d want %d", c.perm, w.Code, c.wantCode)
		}
		if c.pass && !strings.Contains(w.Body.String(), "reached") {
			t.Errorf("manager + %s: downstream handler must run", c.perm)
		}
		if !c.pass && strings.Contains(w.Body.String(), "reached") {
			t.Errorf("manager + %s: downstream handler must NOT run", c.perm)
		}
	}
}

func TestRequirePermission_GrowerForbiddenFromMembersAndAdmin(t *testing.T) {
	// Grower has no member-management or admin perms. Should 403 on each.
	for _, p := range []domain.Permission{
		domain.PermViewMembers, domain.PermManageMembers,
	} {
		w := runPerm(p, domain.RoleGrower, true)
		if w.Code != http.StatusForbidden {
			t.Errorf("grower + %s: got %d want 403", p, w.Code)
		}
		if strings.Contains(w.Body.String(), "reached") {
			t.Errorf("grower + %s: downstream handler must NOT run", p)
		}
	}
}

func TestRequirePermission_ViewerAllowedReadOnly(t *testing.T) {
	// Viewer has only "view" perms (no manage, no member access).
	cases := []struct {
		perm domain.Permission
		pass bool
	}{
		{domain.PermViewFarms, true},
		{domain.PermViewFields, true},
		{domain.PermViewCrops, true},
		{domain.PermViewHarvests, true},
		{domain.PermManageFarms, false},
		{domain.PermViewMembers, false},
	}
	for _, c := range cases {
		w := runPerm(c.perm, domain.RoleViewer, true)
		if !c.pass && w.Code != http.StatusForbidden {
			t.Errorf("viewer + %s: got %d want 403", c.perm, w.Code)
		}
		if c.pass && w.Code != http.StatusOK {
			t.Errorf("viewer + %s: got %d want 200", c.perm, w.Code)
		}
	}
}

func TestRequirePermission_ForbiddenBodyIncludesRequiredAndRole(t *testing.T) {
	// The 403 response should expose {required, role} in error.details so
	// the frontend (and tests) can introspect what was missing.
	w := runPerm(domain.PermManageWorkspace, domain.RoleGrower, true)

	if w.Code != http.StatusForbidden {
		t.Fatalf("status: got %d want 403", w.Code)
	}
	var body struct {
		Success bool `json:"success"`
		Error   struct {
			Code    string         `json:"code"`
			Message string         `json:"message"`
			Details map[string]any `json:"details"`
		} `json:"error"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if body.Error.Code != "FORBIDDEN" {
		t.Errorf("code: got %q want FORBIDDEN", body.Error.Code)
	}
	if got, ok := body.Error.Details["required"].(string); !ok || got != "billing.manage" {
		t.Errorf("details.required: got %v want billing.manage", body.Error.Details["required"])
	}
	if got, ok := body.Error.Details["role"].(string); !ok || got != "grower" {
		t.Errorf("details.role: got %v want grower", body.Error.Details["role"])
	}
}

func TestRequirePermission_MissingRoleIs401(t *testing.T) {
	w := runPerm(domain.PermViewMembers, "", false) // role never set
	if w.Code != http.StatusUnauthorized {
		t.Errorf("missing role: got %d want 401", w.Code)
	}
}

func TestRequirePermission_UnknownRoleIs403(t *testing.T) {
	// A role string that isn't in the map should NOT be silently treated
	// as owner or anything else. Defensive — any unknown role denied.
	w := runPerm(domain.PermViewMembers, "intern", true)
	if w.Code != http.StatusForbidden {
		t.Errorf("unknown role: got %d want 403", w.Code)
	}
}
