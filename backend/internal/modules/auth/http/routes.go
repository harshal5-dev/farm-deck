package authhttp

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/auth"
)

func Register(public, protected *gin.RouterGroup, h auth.AuthHandler, appEnv string) {

	publicRoutes := public.Group("/auth")
	if appEnv == "dev" {
		publicRoutes.POST("/register", h.Register)
	}
	publicRoutes.POST("/login", h.Login)
	publicRoutes.POST("/refresh", h.Refresh)
	publicRoutes.GET("/verify-invitation", h.VerifyInvitation)
	publicRoutes.POST("/accept-invitation", h.AcceptInvitation)
	publicRoutes.POST("/logout", h.Logout)
}
