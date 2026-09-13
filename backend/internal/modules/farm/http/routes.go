package farmhttp

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/internal/middlewares"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/farm"
)

func Register(public, protected *gin.RouterGroup, h farm.FarmHandler) {

	protectedRoutes := protected.Group("/farms")
	protectedRoutes.GET("", middlewares.RequirePermission(domain.PermViewFarms), h.ListFarms)

	protectedRoutes.POST("", middlewares.RequirePermission(domain.PermManageFarms), h.CreateFarm)
	protectedRoutes.PUT("/:id", middlewares.RequirePermission(domain.PermManageFarms), h.UpdateFarm)
	protectedRoutes.PATCH("/:id", middlewares.RequirePermission(domain.PermManageFarms), h.DeactivateFarm)
	protectedRoutes.PATCH("/:id/activate", middlewares.RequirePermission(domain.PermManageFarms), h.ActivateFarm)
}
