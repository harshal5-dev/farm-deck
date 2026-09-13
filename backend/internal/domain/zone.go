package domain

import "github.com/google/uuid"

type ManageZoneTxParams struct {
	NumberOfSlots         *int32
	Area                  *float64
	ReservoirVolumeLiters *float64
	ZoneTypeName          string
	Name                  string
	AreaUnit              string
	Notes                 *string
	GrowMedium            *string
	FarmID                uuid.UUID
	TenantID              uuid.UUID
	ZoneTypeID            uuid.UUID
	SoilTypeID            uuid.UUID
	HydroSystemTypeID     uuid.UUID
	ID                    uuid.UUID
}
