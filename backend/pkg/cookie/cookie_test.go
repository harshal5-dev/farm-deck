package cookie_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/pkg/cookie"
)

func newCtx() (*gin.Context, *httptest.ResponseRecorder) {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(w)
	ctx.Request = httptest.NewRequest(http.MethodGet, "/", nil)
	return ctx, w
}

func baseCfg() cookie.Config {
	return cookie.Config{
		CookieSecure:           true,
		CookieHttpOnly:         true,
		CookieDomain:           "localhost",
		CookieTokenName:        "access_token",
		CookieRefreshTokenName: "refresh_token",
	}
}

// findCookie returns the parsed cookie with the given name, or nil.
func findCookie(t *testing.T, w *httptest.ResponseRecorder, name string) *http.Cookie {
	t.Helper()
	for _, c := range w.Result().Cookies() {
		if c.Name == name {
			return c
		}
	}
	return nil
}

func TestSetAuthCookie_Attributes(t *testing.T) {
	ctx, w := newCtx()
	cfg := baseCfg()

	cookie.SetAuthCookie(ctx, "the-token", time.Hour, cfg)

	c := findCookie(t, w, cfg.CookieTokenName)
	if c == nil {
		t.Fatalf("expected %q cookie to be set, headers=%v", cfg.CookieTokenName, w.HeaderMap.Values("Set-Cookie"))
	}
	if c.Value != "the-token" {
		t.Errorf("value: got %q want %q", c.Value, "the-token")
	}
	if c.MaxAge != int(time.Hour.Seconds()) {
		t.Errorf("maxage: got %d want %d", c.MaxAge, int(time.Hour.Seconds()))
	}
	if c.Domain != "localhost" {
		t.Errorf("domain: got %q want %q", c.Domain, "localhost")
	}
	if !c.Secure {
		t.Error("expected Secure=true")
	}
	if !c.HttpOnly {
		t.Error("expected HttpOnly=true")
	}
	if c.SameSite != http.SameSiteLaxMode {
		t.Errorf("expected SameSite=Lax, got %v", c.SameSite)
	}
}

func TestSetRefreshCookie_Attributes(t *testing.T) {
	ctx, w := newCtx()
	cfg := baseCfg()

	cookie.SetRefreshCookie(ctx, "refresh-value", 30*time.Minute, cfg)

	c := findCookie(t, w, cfg.CookieRefreshTokenName)
	if c == nil {
		t.Fatalf("expected %q cookie to be set", cfg.CookieRefreshTokenName)
	}
	if c.Value != "refresh-value" {
		t.Errorf("value: got %q", c.Value)
	}
	if c.MaxAge != int((30 * time.Minute).Seconds()) {
		t.Errorf("maxage: got %d want %d", c.MaxAge, int((30*time.Minute).Seconds()))
	}
}

func TestClearAuthCookie_EmptiesValue(t *testing.T) {
	ctx, w := newCtx()
	cfg := baseCfg()

	cookie.ClearAuthCookie(ctx, cfg)

	c := findCookie(t, w, cfg.CookieTokenName)
	if c == nil {
		t.Fatalf("expected %q cookie to be set for clearing", cfg.CookieTokenName)
	}
	if c.Value != "" {
		t.Errorf("expected empty value to clear cookie, got %q", c.Value)
	}
}

func TestClearRefreshCookie_EmptiesValue(t *testing.T) {
	ctx, w := newCtx()
	cfg := baseCfg()

	cookie.ClearRefreshCookie(ctx, cfg)

	c := findCookie(t, w, cfg.CookieRefreshTokenName)
	if c == nil {
		t.Fatalf("expected %q cookie to be set for clearing", cfg.CookieRefreshTokenName)
	}
	if c.Value != "" {
		t.Errorf("expected empty value to clear cookie, got %q", c.Value)
	}
}

func TestSetAuthCookie_RespectsInsecureFlags(t *testing.T) {
	ctx, w := newCtx()
	cfg := baseCfg()
	cfg.CookieSecure = false
	cfg.CookieHttpOnly = false

	cookie.SetAuthCookie(ctx, "tok", time.Hour, cfg)

	c := findCookie(t, w, cfg.CookieTokenName)
	if c == nil {
		t.Fatal("expected cookie to be set")
	}
	if c.Secure {
		t.Error("expected Secure=false")
	}
	if c.HttpOnly {
		t.Error("expected HttpOnly=false")
	}
}
