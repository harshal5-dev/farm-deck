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
