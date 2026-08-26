package lookup

import "github.com/google/uuid"

type FarmTypeResponse struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	DisplayName string    `json:"displayName"`
	Description *string   `json:"description"`
}

type ZoneTypeResponse struct {
	ID              uuid.UUID `json:"id"`
	Name            string    `json:"name"`
	DisplayName     string    `json:"displayName"`
	CultivationMode string    `json:"cultivationMode"`
	Description     *string   `json:"description"`
}

type SoilTypeResponse struct {
	ID             uuid.UUID `json:"id"`
	Name           string    `json:"name"`
	DisplayName    string    `json:"displayName"`
	WaterRetention string    `json:"waterRetention"`
	Drainage       string    `json:"drainage"`
	Description    *string   `json:"description"`
}

type HydroSystemTypeResponse struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	DisplayName string    `json:"displayName"`
	Description *string   `json:"description"`
}
