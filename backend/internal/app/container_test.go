package app_test

import (
	"testing"
	"time"

	"github.com/harshal5-dev/farm-deck/backend/internal/app"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
)

// mockStore satisfies db.Store for the wiring smoke test. None of its methods
// are called during NewContainer construction, so a nil embedded interface is
// sufficient.
type mockStore struct {
	db.Store
}

func testConfig() config.Config {
	return config.Config{
		DatabaseURL:           "postgres://u:p@localhost:5432/test",
		ServerAddress:         ":0",
		CORSAllowedOrigins:    "http://localhost:5173",
		JWTSecret:             "test-secret",
		JWTIssuer:             "test-issuer",
		CookieTokenName:       "access_token",
		CookieRefreshTokenName: "refresh_token",
		MailFromAddress:       "noreply@test.local",
		SMTPHost:              "localhost",
		SMTPPort:              25,
		SMTPUsername:          "u",
		SMTPPassword:          "p",
		AccessTokenDuration:   time.Hour,
		RefreshTokenDuration:  720 * time.Hour,
	}
}

func TestNewContainer_WiresAllLayers(t *testing.T) {
	container := app.NewContainer(testConfig(), &mockStore{})

	// Config is carried through unchanged.
	if container.Config.JWTSecret != "test-secret" {
		t.Errorf("Config.JWTSecret = %q", container.Config.JWTSecret)
	}
	if container.Store == nil {
		t.Error("expected Store to be set")
	}

	// Repositories.
	if container.Repositories.Credential == nil {
		t.Error("expected Credential repo to be wired")
	}
	if container.Repositories.User == nil {
		t.Error("expected User repo to be wired")
	}
	if container.Repositories.RefreshToken == nil {
		t.Error("expected RefreshToken repo to be wired")
	}
	if container.Repositories.Tenant == nil {
		t.Error("expected Tenant repo to be wired")
	}

	// Services.
	if container.Services.Auth == nil {
		t.Error("expected Auth service to be wired")
	}
	if container.Services.User == nil {
		t.Error("expected User service to be wired")
	}
	if container.Services.Tenant == nil {
		t.Error("expected Tenant service to be wired")
	}
	if container.Services.Email == nil {
		t.Error("expected Email service to be wired")
	}

	// Handlers.
	if container.Handlers.Auth == nil {
		t.Error("expected Auth handler to be wired")
	}
	if container.Handlers.User == nil {
		t.Error("expected User handler to be wired")
	}
	if container.Handlers.Tenant == nil {
		t.Error("expected Tenant handler to be wired")
	}

	// Mailer.
	if container.Mailer == nil {
		t.Error("expected Mailer to be wired")
	}
}
