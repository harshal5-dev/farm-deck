package response

import (
	"math"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Success   bool   `json:"success"`
	Data      any    `json:"data,omitempty"`
	Meta      *Meta  `json:"meta,omitempty"`
	Timestamp string `json:"timestamp"`
}

type Meta struct {
	Page       int `json:"page,omitempty"`
	PerPage    int `json:"perPage,omitempty"`
	Total      int `json:"total,omitempty"`
	TotalPages int `json:"totalPages,omitempty"`
}

type APIError struct {
	Success   bool        `json:"success"`
	Error     ErrorDetail `json:"error"`
	Meta      *Meta       `json:"meta,omitempty"`
	Timestamp string      `json:"timestamp"`
}

type ErrorDetail struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details any    `json:"details,omitempty"`
}

func NewPagination(page, perPage, total int) *Meta {
	return &Meta{
		Page:       page,
		PerPage:    perPage,
		Total:      total,
		TotalPages: int(math.Ceil(float64(total) / float64(perPage))),
	}
}

func NewTotal(total int) *Meta {
	return &Meta{
		Total: total,
	}
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

func Paginated(ctx *gin.Context, status int, data any, meta *Meta) {
	ctx.JSON(status, APIResponse{
		Success:   true,
		Data:      data,
		Meta:      meta,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	})
}

func OKPaginated(ctx *gin.Context, data any, meta *Meta) {
	Paginated(ctx, http.StatusOK, data, meta)
}

func OKTotal(ctx *gin.Context, data any, meta *Meta) {
	Paginated(ctx, http.StatusOK, data, meta)
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
