package farmhttp

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/internal/middlewares"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/farm"
)

func Register(public, protected *gin.RouterGroup, h farm.FarmHandler) {

	protectedRoutes := protected.Group("/farms")
	protectedRoutes.GET("", h.ListFarms)

	manage := middlewares.RequirePermission(domain.PermManageFarms)
	protectedRoutes.POST("", manage, h.CreateFarm)
	protectedRoutes.PUT("/:id", manage, h.UpdateFarm)
	protectedRoutes.PATCH("/:id", manage, h.DeactivateFarm)
	protectedRoutes.PATCH("/:id/activate", manage, h.ActivateFarm)
}
