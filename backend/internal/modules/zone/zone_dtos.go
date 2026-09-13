package zone

import (
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
)

type CreateZoneRequest struct {
	Area                   *float64               `json:"area" example:"12.5"`
	ZoneTypeName           string                 `json:"zoneTypeName" binding:"required,min=2,max=255" example:"soil"`
	Name                   string                 `json:"name" binding:"required,min=2,max=255" example:"Greenfield Orchard"`
	AreaUnit               string                 `json:"areaUnit" binding:"required,min=2,max=50" example:"acres"`
	Notes                  *string                `json:"notes" example:"North-facing slope, drip irrigation installed"`
	FarmID                 uuid.UUID              `json:"farmID" binding:"required" example:"3fa85f64-5717-4562-b3fc-2c963f66afa6"`
	ZoneTypeID             uuid.UUID              `json:"zoneTypeID" binding:"required" example:"3fa85f64-5717-4562-b3fc-2c963f66afa6"`
	SoilTypeDetails        SoilTypeRequest        `json:"soilTypeDetails"`
	HydroSystemTypeDetails HydroSystemTypeRequest `json:"hydroSystemTypeDetails"`
}

type UpdateZoneRequest struct {
	Area                   *float64               `json:"area" example:"12.5"`
	Name                   string                 `json:"name" binding:"required,min=2,max=255" example:"Greenfield Orchard"`
	AreaUnit               string                 `json:"areaUnit" binding:"required,min=2,max=50" example:"acres"`
	Notes                  *string                `json:"notes" example:"North-facing slope, drip irrigation installed"`
	SoilTypeDetails        SoilTypeRequest        `json:"soilTypeDetails"`
	HydroSystemTypeDetails HydroSystemTypeRequest `json:"hydroSystemTypeDetails"`
}

type SoilTypeRequest struct {
	SoilTypeID uuid.UUID `json:"soilTypeID" example:"3fa85f64-5717-4562-b3fc-2c963f66afa6"`
}

type HydroSystemTypeRequest struct {
	HydroSystemTypeID     uuid.UUID `json:"hydroSystemTypeID" example:"3fa85f64-5717-4562-b3fc-2c963f66afa6"`
	GrowMedium            *string   `json:"growMedium" example:"perlite"`
	ReservoirVolumeLiters *float64  `json:"reservoirVolumeLiters" example:"100000"`
	NumberOfSlots         *int32    `json:"numberOfSlots" example:"10"`
}

type ListZonesInfo struct {
	ID                     uuid.UUID               `json:"id"`
	FarmID                 uuid.UUID               `json:"farmId"`
	ZoneTypeID             uuid.UUID               `json:"zoneTypeId"`
	Name                   string                  `json:"name"`
	Area                   *float64                `json:"area"`
	AreaUnit               string                  `json:"areaUnit"`
	Notes                  *string                 `json:"notes"`
	IsActive               bool                    `json:"isActive"`
	CreatedAt              time.Time               `json:"createdAt"`
	UpdatedAt              time.Time               `json:"updatedAt"`
	ZoneTypeName           string                  `json:"zoneTypeName"`
	CultivationMode        string                  `json:"cultivationMode"`
	ZoneTypeDisplayName    string                  `json:"zoneTypeDisplayName"`
	FarmName               string                  `json:"farmName"`
	SoilTypeDetails        *ZoneSoilTypeDetails    `json:"soilTypeDetails"`
	HydroSystemTypeDetails *ZoneHydroSystemDetails `json:"hydroSystemTypeDetails"`
}

// ZoneSoilTypeDetails — the soil half of a zone's cultivation details,
// only present for soil-mode zones.
type ZoneSoilTypeDetails struct {
	SoilTypeID     uuid.UUID `json:"soilTypeID"`
	DisplayName    string    `json:"displayName"`
	WaterRetention string    `json:"waterRetention"`
	Drainage       string    `json:"drainage"`
}

// ZoneHydroSystemDetails — the hydroponic half, only present for hydro zones.
type ZoneHydroSystemDetails struct {
	HydroSystemTypeID     uuid.UUID `json:"hydroSystemTypeID"`
	DisplayName           string    `json:"displayName"`
	GrowMedium            *string   `json:"growMedium"`
	ReservoirVolumeLiters *float64  `json:"reservoirVolumeLiters"`
	NumberOfSlots         *int32    `json:"numberOfSlots"`
}

type ListZonesArgs struct {
	Page       int    `form:"page"       json:"page"       binding:"omitempty,min=1,max=10000"`
	PageSize   int    `form:"pageSize"   json:"pageSize"   binding:"omitempty,min=1,max=100"`
	FarmID     string `form:"farmID"     json:"farmID"     binding:"omitempty,uuid"`
	ZoneTypeID string `form:"zoneTypeID" json:"zoneTypeID" binding:"omitempty,uuid"`
	Status     string `form:"status"     json:"status"     binding:"omitempty,oneof=all active inactive"`
	Search     string `form:"q"          json:"q"          binding:"omitempty,max=100"`
	Sort       string `form:"sort"       json:"sort"       binding:"omitempty,oneof=recent name newest size"`
}

// effectivePaging resolves the defaults once for both Normalize (offset math)
// and the response echo — omitted params must not echo back as 0.
func (a ListZonesArgs) effectivePaging() (page, pageSize int) {
	page = a.Page
	if page == 0 {
		page = defaultZonesPage
	}
	pageSize = a.PageSize
	if pageSize == 0 {
		pageSize = defaultZonesPageSize
	}
	return page, pageSize
}

func (a ListZonesArgs) Normalize(tenantID uuid.UUID) (db.ListZonesParams, error) {
	page, pageSize := a.effectivePaging()

	params := db.ListZonesParams{
		TenantID: tenantID,                     // security scope — never from the query
		Offset:   int32((page - 1) * pageSize), // derived, never trusted from client
		Limit:    int32(pageSize),
	}

	if id := a.FarmID; id != "" {
		farmUUID, err := uuid.Parse(id)
		if err != nil {
			return params, fmt.Errorf("invalid farmID: %w", err)
		}
		params.FarmID = &farmUUID
	}
	if id := a.ZoneTypeID; id != "" {
		typeUUID, err := uuid.Parse(id)
		if err != nil {
			return params, fmt.Errorf("invalid zoneTypeID: %w", err)
		}
		params.ZoneTypeID = &typeUUID
	}

	switch a.Status { // "all"/"" → nil pointer → filter off (the IS NULL path)
	case "active":
		v := true
		params.IsActive = &v
	case "inactive":
		v := false
		params.IsActive = &v
	}

	if q := strings.TrimSpace(a.Search); q != "" {
		params.Search = &q
	}

	return params, nil
}

type ListZonesResponse struct {
	Page       int             `json:"page"`
	PageSize   int             `json:"pageSize"`
	Active     int64           `json:"active"`
	Inactive   int64           `json:"inactive"`
	Total      int64           `json:"total"`
	TotalPages int64           `json:"totalPages"`
	Zones      []ListZonesInfo `json:"zones"`
}
