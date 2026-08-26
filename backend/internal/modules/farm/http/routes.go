package farmhttp

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/farm"
)

func Register(public, protected *gin.RouterGroup, h farm.FarmHandler) {

	protectedRoutes := protected.Group("/farms")
	protectedRoutes.GET("", h.ListFarms)
	protectedRoutes.POST("", h.CreateFarm)
	protectedRoutes.PUT("/:id", h.UpdateFarm)
	protectedRoutes.PATCH("/:id", h.DeactivateFarm)
	protectedRoutes.PATCH("/:id/activate", h.ActivateFarm)
}
