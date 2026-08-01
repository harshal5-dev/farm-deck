// Package httperr maps domain/service errors to HTTP responses in one place.
//
// Services and repositories return sentinel errors (see internal/domain),
// wrapped with context using fmt.Errorf("...: %w", err). Handlers pass any
// error to HandleError, which picks the right status code and a safe,
// client-facing message. Internal details of unexpected errors are logged
// server-side only and never leaked to clients.
package httperr

import (
	"errors"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/internal/response"
)

// HandleError writes the HTTP response for err. Handlers should call it and
// return immediately:
//
//	if err := h.service.Do(ctx, req); err != nil {
//		httperr.HandleError(ctx, err)
//		return
//	}
func HandleError(ctx *gin.Context, err error) {
	switch {
	case errors.Is(err, domain.ErrUserExists),
		errors.Is(err, domain.ErrTenantExists):
		response.Conflict(ctx, messageOf(err))

	case errors.Is(err, domain.ErrUserNotFound),
		errors.Is(err, domain.ErrTenantNotFound):
		response.NotFound(ctx, messageOf(err))

	case errors.Is(err, domain.ErrInvalidCredentials):
		response.Unauthorized(ctx, domain.ErrInvalidCredentials.Error())

	default:
		log.Printf("internal error: %s %s: %v", ctx.Request.Method, ctx.Request.URL.Path, err)
		response.InternalError(ctx, "something went wrong, please try again later")
	}
}

// messageOf unwraps err down to the matched sentinel and returns its message,
// so wrap context (e.g. "register user: ") is not exposed to clients.
func messageOf(err error) string {
	for _, sentinel := range []error{
		domain.ErrUserExists,
		domain.ErrTenantExists,
		domain.ErrUserNotFound,
		domain.ErrTenantNotFound,
	} {
		if errors.Is(err, sentinel) {
			return sentinel.Error()
		}
	}
	return err.Error()
}
