package lookup

import db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"

func toFarmTypeResponse(farmType db.FarmType) FarmTypeResponse {
	return FarmTypeResponse{
		ID:          farmType.ID,
		Name:        farmType.Name,
		DisplayName: farmType.DisplayName,
		Description: farmType.Description,
	}
}

func mapToListFarmTypes(farmTypes []db.FarmType) []FarmTypeResponse {
	result := make([]FarmTypeResponse, len(farmTypes))
	for i, farmType := range farmTypes {
		result[i] = toFarmTypeResponse(farmType)
	}
	return result
}

func toZoneTypeResponse(zoneType db.ZoneType) ZoneTypeResponse {
	return ZoneTypeResponse{
		ID:              zoneType.ID,
		Name:            zoneType.Name,
		DisplayName:     zoneType.DisplayName,
		CultivationMode: zoneType.CultivationMode,
		Description:     zoneType.Description,
	}
}

func mapToListZoneTypes(zoneTypes []db.ZoneType) []ZoneTypeResponse {
	result := make([]ZoneTypeResponse, len(zoneTypes))
	for i, zoneType := range zoneTypes {
		result[i] = toZoneTypeResponse(zoneType)
	}
	return result
}

func toSoilTypeResponse(soilType db.SoilType) SoilTypeResponse {
	return SoilTypeResponse{
		ID:             soilType.ID,
		Name:           soilType.Name,
		DisplayName:    soilType.DisplayName,
		WaterRetention: soilType.WaterRetention,
		Drainage:       soilType.Drainage,
		Description:    soilType.Description,
	}
}

func mapToListSoilTypes(soilTypes []db.SoilType) []SoilTypeResponse {
	result := make([]SoilTypeResponse, len(soilTypes))
	for i, soilType := range soilTypes {
		result[i] = toSoilTypeResponse(soilType)
	}
	return result
}

func toHydroSystemTypeResponse(hydroSystemType db.HydroSystemType) HydroSystemTypeResponse {
	return HydroSystemTypeResponse{
		ID:          hydroSystemType.ID,
		Name:        hydroSystemType.Name,
		DisplayName: hydroSystemType.DisplayName,
		Description: hydroSystemType.Description,
	}
}

func mapToListHydroSystemTypes(hydroSystemTypes []db.HydroSystemType) []HydroSystemTypeResponse {
	result := make([]HydroSystemTypeResponse, len(hydroSystemTypes))
	for i, hydroSystemType := range hydroSystemTypes {
		result[i] = toHydroSystemTypeResponse(hydroSystemType)
	}
	return result
}
