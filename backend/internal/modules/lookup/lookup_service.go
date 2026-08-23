package lookup

import (
	"context"
	"fmt"

	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
)

type LookupService interface {
	ListFarmTypes(ctx context.Context) ([]FarmTypeResponse, error)
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
