package userhttp

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/internal/middlewares"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/user"
)

func Register(public, protected *gin.RouterGroup, h user.UserHandler) {

	protectedRoutes := protected.Group("/users")
	protectedRoutes.GET("/me", h.GetCurrentProfile)
	protectedRoutes.PATCH("/me", h.UpdateProfile)

	protectedRoutes.POST("/members", middlewares.RequirePermission(domain.PermManageMembers), h.CreateMember)
	protectedRoutes.GET("/members", middlewares.RequirePermission(domain.PermViewMembers), h.ListMember)
	protectedRoutes.PATCH("/members/:memberId", middlewares.RequirePermission(domain.PermManageMembers), h.UpdateMember)
	protectedRoutes.DELETE("/members/:memberId", middlewares.RequirePermission(domain.PermManageMembers), h.DeleteMember)
}
