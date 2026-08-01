// Package response provides standard success and error response envelopes
// for HTTP handlers. Every handler should respond via these helpers so that
// clients see a consistent shape.
package response

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// APIResponse is the standard success envelope.
//
//	{
//	  "success":   true,
//	  "data":      <T>,
//	  "timestamp": "2026-08-01T17:00:00Z"
//	}
type APIResponse struct {
	Success   bool   `json:"success"`
	Data      any    `json:"data,omitempty"`
	Timestamp string `json:"timestamp"`
}

// APIError is the standard error envelope.
//
//	{
//	  "success":   false,
//	  "error":     { "code": "VALIDATION_ERROR", "message": "...", "details": [...] },
//	  "timestamp": "2026-08-01T17:00:00Z"
//	}
type APIError struct {
	Success   bool        `json:"success"`
	Error     ErrorDetail `json:"error"`
	Timestamp string      `json:"timestamp"`
}

// ErrorDetail carries a machine-readable code, a human message, and optional
// structured details (e.g. field-level validation errors).
type ErrorDetail struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details any    `json:"details,omitempty"`
}

func Success(ctx *gin.Context, status int, data any) {
	ctx.JSON(status, APIResponse{
		Success:   true,
		Data:      data,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	})
}

func OK(ctx *gin.Context, data any) {
	Success(ctx, http.StatusOK, data)
}

func Created(ctx *gin.Context, data any) {
	Success(ctx, http.StatusCreated, data)
}

func Error(ctx *gin.Context, status int, code, message string) {
	ctx.JSON(status, APIError{
		Success:   false,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Error: ErrorDetail{
			Code:    code,
			Message: message,
		},
	})
}

func ErrorWithDetails(ctx *gin.Context, status int, code, message string, details any) {
	ctx.JSON(status, APIError{
		Success:   false,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Error: ErrorDetail{
			Code:    code,
			Message: message,
			Details: details,
		},
	})
}

func BadRequest(ctx *gin.Context, message string) {
	Error(ctx, http.StatusBadRequest, "BAD_REQUEST", message)
}

func ValidationError(ctx *gin.Context, details any) {
	ErrorWithDetails(ctx, http.StatusBadRequest, "VALIDATION_ERROR", "request validation failed", details)
}

func Unauthorized(ctx *gin.Context, message string) {
	Error(ctx, http.StatusUnauthorized, "UNAUTHORIZED", message)
}

func Forbidden(ctx *gin.Context, message string) {
	Error(ctx, http.StatusForbidden, "FORBIDDEN", message)
}

func NotFound(ctx *gin.Context, message string) {
	Error(ctx, http.StatusNotFound, "NOT_FOUND", message)
}

func Conflict(ctx *gin.Context, message string) {
	Error(ctx, http.StatusConflict, "CONFLICT", message)
}

func InternalError(ctx *gin.Context, message string) {
	Error(ctx, http.StatusInternalServerError, "INTERNAL_ERROR", message)
}
