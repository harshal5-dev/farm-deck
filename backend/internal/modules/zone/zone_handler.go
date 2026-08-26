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
