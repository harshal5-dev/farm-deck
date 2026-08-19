package tenant

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/httperr"
	"github.com/harshal5-dev/farm-deck/backend/internal/response"
	"github.com/harshal5-dev/farm-deck/backend/pkg/ctxutil"
	"github.com/harshal5-dev/farm-deck/backend/pkg/validate"
)

type TenantHandler interface {
	UpdateTenant(ctx *gin.Context)
}

type TenantHandlerImpl struct {
	tenantService TenantService
}

func NewTenantHandler(tenantService TenantService) TenantHandler {
	return &TenantHandlerImpl{
		tenantService: tenantService,
	}
}

// UpdateTenant godoc
// @Summary      Update current tenant
// @Tags         tenant
// @Accept       json
// @Produce      json
// @Security     CookieAuth
// @Param        request body UpdateTenantRequest true "Tenant update payload"
// @Success      200 {object} response.APIResponse "tenant updated successfully"
// @Failure      400 {object} response.APIError "validation error"
// @Failure      401 {object} response.APIError "authentication required"
// @Failure      403 {object} response.APIError "requires permission: workspace.manage"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /tenants/me [patch]
//
// Authorization: gated by middlewares.RequirePermission(PermManageWorkspace)
// at the route level — see internal/modules/tenant/http/routes.go.
func (h *TenantHandlerImpl) UpdateTenant(ctx *gin.Context) {
	tenantID, err := ctxutil.GetTenantID(ctx)
	if err != nil {
		response.Unauthorized(ctx, "authentication required")
		return
	}

	var req UpdateTenantRequest
	if !validate.Bind(ctx, &req) {
		return
	}

	if err := h.tenantService.UpdateTenant(ctx, tenantID, req); err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	response.OK(ctx, "tenant updated successfully")
}
