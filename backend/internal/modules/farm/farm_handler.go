package farm

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/httperr"
	"github.com/harshal5-dev/farm-deck/backend/internal/response"
	"github.com/harshal5-dev/farm-deck/backend/pkg/ctxutil"
	"github.com/harshal5-dev/farm-deck/backend/pkg/validate"
)

type FarmHandler interface {
	CreateFarm(ctx *gin.Context)
	ListFarms(ctx *gin.Context)
	UpdateFarm(ctx *gin.Context)
	InactivateFarm(ctx *gin.Context)
	ActivateFarm(ctx *gin.Context)
}

type FarmHandlerImpl struct {
	farmService FarmService
}

func NewFarmHandler(farmService FarmService) FarmHandler {
	return &FarmHandlerImpl{farmService: farmService}
}

// CreateFarm godoc
// @Summary      Create a new farm
// @Description  Creates a farm owned by the caller's tenant. Authorization is gated by the workspace.manage permission at the route level.
// @Tags         farm
// @Accept       json
// @Produce      json
// @Security     CookieAuth
// @Param        request body ManageFarmRequest true "Farm create payload"
// @Success      200 {object} response.APIResponse "farm created successfully"
// @Failure      400 {object} response.APIError "validation error"
// @Failure      401 {object} response.APIError "authentication required"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /farms [post]
func (h *FarmHandlerImpl) CreateFarm(ctx *gin.Context) {
	tenantID, err := ctxutil.GetTenantID(ctx)
	if err != nil {
		response.Unauthorized(ctx, "authentication required")
		return
	}

	var req ManageFarmRequest
	if !validate.Bind(ctx, &req) {
		return
	}

	err = h.farmService.CreateFarm(ctx, tenantID, req)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}

	response.OK(ctx, "farm created successfully")
}

// ListFarms godoc
// @Summary      List tenant farms
// @Description  Returns every farm belonging to the caller's tenant, along with active/inactive counts.
// @Tags         farm
// @Produce      json
// @Security     CookieAuth
// @Success      200 {object} response.APIResponse{data=farm.ListFarmResponse} "tenant farms with status counts"
// @Failure      401 {object} response.APIError "authentication required"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /farms [get]
func (h *FarmHandlerImpl) ListFarms(ctx *gin.Context) {
	tenantID, err := ctxutil.GetTenantID(ctx)
	if err != nil {
		response.Unauthorized(ctx, "authentication required")
		return
	}

	farms, err := h.farmService.ListFarms(ctx, tenantID)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}

	response.OK(ctx, farms)
}

// UpdateFarm godoc
// @Summary      Update a farm
// @Description  Updates the farm with the given id. Authorization is gated by the workspace.manage permission at the route level.
// @Tags         farm
// @Accept       json
// @Produce      json
// @Security     CookieAuth
// @Param        id path string true "Farm ID"
// @Param        request body ManageFarmRequest true "Farm update payload"
// @Success      200 {object} response.APIResponse "farm updated successfully"
// @Failure      400 {object} response.APIError "invalid farm id or validation error"
// @Failure      401 {object} response.APIError "authentication required"
// @Failure      404 {object} response.APIError "farm not found"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /farms/{id} [put]
func (h *FarmHandlerImpl) UpdateFarm(ctx *gin.Context) {
	farmID, err := ctxutil.ParseParamID(ctx, "id")
	if err != nil {
		response.BadRequest(ctx, "invalid farm id")
		return
	}

	var req ManageFarmRequest
	if !validate.Bind(ctx, &req) {
		return
	}

	err = h.farmService.UpdateFarm(ctx, farmID, req)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}

	response.OK(ctx, "farm updated successfully")
}

// InactivateFarm godoc
// @Summary      Inactivate a farm
// @Description  Soft-deactivates the farm with the given id (sets is_active=false). Authorization is gated by the workspace.manage permission at the route level.
// @Tags         farm
// @Produce      json
// @Security     CookieAuth
// @Param        id path string true "Farm ID"
// @Success      200 {object} response.APIResponse "farm inactivated successfully"
// @Failure      400 {object} response.APIError "invalid farm id"
// @Failure      401 {object} response.APIError "authentication required"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /farms/{id} [patch]
func (h *FarmHandlerImpl) InactivateFarm(ctx *gin.Context) {
	farmID, err := ctxutil.ParseParamID(ctx, "id")
	if err != nil {
		response.BadRequest(ctx, "invalid farm id")
		return
	}

	err = h.farmService.InactivateFarm(ctx, farmID)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}

	response.OK(ctx, "farm inactivated successfully")
}

// ActivateFarm godoc
// @Summary      Activate a farm
// @Description  Reactivates the farm with the given id (sets is_active=true). Authorization is gated by the workspace.manage permission at the route level.
// @Tags         farm
// @Produce      json
// @Security     CookieAuth
// @Param        id path string true "Farm ID"
// @Success      200 {object} response.APIResponse "farm activated successfully"
// @Failure      400 {object} response.APIError "invalid farm id"
// @Failure      401 {object} response.APIError "authentication required"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /farms/{id}/activate [patch]
func (h *FarmHandlerImpl) ActivateFarm(ctx *gin.Context) {
	farmID, err := ctxutil.ParseParamID(ctx, "id")
	if err != nil {
		response.BadRequest(ctx, "invalid farm id")
		return
	}

	err = h.farmService.ActivateFarm(ctx, farmID)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}

	response.OK(ctx, "farm activated successfully")
}
