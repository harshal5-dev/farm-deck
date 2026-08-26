package lookup

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/httperr"
	"github.com/harshal5-dev/farm-deck/backend/internal/response"
)

type LookupHandler interface {
	ListFarmTypes(ctx *gin.Context)
	ListZoneTypes(ctx *gin.Context)
	ListSoilTypes(ctx *gin.Context)
	ListHydroSystemTypes(ctx *gin.Context)
}

type LookupHandlerImpl struct {
	lookupService LookupService
}

func NewLookupHandler(lookupService LookupService) LookupHandler {
	return &LookupHandlerImpl{
		lookupService: lookupService,
	}
}

// ListFarmTypes godoc
// @Summary      List farm types
// @Description  Returns the available farm (growing environment) types, e.g. indoor, outdoor, greenhouse, mixed.
// @Tags         lookup
// @Produce      json
// @Security     CookieAuth
// @Success      200 {object} response.APIResponse{data=[]lookup.FarmTypeResponse} "list of farm types"
// @Failure      401 {object} response.APIError "authentication required"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /lookups/farm-types [get]
func (h *LookupHandlerImpl) ListFarmTypes(ctx *gin.Context) {
	farmTypes, err := h.lookupService.ListFarmTypes(ctx)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	response.OK(ctx, farmTypes)
}

// ListZoneTypes godoc
// @Summary      List zone types
// @Description  Returns the available zone (production area) types within a farm, e.g. soil plot, hydroponic system, aquaponic, mushroom room, along with their cultivation mode.
// @Tags         lookup
// @Produce      json
// @Security     CookieAuth
// @Success      200 {object} response.APIResponse{data=[]lookup.ZoneTypeResponse} "list of zone types"
// @Failure      401 {object} response.APIError "authentication required"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /lookups/zone-types [get]
func (h *LookupHandlerImpl) ListZoneTypes(ctx *gin.Context) {
	zoneTypes, err := h.lookupService.ListZoneTypes(ctx)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	response.OK(ctx, zoneTypes)
}

// ListSoilTypes godoc
// @Summary      List soil types
// @Description  Returns the available soil types with their water retention and drainage characteristics, e.g. loamy, sandy, clay, silt, sandy loam, clay loam.
// @Tags         lookup
// @Produce      json
// @Security     CookieAuth
// @Success      200 {object} response.APIResponse{data=[]lookup.SoilTypeResponse} "list of soil types"
// @Failure      401 {object} response.APIError "authentication required"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /lookups/soil-types [get]
func (h *LookupHandlerImpl) ListSoilTypes(ctx *gin.Context) {
	soilTypes, err := h.lookupService.ListSoilTypes(ctx)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	response.OK(ctx, soilTypes)
}

// ListHydroSystemTypes godoc
// @Summary      List hydroponic system types
// @Description  Returns the available hydroponic system types, e.g. NFT, DWC, Ebb & Flow, aeroponics, drip, Kratky.
// @Tags         lookup
// @Produce      json
// @Security     CookieAuth
// @Success      200 {object} response.APIResponse{data=[]lookup.HydroSystemTypeResponse} "list of hydroponic system types"
// @Failure      401 {object} response.APIError "authentication required"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /lookups/hydro-system-types [get]
func (h *LookupHandlerImpl) ListHydroSystemTypes(ctx *gin.Context) {
	hydroSystemTypes, err := h.lookupService.ListHydroSystemTypes(ctx)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	response.OK(ctx, hydroSystemTypes)
}
