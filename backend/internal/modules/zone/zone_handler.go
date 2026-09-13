package zone

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/httperr"
	"github.com/harshal5-dev/farm-deck/backend/internal/response"
	"github.com/harshal5-dev/farm-deck/backend/pkg/ctxutil"
	"github.com/harshal5-dev/farm-deck/backend/pkg/validate"
)

type ZoneHandler interface {
	CreateZone(ctx *gin.Context)
	ListZone(ctx *gin.Context)
	UpdateZone(ctx *gin.Context)
}

type ZoneHandlerImpl struct {
	zoneService ZoneService
}

func NewZoneHandler(zoneService ZoneService) ZoneHandler {
	return &ZoneHandlerImpl{
		zoneService: zoneService,
	}
}

// CreateZone godoc
// @Summary      Create a new zone
// @Description  Creates a zone (field) on a farm owned by the caller's tenant. The zone type's cultivation mode drives which detail section is required — soil zones carry soil type details, hydro zones carry hydroponic system details. Authorization is gated by the fields.manage permission at the route level.
// @Tags         zone
// @Accept       json
// @Produce      json
// @Security     CookieAuth
// @Param        request body CreateZoneRequest true "Zone create payload"
// @Success      200 {object} response.APIResponse "zone created successfully"
// @Failure      400 {object} response.APIError "validation error"
// @Failure      401 {object} response.APIError "authentication required"
// @Failure      403 {object} response.APIError "insufficient permissions"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /zones [post]
func (h *ZoneHandlerImpl) CreateZone(ctx *gin.Context) {
	tenantID, err := ctxutil.GetTenantID(ctx)
	if err != nil {
		response.Unauthorized(ctx, "authentication required")
		return
	}

	var req CreateZoneRequest
	if !validate.Bind(ctx, &req) {
		return
	}

	err = h.zoneService.CreateZone(ctx, tenantID, req)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}

	response.OK(ctx, "zone created successfully")
}

func (h *ZoneHandlerImpl) UpdateZone(ctx *gin.Context) {
	tenantID, err := ctxutil.GetTenantID(ctx)
	if err != nil {
		response.Unauthorized(ctx, "authentication required")
		return
	}

	zoneID, err := ctxutil.ParseParamID(ctx, "id")
	if err != nil {
		response.BadRequest(ctx, "invalid zone id")
		return
	}

	var req UpdateZoneRequest
	if !validate.Bind(ctx, &req) {
		return
	}

	err = h.zoneService.UpdateZone(ctx, tenantID, zoneID, req)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}

	response.OK(ctx, "zone updated successfully")
}

// ListZones godoc
// @Summary      List tenant fields
// @Description  Returns the caller's fields with pagination, optional filters and
// @Description  status counts. Omitted params fall back to defaults; filters are
// @Description  AND-combined and scoped to the caller's tenant.
// @Tags         zone
// @Produce      json
// @Security     CookieAuth
// @Param        page       query int    false "1-based page number (default 1)"
// @Param        pageSize   query int    false "Rows per page, 1–100 (default 6)"
// @Param        farmID     query string false "Filter by farm UUID"
// @Param        zoneTypeID query string false "Filter by zone type UUID"
// @Param        status     query string false "all | active | inactive (default all)" Enums(all,active,inactive)
// @Param        q          query string false "Search by field name, farm name"
// @Param        sort       query string false "recent | name | newest | size (default recent)" Enums(recent,name,newest,size)
// @Success      200 {object} response.APIResponse{data=zone.ListZonesResponse} "paginated fields with counts"
// @Failure      400 {object} response.APIError "invalid query parameters"
// @Failure      401 {object} response.APIError "authentication required"
// @Failure      403 {object} response.APIError "insufficient permissions"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /zones [get]
func (h *ZoneHandlerImpl) ListZone(ctx *gin.Context) {
	tenantID, err := ctxutil.GetTenantID(ctx)
	if err != nil {
		response.Unauthorized(ctx, "authentication required")
		return
	}

	var args ListZonesArgs
	if !validate.BindQuery(ctx, &args) {
		return
	}

	result, err := h.zoneService.ListZones(ctx, tenantID, args)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	response.OK(ctx, result)
}
