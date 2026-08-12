package config

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestParseEnvFile(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, ".env")

	// Covers: simple KEY=VALUE, surrounding whitespace, comments, blank lines,
	// and quote-stripping for both " and '.
	content := "" +
		"# a comment\n" +
		"\n" +
		"DATABASE_URL=postgres://localhost/db\n" +
		"  PADDED  =  padded-value  \n" +
		`DOUBLE="double-quoted"` + "\n" +
		`SINGLE='single-quoted'` + "\n" +
		"NOEQUALS_LINE_SHOULD_BE_SKIPPED\n"
	if err := os.WriteFile(path, []byte(content), 0o600); err != nil {
		t.Fatalf("write temp env: %v", err)
	}

	got, err := parseEnvFile(path)
	if err != nil {
		t.Fatalf("parseEnvFile: %v", err)
	}

	expectations := map[string]string{
		"DATABASE_URL": "postgres://localhost/db",
		"PADDED":       "padded-value",
		"DOUBLE":       "double-quoted",
		"SINGLE":       "single-quoted",
	}
	for k, want := range expectations {
		if got[k] != want {
			t.Errorf("%q = %q, want %q", k, got[k], want)
		}
	}

	// Lines without an "=" must be skipped, not stored under a weird key.
	if _, ok := got["NOEQUALS_LINE_SHOULD_BE_SKIPPED"]; ok {
		t.Error("a line without '=' should have been skipped")
	}
}

func TestParseEnvFile_MissingFileReturnsError(t *testing.T) {
	if _, err := parseEnvFile(filepath.Join(t.TempDir(), "does-not-exist")); err == nil {
		t.Fatal("expected an error for a missing file, got nil")
	}
}

func TestCollectFromFilesThenEnv_IncludesOSEnviron(t *testing.T) {
	t.Setenv("FARMDECK_TEST_COLLECT_KEY", "collected-value")

	got := collectFromFilesThenEnv()

	if got["FARMDECK_TEST_COLLECT_KEY"] != "collected-value" {
		t.Errorf("expected os env var to be merged in, got %q", got["FARMDECK_TEST_COLLECT_KEY"])
	}
}

func setRequired(t *testing.T) {
	t.Helper()
	required := map[string]string{
		"DATABASE_URL":           "postgres://u:p@localhost:5432/test",
		"CORS_ALLOWED_ORIGINS":   "http://localhost:5173",
		"JWT_SECRET":             "test-secret",
		"JWT_ISSUER":             "test-issuer",
		"MAIL_FROM_ADDRESS":      "noreply@test.local",
		"SMTP_USERNAME":          "u",
		"SMTP_PASSWORD":          "p",
		"ACCESS_TOKEN_DURATION":  "1h",
		"REFRESH_TOKEN_DURATION": "720h",
	}
	for k, v := range required {
		t.Setenv(k, v)
	}
}

func TestLoad_ParsesRequiredAndAppliesDefaults(t *testing.T) {
	setRequired(t)

	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load: %v", err)
	}

	// Required values come through from the environment.
	if cfg.DatabaseURL != "postgres://u:p@localhost:5432/test" {
		t.Errorf("DatabaseURL = %q", cfg.DatabaseURL)
	}
	if cfg.JWTSecret != "test-secret" {
		t.Errorf("JWTSecret = %q", cfg.JWTSecret)
	}
	if cfg.JWTIssuer != "test-issuer" {
		t.Errorf("JWTIssuer = %q", cfg.JWTIssuer)
	}

	// Parsed (non-string) duration fields.
	if cfg.AccessTokenDuration != time.Hour {
		t.Errorf("AccessTokenDuration = %v, want 1h", cfg.AccessTokenDuration)
	}
	if cfg.RefreshTokenDuration != 720*time.Hour {
		t.Errorf("RefreshTokenDuration = %v, want 720h", cfg.RefreshTokenDuration)
	}

	// Defaults declared via envDefault tags are applied.
	if cfg.CookieTokenName != "access_token" {
		t.Errorf("default CookieTokenName = %q, want %q", cfg.CookieTokenName, "access_token")
	}
	if cfg.ServerAddress != ":8083" {
		t.Errorf("default ServerAddress = %q, want %q", cfg.ServerAddress, ":8083")
	}
	if !cfg.CookieSecure {
		t.Error("default CookieSecure should be true")
	}
	if !cfg.SwaggerEnabled {
		t.Error("default SwaggerEnabled should be true")
	}
}

func TestLoad_MissingRequiredFieldReturnsError(t *testing.T) {
	// Ensure no required vars leak in from the ambient environment.
	for _, k := range []string{
		"DATABASE_URL", "CORS_ALLOWED_ORIGINS", "JWT_SECRET", "JWT_ISSUER",
		"MAIL_FROM_ADDRESS", "SMTP_USERNAME", "SMTP_PASSWORD",
		"ACCESS_TOKEN_DURATION", "REFRESH_TOKEN_DURATION",
	} {
		os.Unsetenv(k)
	}

	if _, err := Load(); err == nil {
		t.Fatal("expected Load to fail when required fields are missing, got nil")
	}
}
