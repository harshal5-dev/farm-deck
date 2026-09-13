package zone

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
)

type ZoneService interface {
	CreateZone(ctx context.Context, tenantID uuid.UUID, req CreateZoneRequest) error
	ListZones(ctx context.Context, tenantID uuid.UUID, args ListZonesArgs) (ListZonesResponse, error)
	UpdateZone(ctx context.Context, tenantID uuid.UUID, zoneID uuid.UUID, req UpdateZoneRequest) error
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

func (s *ZoneServiceImpl) UpdateZone(ctx context.Context, tenantID uuid.UUID, zoneID uuid.UUID, req UpdateZoneRequest) error {
	_, err := s.zoneRepo.UpdateZone(ctx, toUpdateZoneTxParams(zoneID, req))
	if err != nil {
		return fmt.Errorf("update zone: %w", err)
	}
	return nil
}

func (s *ZoneServiceImpl) ListZones(ctx context.Context, tenantID uuid.UUID, args ListZonesArgs) (ListZonesResponse, error) {
	params, err := args.Normalize(tenantID)
	if err != nil {
		return ListZonesResponse{}, err
	}

	zones, err := s.zoneRepo.ListZones(ctx, params)
	if err != nil {
		return ListZonesResponse{}, fmt.Errorf("list zone: %w", err)
	}

	counts, err := s.zoneRepo.CountZonesByStatus(ctx, toCountZonesByStatusParams(tenantID, params))
	if err != nil {
		return ListZonesResponse{}, fmt.Errorf("count zones by status: %w", err)
	}

	// Echo the effective (defaulted) paging, never the raw args — pageSize 0
	// would also divide by zero in the totalPages math.
	page, pageSize := args.effectivePaging()
	return toListZonesResponse(zones, counts, page, pageSize), nil
}
