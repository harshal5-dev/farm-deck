package middlewares

import (
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
)

func TestParseAllowedOrigins(t *testing.T) {
	cases := []struct {
		name string
		in   string
		want []string
	}{
		{"empty falls back to default", "", defaultCORSAllowedOrigins},
		{"whitespace-only falls back to default", "   ", defaultCORSAllowedOrigins},
		{"single origin", "http://localhost:5173", []string{"http://localhost:5173"}},
		{"comma-separated multiple origins", "http://a.test,http://b.test", []string{"http://a.test", "http://b.test"}},
		{"trims surrounding whitespace per origin", " http://a.test , http://b.test ", []string{"http://a.test", "http://b.test"}},
		{"skips empty entries between commas", "http://a.test,,http://b.test", []string{"http://a.test", "http://b.test"}},
		{"all-empty entries fall back to default", " , , ", defaultCORSAllowedOrigins},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			got := parseAllowedOrigins(tc.in)
			if !reflect.DeepEqual(got, tc.want) {
				t.Errorf("got %v want %v", got, tc.want)
			}
		})
	}
}

func newCorsRouter(cfg config.Config) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(CorsMiddleware(cfg))
	r.GET("/", func(c *gin.Context) { c.String(http.StatusOK, "ok") })
	return r
}

func TestCorsMiddleware_PassesNonPreflightRequestsThrough(t *testing.T) {
	r := newCorsRouter(config.Config{CORSAllowedOrigins: "http://localhost:5173"})

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200", w.Code)
	}
	if w.Body.String() != "ok" {
		t.Errorf("handler was not reached, body=%q", w.Body.String())
	}
}

func TestCorsMiddleware_EchoesAllowedOrigin(t *testing.T) {
	origin := "http://localhost:5173"
	r := newCorsRouter(config.Config{CORSAllowedOrigins: origin})

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.Header.Set("Origin", origin)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if got := w.Header().Get("Access-Control-Allow-Origin"); got != origin {
		t.Errorf("Access-Control-Allow-Origin: got %q want %q", got, origin)
	}
	if v := w.Header().Get("Access-Control-Allow-Credentials"); v != "true" {
		t.Errorf("Access-Control-Allow-Credentials: got %q want %q", v, "true")
	}
}

func TestCorsMiddleware_DoesNotEchoUnknownOrigin(t *testing.T) {
	r := newCorsRouter(config.Config{CORSAllowedOrigins: "http://allowed.test"})

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.Header.Set("Origin", "http://evil.test")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if got := w.Header().Get("Access-Control-Allow-Origin"); got != "" {
		t.Errorf("expected no Allow-Origin for unlisted origin, got %q", got)
	}
}

func TestCorsMiddleware_ReturnsHandlerFunc(t *testing.T) {
	h := CorsMiddleware(config.Config{CORSAllowedOrigins: "http://localhost:5173"})
	if h == nil {
		t.Fatal("expected a non-nil gin.HandlerFunc")
	}
}
