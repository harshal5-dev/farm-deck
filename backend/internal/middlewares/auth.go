package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/internal/httperr"
	"github.com/harshal5-dev/farm-deck/backend/pkg/ctxutil"
	"github.com/harshal5-dev/farm-deck/backend/pkg/jwt"
)

func AuthMiddleware(cookieTokenName, jwtSecret string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenString, err := ctx.Cookie(cookieTokenName)
		if err != nil {
			httperr.HandleError(ctx, domain.ErrUnauthorized)
			ctx.Abort()
			return
		}

		claims, err := jwt.VerifyToken(tokenString, jwtSecret)
		if err != nil {
			httperr.HandleError(ctx, domain.ErrUnauthorized)
			ctx.Abort()
			return
		}

		ctx.Set(ctxutil.UserIDKey, claims.UserId)
		ctx.Set(ctxutil.TenantIDKey, claims.TenantId)
		ctx.Set(ctxutil.RoleKey, claims.Role)

		ctx.Next()
	}
}

func RequirePermission(perm domain.Permission) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		role, err := ctxutil.GetRole(ctx)
		if err != nil {
			httperr.HandleError(ctx, domain.ErrUnauthorized)
			ctx.Abort()
			return
		}
		if !domain.HasPermission(role, perm) {
			httperr.HandleError(ctx, domain.ErrForbidden)
			ctx.Abort()
			return
		}
		ctx.Next()
	}
}
