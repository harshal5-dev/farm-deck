package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/ctxutil"
	"github.com/harshal5-dev/farm-deck/backend/pkg/jwt"
)

func AuthMiddleware(cookieTokenName, jwtSecret string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenString, err := ctx.Cookie(cookieTokenName)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized - no token provided"})
			return
		}

		claims, err := jwt.VerifyToken(tokenString, jwtSecret)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized - invalid or expired token"})
			return
		}

		ctx.Set(ctxutil.UserIDKey, claims.UserId)
		ctx.Set(ctxutil.TenantIDKey, claims.TenantId)

		ctx.Next()
	}
}
