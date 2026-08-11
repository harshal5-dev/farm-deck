package userhttp

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/user"
)

func Register(public, protected *gin.RouterGroup, h user.UserHandler) {

	protectedRoutes := protected.Group("/user")
	protectedRoutes.GET("/profile", h.GetCurrentProfile)
	protectedRoutes.PATCH("/profile", h.UpdateProfile)
}
