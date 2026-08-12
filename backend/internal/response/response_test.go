package response_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/response"
)

// newTestContext returns a gin context wired to a recorder, with a request set
// (required for ctx.JSON to operate on a complete context).
func newTestContext() (*gin.Context, *httptest.ResponseRecorder) {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(w)
	ctx.Request = httptest.NewRequest(http.MethodGet, "/", nil)
	return ctx, w
}

// successEnvelope decodes the success body. Data is kept as raw JSON to allow
// precise assertions.
type successEnvelope struct {
	Success   bool            `json:"success"`
	Timestamp string          `json:"timestamp"`
	Data      json.RawMessage `json:"data,omitempty"`
}

type errorEnvelope struct {
	Success   bool   `json:"success"`
	Timestamp string `json:"timestamp"`
	Error     struct {
		Code    string          `json:"code"`
		Message string          `json:"message"`
		Details json.RawMessage `json:"details,omitempty"`
	} `json:"error"`
}

func assertRFC3339(t *testing.T, ts string) {
	t.Helper()
	if _, err := time.Parse(time.RFC3339, ts); err != nil {
		t.Errorf("timestamp %q is not a valid RFC3339 time: %v", ts, err)
	}
}

func TestSuccess_WritesEnvelopeWithProvidedStatus(t *testing.T) {
	ctx, w := newTestContext()

	response.Success(ctx, http.StatusCreated, map[string]string{"hello": "world"})

	if w.Code != http.StatusCreated {
		t.Fatalf("status: got %d want %d", w.Code, http.StatusCreated)
	}
	var body successEnvelope
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if !body.Success {
		t.Error("expected success=true")
	}
	if string(body.Data) == "" {
		t.Fatal("expected data to be present")
	}
	var got map[string]string
	if err := json.Unmarshal(body.Data, &got); err != nil {
		t.Fatalf("data did not decode: %v", err)
	}
	if got["hello"] != "world" {
		t.Errorf("data: got %v", got)
	}
	assertRFC3339(t, body.Timestamp)
}

func TestOK_DefaultsTo200(t *testing.T) {
	ctx, w := newTestContext()
	response.OK(ctx, "payload")
	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200", w.Code)
	}
}

func TestCreated_DefaultsTo201(t *testing.T) {
	ctx, w := newTestContext()
	response.Created(ctx, "payload")
	if w.Code != http.StatusCreated {
		t.Fatalf("status: got %d want 201", w.Code)
	}
}

func TestSuccess_OmitsDataWhenNil(t *testing.T) {
	ctx, w := newTestContext()
	response.OK(ctx, nil)

	if strings.Contains(w.Body.String(), `"data"`) {
		t.Errorf("expected data key to be omitted for nil payload, got %s", w.Body.String())
	}
}

func TestError_WritesErrorEnvelope(t *testing.T) {
	ctx, w := newTestContext()

	response.Error(ctx, http.StatusTeapot, "IM_A_TEAPOT", "short and stout")

	if w.Code != http.StatusTeapot {
		t.Fatalf("status: got %d want %d", w.Code, http.StatusTeapot)
	}
	var body errorEnvelope
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if body.Success {
		t.Error("expected success=false")
	}
	if body.Error.Code != "IM_A_TEAPOT" {
		t.Errorf("code: got %q want IM_A_TEAPOT", body.Error.Code)
	}
	if body.Error.Message != "short and stout" {
		t.Errorf("message: got %q", body.Error.Message)
	}
	if len(body.Error.Details) != 0 {
		t.Errorf("expected no details for plain Error, got %s", body.Error.Details)
	}
	assertRFC3339(t, body.Timestamp)
}

func TestErrorWithDetails_IncludesDetails(t *testing.T) {
	ctx, w := newTestContext()
	details := []map[string]string{{"field": "email", "reason": "invalid"}}

	response.ErrorWithDetails(ctx, http.StatusBadRequest, "VALIDATION_ERROR", "bad input", details)

	var body errorEnvelope
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if len(body.Error.Details) == 0 {
		t.Fatalf("expected details to be present, body=%s", w.Body.String())
	}
	var got []map[string]string
	if err := json.Unmarshal(body.Error.Details, &got); err != nil {
		t.Fatalf("details did not decode: %v", err)
	}
	if got[0]["field"] != "email" {
		t.Errorf("details: got %v", got)
	}
}

func TestConvenienceHelpers(t *testing.T) {
	cases := []struct {
		name        string
		invoke      func(ctx *gin.Context)
		wantStatus  int
		wantCode    string
		wantMessage string
	}{
		{"BadRequest", func(c *gin.Context) { response.BadRequest(c, "malformed body") }, http.StatusBadRequest, "BAD_REQUEST", "malformed body"},
		{"Unauthorized", func(c *gin.Context) { response.Unauthorized(c, "log in first") }, http.StatusUnauthorized, "UNAUTHORIZED", "log in first"},
		{"Forbidden", func(c *gin.Context) { response.Forbidden(c, "no access") }, http.StatusForbidden, "FORBIDDEN", "no access"},
		{"NotFound", func(c *gin.Context) { response.NotFound(c, "missing thing") }, http.StatusNotFound, "NOT_FOUND", "missing thing"},
		{"Conflict", func(c *gin.Context) { response.Conflict(c, "already there") }, http.StatusConflict, "CONFLICT", "already there"},
		{"InternalError", func(c *gin.Context) { response.InternalError(c, "boom") }, http.StatusInternalServerError, "INTERNAL_ERROR", "boom"},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			ctx, w := newTestContext()
			tc.invoke(ctx)

			if w.Code != tc.wantStatus {
				t.Fatalf("status: got %d want %d", w.Code, tc.wantStatus)
			}
			var body errorEnvelope
			if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
				t.Fatalf("invalid json: %v", err)
			}
			if body.Success {
				t.Error("expected success=false")
			}
			if body.Error.Code != tc.wantCode {
				t.Errorf("code: got %q want %q", body.Error.Code, tc.wantCode)
			}
			if body.Error.Message != tc.wantMessage {
				t.Errorf("message: got %q want %q", body.Error.Message, tc.wantMessage)
			}
		})
	}
}

func TestValidationError_UsesFixedMessageAndForwardsDetails(t *testing.T) {
	ctx, w := newTestContext()
	response.ValidationError(ctx, map[string]string{"email": "required"})

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400", w.Code)
	}
	var body errorEnvelope
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if body.Error.Code != "VALIDATION_ERROR" {
		t.Errorf("code: got %q want VALIDATION_ERROR", body.Error.Code)
	}
	if body.Error.Message != "request validation failed" {
		t.Errorf("message: got %q want %q", body.Error.Message, "request validation failed")
	}
	var details map[string]string
	if err := json.Unmarshal(body.Error.Details, &details); err != nil {
		t.Fatalf("details did not decode: %v", err)
	}
	if details["email"] != "required" {
		t.Errorf("details: got %v", details)
	}
}
