package authhttp

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/auth"
)

func Register(public, protected *gin.RouterGroup, h auth.AuthHandler) {
	publicRoutes := public.Group("/auth")

	protectedRoutes := protected.Group("/auth")
	protectedRoutes.GET("/profile", h.GetCurrentProfile)

	publicRoutes.POST("/register", h.Register)
	publicRoutes.POST("/login", h.Login)
}
