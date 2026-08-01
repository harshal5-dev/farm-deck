package validate

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
)

type testRequest struct {
	EmailID  string `json:"emailId" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

func newTestContext(body string) (*gin.Context, *httptest.ResponseRecorder) {
	gin.SetMode(gin.TestMode)
	recorder := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(recorder)
	ctx.Request = httptest.NewRequest(http.MethodPost, "/", strings.NewReader(body))
	ctx.Request.Header.Set("Content-Type", "application/json")
	return ctx, recorder
}

func TestBind_ValidBody(t *testing.T) {
	ctx, recorder := newTestContext(`{"emailId":"a@b.com","password":"supersecret"}`)

	var req testRequest
	if !Bind(ctx, &req) {
		t.Fatalf("expected Bind to succeed, got %d: %s", recorder.Code, recorder.Body.String())
	}
	if req.EmailID != "a@b.com" || req.Password != "supersecret" {
		t.Fatalf("unexpected bind result: %+v", req)
	}
}

func TestBind_ValidationErrorsUseJSONFieldNames(t *testing.T) {
	ctx, recorder := newTestContext(`{"emailId":"not-an-email","password":"short"}`)

	var req testRequest
	if Bind(ctx, &req) {
		t.Fatal("expected Bind to fail")
	}
	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", recorder.Code)
	}

	var body struct {
		Error struct {
			Code    string       `json:"code"`
			Details []FieldError `json:"details"`
		} `json:"error"`
	}
	if err := json.Unmarshal(recorder.Body.Bytes(), &body); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if body.Error.Code != "VALIDATION_ERROR" {
		t.Fatalf("expected VALIDATION_ERROR code, got %q", body.Error.Code)
	}
	if len(body.Error.Details) != 2 {
		t.Fatalf("expected 2 field errors, got %d: %s", len(body.Error.Details), recorder.Body.String())
	}
	if body.Error.Details[0].Field != "emailId" || !strings.Contains(body.Error.Details[0].Message, "valid email") {
		t.Errorf("unexpected email error: %+v", body.Error.Details[0])
	}
	if body.Error.Details[1].Field != "password" || !strings.Contains(body.Error.Details[1].Message, "at least 8") {
		t.Errorf("unexpected password error: %+v", body.Error.Details[1])
	}
}

func TestBind_MissingRequiredField(t *testing.T) {
	ctx, recorder := newTestContext(`{"password":"supersecret"}`)

	var req testRequest
	if Bind(ctx, &req) {
		t.Fatal("expected Bind to fail")
	}
	if !strings.Contains(recorder.Body.String(), "emailId is required") {
		t.Fatalf("expected required message for emailId, got %s", recorder.Body.String())
	}
}

func TestBind_MalformedJSON(t *testing.T) {
	ctx, recorder := newTestContext(`{"emailId":`)

	var req testRequest
	if Bind(ctx, &req) {
		t.Fatal("expected Bind to fail")
	}
	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", recorder.Code)
	}
	if !strings.Contains(recorder.Body.String(), "BAD_REQUEST") {
		t.Fatalf("expected BAD_REQUEST code, got %s", recorder.Body.String())
	}
}

func TestBind_EmptyBody(t *testing.T) {
	ctx, recorder := newTestContext(``)

	var req testRequest
	if Bind(ctx, &req) {
		t.Fatal("expected Bind to fail")
	}
	if !strings.Contains(recorder.Body.String(), "request body is required") {
		t.Fatalf("expected body-required message, got %s", recorder.Body.String())
	}
}
