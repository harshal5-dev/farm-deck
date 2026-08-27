package farm

import (
	"time"

	"github.com/google/uuid"
)

type ManageFarmRequest struct {
	Latitude   *float64  `json:"latitude" example:"18.5204"`
	Longitude  *float64  `json:"longitude" example:"73.8567"`
	TotalArea  *float64  `json:"totalArea" example:"12.5"`
	Name       string    `json:"name" binding:"required,min=2,max=255" example:"Greenfield Orchard"`
	Location   *string   `json:"location" example:"Pune, MH"`
	AreaUnit   string    `json:"areaUnit" binding:"required,min=2,max=50" example:"acres"`
	Notes      *string   `json:"notes" example:"North-facing slope, drip irrigation installed"`
	FarmTypeID uuid.UUID `json:"farmTypeID" binding:"required" example:"3fa85f64-5717-4562-b3fc-2c963f66afa6"`
}

type FarmInfo struct {
	Latitude            *float64  `json:"latitude" example:"18.5204"`
	Longitude           *float64  `json:"longitude" example:"73.8567"`
	TotalArea           *float64  `json:"totalArea" example:"12.5"`
	Name                string    `json:"name" example:"Greenfield Orchard"`
	FarmTypeName        string    `json:"farmTypeName" example:"Outdoor"`
	FarmTypeDisplayName string    `json:"farmTypeDisplayName" example:"Outdoor Farm"`
	Location            *string   `json:"location" example:"Pune, MH"`
	AreaUnit            string    `json:"areaUnit" example:"acres"`
	Notes               *string   `json:"notes" example:"North-facing slope, drip irrigation installed"`
	IsActive            bool      `json:"isActive" example:"true"`
	CreatedAt           time.Time `json:"createdAt" example:"2026-08-22T09:00:00Z"`
	UpdatedAt           time.Time `json:"updatedAt" example:"2026-08-22T09:00:00Z"`
	ID                  uuid.UUID `json:"id" example:"11111111-1111-1111-1111-111111111111"`
	FarmTypeID          uuid.UUID `json:"farmTypeID" example:"3fa85f64-5717-4562-b3fc-2c963f66afa6"`
}

type ListFarmResponse struct {
	Farms    []FarmInfo `json:"farms"`
	Active   int        `json:"active" example:"2"`
	Inactive int        `json:"inactive" example:"1"`
	Total    int        `json:"total" example:"3"`
}
