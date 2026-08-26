package lookup

import (
	"context"
	"fmt"

	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
)

type LookupService interface {
	ListFarmTypes(ctx context.Context) ([]FarmTypeResponse, error)
	ListZoneTypes(ctx context.Context) ([]ZoneTypeResponse, error)
	ListSoilTypes(ctx context.Context) ([]SoilTypeResponse, error)
	ListHydroSystemTypes(ctx context.Context) ([]HydroSystemTypeResponse, error)
}

type LookupServiceImpl struct {
	lookupRepo repository.LookupRepo
}

func NewLookupService(lookupRepo repository.LookupRepo) LookupService {
	return &LookupServiceImpl{
		lookupRepo: lookupRepo,
	}
}

func (s *LookupServiceImpl) ListFarmTypes(ctx context.Context) ([]FarmTypeResponse, error) {
	farmTypes, err := s.lookupRepo.ListFarmTypes(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list farm types: %w", err)
	}
	return mapToListFarmTypes(farmTypes), nil
}

func (s *LookupServiceImpl) ListZoneTypes(ctx context.Context) ([]ZoneTypeResponse, error) {
	zoneTypes, err := s.lookupRepo.ListZoneTypes(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list zone types: %w", err)
	}
	return mapToListZoneTypes(zoneTypes), nil
}

func (s *LookupServiceImpl) ListSoilTypes(ctx context.Context) ([]SoilTypeResponse, error) {
	soilTypes, err := s.lookupRepo.ListSoilTypes(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list soil types: %w", err)
	}
	return mapToListSoilTypes(soilTypes), nil
}

func (s *LookupServiceImpl) ListHydroSystemTypes(ctx context.Context) ([]HydroSystemTypeResponse, error) {
	hydroSystemTypes, err := s.lookupRepo.ListHydroSystemTypes(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list hydro system types: %w", err)
	}
	return mapToListHydroSystemTypes(hydroSystemTypes), nil
}
