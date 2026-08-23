package farm

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
)

type FarmService interface {
	CreateFarm(ctx context.Context, tenantId uuid.UUID, req ManageFarmRequest) error
	ListFarms(ctx context.Context, tenantId uuid.UUID) (ListFarmResponse, error)
	UpdateFarm(ctx context.Context, farmId uuid.UUID, req ManageFarmRequest) error
	InactivateFarm(ctx context.Context, farmId uuid.UUID) error
	ActivateFarm(ctx context.Context, farmId uuid.UUID) error
}

type FarmServiceImpl struct {
	farmRepo repository.FarmRepo
}

func NewFarmService(farmRepo repository.FarmRepo) FarmService {
	return &FarmServiceImpl{farmRepo: farmRepo}
}

func (s *FarmServiceImpl) CreateFarm(ctx context.Context, tenantId uuid.UUID, req ManageFarmRequest) error {
	_, err := s.farmRepo.CreateFarm(ctx, toCreateFarmParams(tenantId, req))
	if err != nil {
		return fmt.Errorf("failed to create farm: %w", err)
	}
	return nil
}

func (s *FarmServiceImpl) ListFarms(ctx context.Context, tenantId uuid.UUID) (ListFarmResponse, error) {
	farms, err := s.farmRepo.ListFarms(ctx, tenantId)
	if err != nil {
		return ListFarmResponse{}, fmt.Errorf("failed to list farms: %w", err)
	}
	return mapToListFarmResponse(farms), nil
}

func (s *FarmServiceImpl) UpdateFarm(ctx context.Context, farmId uuid.UUID, req ManageFarmRequest) error {
	_, err := s.farmRepo.UpdateFarm(ctx, toUpdateFarmParams(farmId, req))
	if err != nil {
		return fmt.Errorf("failed to update farm: %w", err)
	}
	return nil
}

func (s *FarmServiceImpl) InactivateFarm(ctx context.Context, farmId uuid.UUID) error {
	err := s.farmRepo.InactivateFarm(ctx, farmId)
	if err != nil {
		return fmt.Errorf("failed to inactivate farm: %w", err)
	}
	return nil
}

func (s *FarmServiceImpl) ActivateFarm(ctx context.Context, farmId uuid.UUID) error {
	err := s.farmRepo.ActivateFarm(ctx, farmId)
	if err != nil {
		return fmt.Errorf("failed to activate farm: %w", err)
	}
	return nil
}
