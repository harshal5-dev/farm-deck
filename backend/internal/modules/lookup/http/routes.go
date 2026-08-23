package lookuphttp

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/lookup"
)

func Register(public, protected *gin.RouterGroup, h lookup.LookupHandler) {

	protectedRoutes := protected.Group("/lookups")
	protectedRoutes.GET("/farm-types", h.ListFarmTypes)
}
