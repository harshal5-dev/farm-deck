package zone

import (
	"time"

	"github.com/google/uuid"
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
	ID              uuid.UUID `json:"id"`
	FarmID          uuid.UUID `json:"farmId"`
	ZoneTypeID      uuid.UUID `json:"zoneTypeId"`
	Name            string    `json:"name"`
	Area            *float64  `json:"area"`
	AreaUnit        string    `json:"areaUnit"`
	Notes           *string   `json:"notes"`
	IsActive        bool      `json:"isActive"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
	ZoneTypeName    string    `json:"zoneTypeName"`
	CultivationMode string    `json:"cultivationMode"`
	Description     *string   `json:"description"`
}
