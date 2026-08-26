package zone

import (
	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

func toCreateZoneTxParams(tenantID uuid.UUID, req CreateZoneRequest) domain.CreateZoneTxParams {
	return domain.CreateZoneTxParams{
		NumberOfSlots:         req.HydroSystemTypeDetails.NumberOfSlots,
		Area:                  req.Area,
		ReservoirVolumeLiters: req.HydroSystemTypeDetails.ReservoirVolumeLiters,
		ZoneTypeName:          req.ZoneTypeName,
		Name:                  req.Name,
		AreaUnit:              req.AreaUnit,
		Notes:                 req.Notes,
		GrowMedium:            req.HydroSystemTypeDetails.GrowMedium,
		FarmID:                req.FarmID,
		TenantID:              tenantID,
		ZoneTypeID:            req.ZoneTypeID,
		SoilTypeID:            req.SoilTypeDetails.SoilTypeID,
		HydroSystemTypeID:     req.HydroSystemTypeDetails.HydroSystemTypeID,
	}
}

func toUpdateZoneTxParams(id uuid.UUID, req UpdateZoneRequest) db.UpdateZoneParams {
	return db.UpdateZoneParams{
		ID:       id,
		Name:     req.Name,
		Area:     req.Area,
		AreaUnit: req.AreaUnit,
		Notes:    req.Notes,
	}
}

func toUpdateZoneHydroDetailsParams(zoneID uuid.UUID, req HydroSystemTypeRequest) db.UpdateZoneHydroDetailsParams {
	return db.UpdateZoneHydroDetailsParams{
		ZoneID:                zoneID,
		HydroSystemTypeID:     req.HydroSystemTypeID,
		GrowMedium:            req.GrowMedium,
		ReservoirVolumeLiters: req.ReservoirVolumeLiters,
		NumberOfSlots:         req.NumberOfSlots,
	}
}

func toListZonesInfo(zone db.ListZonesRow) ListZonesInfo {
	return ListZonesInfo{
		ID:              zone.ID,
		FarmID:          zone.FarmID,
		ZoneTypeID:      zone.ZoneTypeID,
		Name:            zone.Name,
		Area:            zone.Area,
		AreaUnit:        zone.AreaUnit,
		Notes:           zone.Notes,
		IsActive:        zone.IsActive,
		CreatedAt:       zone.CreatedAt,
		UpdatedAt:       zone.UpdatedAt,
		ZoneTypeName:    zone.ZoneTypeName,
		CultivationMode: zone.CultivationMode,
		Description:     zone.Description,
	}
}
