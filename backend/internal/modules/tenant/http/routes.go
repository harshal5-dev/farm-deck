package tenanthttp

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/tenant"
)

func Register(public, protected *gin.RouterGroup, h tenant.TenantHandler) {

	protectedRoutes := protected.Group("/auth")
	protectedRoutes.PATCH("/tenant", h.IsUpdateTenantAllowed, h.UpdateTenant)
}
