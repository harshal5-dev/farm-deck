package lookuphttp

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/lookup"
)

func Register(public, protected *gin.RouterGroup, h lookup.LookupHandler) {

	protectedRoutes := protected.Group("/lookups")
	protectedRoutes.GET("/farm-types", h.ListFarmTypes)
	protectedRoutes.GET("/zone-types", h.ListZoneTypes)
	protectedRoutes.GET("/soil-types", h.ListSoilTypes)
	protectedRoutes.GET("/hydro-system-types", h.ListHydroSystemTypes)
}
