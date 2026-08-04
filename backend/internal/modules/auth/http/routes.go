package authhttp

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/auth"
)

func Register(public, protected *gin.RouterGroup, h auth.AuthHandler) {
	publicRoutes := public.Group("/auth")

	protectedRoutes := protected.Group("/auth")
	protectedRoutes.GET("/profile", h.GetCurrentProfile)
	protectedRoutes.PATCH("/profile", h.UpdateProfile)
	protectedRoutes.PATCH("/tenant", h.IsUpdateTenantAllowed, h.UpdateTenant)

	publicRoutes.POST("/register", h.Register)
	publicRoutes.POST("/login", h.Login)
	publicRoutes.POST("/refresh", h.Refresh)
	publicRoutes.POST("/logout", h.Logout)
}
