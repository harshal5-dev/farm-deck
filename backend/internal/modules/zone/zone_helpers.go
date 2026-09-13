package zone

import (
	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

const (
	defaultZonesPage     = 1
	defaultZonesPageSize = 6 // match the frontend's PAGE_SIZE
)

func toCreateZoneTxParams(tenantID uuid.UUID, req CreateZoneRequest) domain.ManageZoneTxParams {
	return domain.ManageZoneTxParams{
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

func toUpdateZoneTxParams(id uuid.UUID, req UpdateZoneRequest) domain.ManageZoneTxParams {
	return domain.ManageZoneTxParams{
		NumberOfSlots:         req.HydroSystemTypeDetails.NumberOfSlots,
		Area:                  req.Area,
		ReservoirVolumeLiters: req.HydroSystemTypeDetails.ReservoirVolumeLiters,
		Name:                  req.Name,
		AreaUnit:              req.AreaUnit,
		Notes:                 req.Notes,
		GrowMedium:            req.HydroSystemTypeDetails.GrowMedium,
		SoilTypeID:            req.SoilTypeDetails.SoilTypeID,
		HydroSystemTypeID:     req.HydroSystemTypeDetails.HydroSystemTypeID,
		ID:                    id,
	}
}

func toListZonesInfo(zone db.ListZonesRow) ListZonesInfo {
	info := ListZonesInfo{
		ID:                  zone.ID,
		FarmID:              zone.FarmID,
		ZoneTypeID:          zone.ZoneTypeID,
		Name:                zone.Name,
		Area:                zone.Area,
		AreaUnit:            zone.AreaUnit,
		Notes:               zone.Notes,
		IsActive:            zone.IsActive,
		CreatedAt:           zone.CreatedAt,
		UpdatedAt:           zone.UpdatedAt,
		ZoneTypeName:        zone.ZoneTypeName,
		CultivationMode:     zone.CultivationMode,
		ZoneTypeDisplayName: zone.ZoneTypeDisplayName,
		FarmName:            zone.FarmName,
	}

	if zone.SoilTypeID != nil {
		info.SoilTypeDetails = &ZoneSoilTypeDetails{
			SoilTypeID:     *zone.SoilTypeID,
			DisplayName:    derefString(zone.SoilTypeDisplayName),
			WaterRetention: derefString(zone.SoilWaterRetention),
			Drainage:       derefString(zone.SoilDrainage),
		}
	}
	if zone.HydroSystemTypeID != nil {
		info.HydroSystemTypeDetails = &ZoneHydroSystemDetails{
			HydroSystemTypeID:     *zone.HydroSystemTypeID,
			DisplayName:           derefString(zone.HydroSystemTypeDisplayName),
			GrowMedium:            zone.GrowMedium,
			ReservoirVolumeLiters: zone.ReservoirVolumeLiters,
			NumberOfSlots:         zone.NumberOfSlots,
		}
	}
	return info
}

func derefString(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func toCountZonesByStatusParams(tenantID uuid.UUID, params db.ListZonesParams) db.CountZonesByStatusParams {
	return db.CountZonesByStatusParams{
		TenantID:   tenantID,
		FarmID:     params.FarmID,
		ZoneTypeID: params.ZoneTypeID,
	}
}

func toListZonesResponse(zones []db.ListZonesRow, counts db.CountZonesByStatusRow, page, pageSize int) ListZonesResponse {
	listZoneInfo := make([]ListZonesInfo, len(zones))
	for i, zone := range zones {
		listZoneInfo[i] = toListZonesInfo(zone)
	}

	return ListZonesResponse{
		Zones:      listZoneInfo,
		Active:     counts.Active,
		Inactive:   counts.Inactive,
		Total:      counts.Total,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: (counts.Total + int64(pageSize) - 1) / int64(pageSize),
	}
}
