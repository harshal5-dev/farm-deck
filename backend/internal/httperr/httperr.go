package httperr

import (
	"errors"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/internal/response"
)

func HandleError(ctx *gin.Context, err error) {
	switch {
	case errors.Is(err, domain.ErrUserExists),
		errors.Is(err, domain.ErrTenantExists):
		response.Conflict(ctx, messageOf(err))

	case errors.Is(err, domain.ErrUserNotFound),
		errors.Is(err, domain.ErrTenantNotFound):
		response.NotFound(ctx, messageOf(err))

	case errors.Is(err, domain.ErrInvalidCredentials),
		errors.Is(err, domain.ErrCredentialNotFound):
		response.Unauthorized(ctx, domain.ErrInvalidCredentials.Error())

	case errors.Is(err, domain.ErrRefreshTokenInvalid),
		errors.Is(err, domain.ErrRefreshTokenExpired):
		response.Unauthorized(ctx, "session expired, please log in again")

	case errors.Is(err, domain.ErrInvitationInvalid),
		errors.Is(err, domain.ErrInvitationExpired),
		errors.Is(err, domain.ErrInvitationRevoked):
		response.BadRequest(ctx, messageOf(err))

	case errors.Is(err, domain.ErrInvitationAccepted):
		response.Conflict(ctx, messageOf(err))

	case errors.Is(err, domain.ErrForbidden):
		response.Forbidden(ctx, messageOf(err))

	case errors.Is(err, domain.ErrFarmNotFound):
		response.NotFound(ctx, messageOf(err))

	default:
		log.Printf("internal error: %s %s: %v", ctx.Request.Method, ctx.Request.URL.Path, err)
		response.InternalError(ctx, "something went wrong, please try again later")
	}
}

func messageOf(err error) string {
	for _, sentinel := range []error{
		domain.ErrUserExists,
		domain.ErrTenantExists,
		domain.ErrUserNotFound,
		domain.ErrTenantNotFound,
		domain.ErrInvitationInvalid,
		domain.ErrInvitationExpired,
		domain.ErrInvitationRevoked,
		domain.ErrInvitationAccepted,
		domain.ErrFarmNotFound,
	} {
		if errors.Is(err, sentinel) {
			return sentinel.Error()
		}
	}
	return err.Error()
}
