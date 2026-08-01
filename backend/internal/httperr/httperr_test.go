package httperr

import (
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

func handle(err error) *httptest.ResponseRecorder {
	gin.SetMode(gin.TestMode)
	recorder := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(recorder)
	ctx.Request = httptest.NewRequest(http.MethodPost, "/", nil)
	HandleError(ctx, err)
	return recorder
}

func TestHandleError_StatusMapping(t *testing.T) {
	tests := []struct {
		name       string
		err        error
		wantStatus int
		wantBody   string
	}{
		{"user exists", domain.ErrUserExists, http.StatusConflict, "user already exists"},
		{"tenant exists", domain.ErrTenantExists, http.StatusConflict, "tenant already exists"},
		{"user not found", domain.ErrUserNotFound, http.StatusNotFound, "user not found"},
		{"tenant not found", domain.ErrTenantNotFound, http.StatusNotFound, "tenant not found"},
		{"invalid credentials", domain.ErrInvalidCredentials, http.StatusUnauthorized, "invalid email or password"},
		{"unknown error", errors.New("db connection refused"), http.StatusInternalServerError, "something went wrong"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			recorder := handle(tt.err)
			if recorder.Code != tt.wantStatus {
				t.Errorf("expected status %d, got %d", tt.wantStatus, recorder.Code)
			}
			if !strings.Contains(recorder.Body.String(), tt.wantBody) {
				t.Errorf("expected body to contain %q, got %s", tt.wantBody, recorder.Body.String())
			}
		})
	}
}

func TestHandleError_WrappedSentinelKeepsMapping(t *testing.T) {
	wrapped := fmt.Errorf("register user: %w", domain.ErrUserExists)
	recorder := handle(wrapped)

	if recorder.Code != http.StatusConflict {
		t.Fatalf("expected 409, got %d", recorder.Code)
	}
	body := recorder.Body.String()
	if !strings.Contains(body, "user already exists") {
		t.Errorf("expected sentinel message, got %s", body)
	}
	if strings.Contains(body, "register user:") {
		t.Errorf("wrap context leaked to client: %s", body)
	}
}

func TestHandleError_InternalErrorNotLeaked(t *testing.T) {
	recorder := handle(errors.New("pq: password authentication failed for user \"admin\""))

	if recorder.Code != http.StatusInternalServerError {
		t.Fatalf("expected 500, got %d", recorder.Code)
	}
	if strings.Contains(recorder.Body.String(), "pq:") {
		t.Errorf("internal error leaked to client: %s", recorder.Body.String())
	}
}
