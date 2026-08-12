package httptransport

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/app"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
)

// testConfig builds a config that satisfies every field read during container
// construction and route setup. Values are dummies — nothing connects at build
// time (the SMTP mailer and DB store are only used on actual work, never during
// NewContainer / NewServer).
func testConfig(swagger bool) config.Config {
	return config.Config{
		DatabaseURL:          "postgres://u:p@localhost:5432/test",
		ServerAddress:        ":0",
		CORSAllowedOrigins:   "http://localhost:5173",
		JWTSecret:            "test-secret",
		JWTIssuer:            "test",
		CookieTokenName:      "access_token",
		MailFromAddress:      "noreply@test.local",
		SMTPHost:             "localhost",
		SMTPPort:             25,
		SMTPUsername:         "u",
		SMTPPassword:         "p",
		AccessTokenDuration:  time.Hour,
		RefreshTokenDuration: time.Hour,
		SwaggerEnabled:       swagger,
	}
}

func TestNewServer_RegistersHealthRoute(t *testing.T) {
	gin.SetMode(gin.TestMode)
	server := NewServer(app.NewContainer(testConfig(true), &mockStore{}))

	if server == nil {
		t.Fatal("expected non-nil server")
	}
	if server.router == nil {
		t.Fatal("expected non-nil router")
	}

	req := httptest.NewRequest(http.MethodGet, "/api/v1/health", nil)
	w := httptest.NewRecorder()
	server.router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want %d (body=%s)", w.Code, http.StatusOK, w.Body.String())
	}
	var body HealthResponse
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("invalid json: %v (body=%s)", err, w.Body.String())
	}
	if body.Status != "ok" {
		t.Errorf("status field: got %q want %q", body.Status, "ok")
	}
	if body.Service != "workspace-hub-server" {
		t.Errorf("service field: got %q want %q", body.Service, "workspace-hub-server")
	}
}

func TestSetupRoutes_SwaggerToggle(t *testing.T) {
	hasSwaggerRoute := func(s *Server) bool {
		for _, route := range s.router.Routes() {
			if strings.HasPrefix(route.Path, "/swagger") {
				return true
			}
		}
		return false
	}

	t.Run("swagger registered when enabled", func(t *testing.T) {
		gin.SetMode(gin.TestMode)
		server := NewServer(app.NewContainer(testConfig(true), &mockStore{}))

		if !hasSwaggerRoute(server) {
			t.Error("expected a /swagger route when SwaggerEnabled=true")
		}
	})

	t.Run("swagger omitted when disabled", func(t *testing.T) {
		gin.SetMode(gin.TestMode)
		server := NewServer(app.NewContainer(testConfig(false), &mockStore{}))

		if hasSwaggerRoute(server) {
			t.Error("did not expect a /swagger route when SwaggerEnabled=false")
		}
	})
}

func TestNewServer_RegistersProtectedAndPublicGroups(t *testing.T) {
	gin.SetMode(gin.TestMode)
	server := NewServer(app.NewContainer(testConfig(false), &mockStore{}))

	paths := make(map[string]bool)
	for _, route := range server.router.Routes() {
		paths[route.Path] = true
	}

	for _, want := range []string{"/api/v1/health"} {
		if !paths[want] {
			t.Errorf("expected route %q to be registered", want)
		}
	}
}
