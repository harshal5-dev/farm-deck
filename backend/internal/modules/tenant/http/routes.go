package tenanthttp

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/tenant"
)

func Register(public, protected *gin.RouterGroup, h tenant.TenantHandler) {

	protectedRoutes := protected.Group("/tenants")
	protectedRoutes.PATCH("/me", h.IsUpdateTenantAllowed, h.UpdateTenant)
}
