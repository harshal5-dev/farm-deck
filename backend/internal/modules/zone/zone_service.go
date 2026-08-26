package zone

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
)

type ZoneService interface {
	CreateZone(ctx context.Context, tenantID uuid.UUID, req CreateZoneRequest) error
}

type ZoneServiceImpl struct {
	zoneRepo repository.ZoneRepo
}

func NewZoneService(zoneRepo repository.ZoneRepo) ZoneService {
	return &ZoneServiceImpl{
		zoneRepo: zoneRepo,
	}
}

func (s *ZoneServiceImpl) CreateZone(ctx context.Context, tenantID uuid.UUID, req CreateZoneRequest) error {
	_, err := s.zoneRepo.CreateZone(ctx, toCreateZoneTxParams(tenantID, req))
	if err != nil {
		return fmt.Errorf("create zone: %w", err)
	}
	return nil
}
