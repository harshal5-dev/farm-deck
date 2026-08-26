package zonehttp

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/internal/middlewares"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/zone"
)

func Register(public, protected *gin.RouterGroup, h zone.ZoneHandler) {
	protectedRoutes := protected.Group("/zones")

	protectedRoutes.POST("", middlewares.RequirePermission(domain.PermManageFields), h.CreateZone)
}
