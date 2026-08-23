package lookup

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/httperr"
	"github.com/harshal5-dev/farm-deck/backend/internal/response"
)

type LookupHandler interface {
	ListFarmTypes(ctx *gin.Context)
}

type LookupHandlerImpl struct {
	lookupService LookupService
}

func NewLookupHandler(lookupService LookupService) LookupHandler {
	return &LookupHandlerImpl{
		lookupService: lookupService,
	}
}

func (h *LookupHandlerImpl) ListFarmTypes(ctx *gin.Context) {
	farmTypes, err := h.lookupService.ListFarmTypes(ctx)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	response.OK(ctx, farmTypes)
}
