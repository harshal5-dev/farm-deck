package userhttp

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/user"
)

func Register(public, protected *gin.RouterGroup, h user.UserHandler) {

	protectedRoutes := protected.Group("/users")
	protectedRoutes.GET("/me", h.GetCurrentProfile)
	protectedRoutes.PATCH("/me", h.UpdateProfile)
}
