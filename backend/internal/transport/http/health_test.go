package httptransport

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestHealthCheck_ReturnsOK(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// healthCheck does not read any Server fields, so a zero Server is enough.
	server := &Server{}
	r.GET("/health", server.healthCheck)

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want %d", w.Code, http.StatusOK)
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
