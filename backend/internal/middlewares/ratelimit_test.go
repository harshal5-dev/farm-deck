package middlewares

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/pkg/ctxutil"
	"github.com/harshal5-dev/farm-deck/backend/pkg/ratelimit"
)

// newRateLimitRouter wires the middleware under test with a burst-2
// limiter and a probe handler, mirroring the auth middleware test setup.
func newRateLimitRouter(keyFn KeyFunc, reached *int) *gin.Engine {
	gin.SetMode(gin.TestMode)
	limiter := ratelimit.NewLimiter(ratelimit.Config{Rate: 1, Burst: 2, CleanupInterval: -1})
	r := gin.New()
	r.Use(RateLimitMiddleware(limiter, keyFn))
	r.GET("/limited", func(c *gin.Context) {
		*reached++
		c.String(http.StatusOK, "reached")
	})
	return r
}

func doGetFromIP(r *gin.Engine, remoteAddr string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(http.MethodGet, "/limited", nil)
	req.RemoteAddr = remoteAddr
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestRateLimitMiddleware_PassesWithinBurst(t *testing.T) {
	reached := 0
	r := newRateLimitRouter(IPKey, &reached)

	for i := 1; i <= 2; i++ {
		w := doGetFromIP(r, "1.2.3.4:1000")
		if w.Code != http.StatusOK {
			t.Fatalf("request %d within burst: got %d want 200", i, w.Code)
		}
	}
	if reached != 2 {
		t.Fatalf("downstream handler runs: got %d want 2", reached)
	}
}

func TestRateLimitMiddleware_Returns429BeyondBurst(t *testing.T) {
	reached := 0
	r := newRateLimitRouter(IPKey, &reached)

	doGetFromIP(r, "1.2.3.4:1000")
	doGetFromIP(r, "1.2.3.4:1000")
	w := doGetFromIP(r, "1.2.3.4:1000")

	if w.Code != http.StatusTooManyRequests {
		t.Fatalf("status: got %d want 429", w.Code)
	}
	if reached != 2 {
		t.Fatalf("downstream handler must not run when throttled: got %d runs", reached)
	}

	retryAfter := w.Header().Get("Retry-After")
	if retryAfter == "" {
		t.Error("429 response must set the Retry-After header")
	}

	var body struct {
		Success bool `json:"success"`
		Error   struct {
			Code    string `json:"code"`
			Message string `json:"message"`
			Details struct {
				RetryAfterSeconds int `json:"retryAfterSeconds"`
			} `json:"details"`
		} `json:"error"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if body.Error.Code != "RATE_LIMITED" {
		t.Errorf("code: got %q want RATE_LIMITED", body.Error.Code)
	}
	if body.Error.Details.RetryAfterSeconds < 1 {
		t.Errorf("details.retryAfterSeconds: got %d, want >= 1", body.Error.Details.RetryAfterSeconds)
	}
}

func TestRateLimitMiddleware_IPsHaveIndependentBuckets(t *testing.T) {
	reached := 0
	r := newRateLimitRouter(IPKey, &reached)

	// Exhaust 1.2.3.4's bucket.
	doGetFromIP(r, "1.2.3.4:1000")
	doGetFromIP(r, "1.2.3.4:1000")
	if w := doGetFromIP(r, "1.2.3.4:1000"); w.Code != http.StatusTooManyRequests {
		t.Fatalf("exhausted IP: got %d want 429", w.Code)
	}

	// A different IP is unaffected.
	if w := doGetFromIP(r, "5.6.7.8:1000"); w.Code != http.StatusOK {
		t.Fatalf("other IP: got %d want 200", w.Code)
	}
	if reached != 3 {
		t.Fatalf("handler runs: got %d want 3", reached)
	}
}

func TestUserKey_UsesUserIDWhenPresent(t *testing.T) {
	gin.SetMode(gin.TestMode)
	uid := uuid.MustParse("99999999-9999-9999-9999-999999999999")

	c, _ := gin.CreateTestContext(httptest.NewRecorder())
	c.Request = httptest.NewRequest(http.MethodGet, "/", nil)
	c.Request.RemoteAddr = "1.2.3.4:1000"

	if got := UserKey(c); got != "ip:1.2.3.4" {
		t.Fatalf("anonymous request should fall back to IP key, got %q", got)
	}

	c.Set(ctxutil.UserIDKey, uid)
	if got := UserKey(c); got != "user:"+uid.String() {
		t.Fatalf("authenticated request should key by user, got %q", got)
	}
}
