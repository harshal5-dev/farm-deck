package farm

import (
	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
)

func toCreateFarmParams(tenantID uuid.UUID, req ManageFarmRequest) db.CreateFarmParams {
	return db.CreateFarmParams{
		Name:       req.Name,
		Location:   req.Location,
		Latitude:   req.Latitude,
		Longitude:  req.Longitude,
		TotalArea:  req.TotalArea,
		AreaUnit:   req.AreaUnit,
		Notes:      req.Notes,
		TenantID:   tenantID,
		FarmTypeID: req.FarmTypeID,
	}
}

func toUpdateFarmParams(id, tenantID uuid.UUID, req ManageFarmRequest) db.UpdateFarmParams {
	return db.UpdateFarmParams{
		ID:         id,
		Name:       req.Name,
		Location:   req.Location,
		Latitude:   req.Latitude,
		Longitude:  req.Longitude,
		TotalArea:  req.TotalArea,
		AreaUnit:   req.AreaUnit,
		Notes:      req.Notes,
		FarmTypeID: req.FarmTypeID,
		TenantID:   tenantID,
	}
}

func toFarmInfo(farm db.Farm) FarmInfo {
	return FarmInfo{
		ID:         farm.ID,
		Name:       farm.Name,
		Location:   farm.Location,
		Latitude:   farm.Latitude,
		Longitude:  farm.Longitude,
		TotalArea:  farm.TotalArea,
		AreaUnit:   farm.AreaUnit,
		Notes:      farm.Notes,
		FarmTypeID: farm.FarmTypeID,
		CreatedAt:  farm.CreatedAt,
		UpdatedAt:  farm.UpdatedAt,
		IsActive:   farm.IsActive,
	}
}

func mapToListFarmResponse(farms []db.Farm) ListFarmResponse {
	total := len(farms)
	active := 0
	inactive := 0
	listFarm := make([]FarmInfo, total)
	for i, farm := range farms {
		listFarm[i] = toFarmInfo(farm)
		if farm.IsActive {
			active++
		} else {
			inactive++
		}
	}
	return ListFarmResponse{
		Farms:    listFarm,
		Active:   active,
		Inactive: inactive,
		Total:    total,
	}
}
