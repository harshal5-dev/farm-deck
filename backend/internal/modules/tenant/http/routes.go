package tenanthttp

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/internal/middlewares"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/tenant"
)

func Register(public, protected *gin.RouterGroup, h tenant.TenantHandler) {

	protectedRoutes := protected.Group("/tenants")
	protectedRoutes.PATCH("/me", middlewares.RequirePermission(domain.PermManageWorkspace), h.UpdateTenant)
}
