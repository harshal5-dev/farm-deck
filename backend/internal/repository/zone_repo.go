package repository

import (
	"context"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

type ZoneRepo interface {
	CreateZone(ctx context.Context, params domain.CreateZoneTxParams) (db.CreateZoneTxResult, error)
	UpdateZone(ctx context.Context, params db.UpdateZoneParams) (db.Zone, error)
	ListZones(ctx context.Context, tenantID uuid.UUID, isActive bool) ([]db.ListZonesRow, error)
	ToggleZoneIsActive(ctx context.Context, zoneID uuid.UUID, isActive bool) (db.Zone, error)
	UpdateZoneHydroDetails(ctx context.Context, params db.UpdateZoneHydroDetailsParams) (db.ZoneHydroDetail, error)
	UpdateZoneSoilDetails(ctx context.Context, params db.UpdateZoneSoilDetailsParams) (db.ZoneSoilDetail, error)
}

type ZoneRepoImpl struct {
	store db.Store
}

func NewZoneRepo(store db.Store) ZoneRepo {
	return &ZoneRepoImpl{store: store}
}

func (z *ZoneRepoImpl) CreateZone(ctx context.Context, arg domain.CreateZoneTxParams) (db.CreateZoneTxResult, error) {
	return z.store.CreateZoneTx(ctx, arg)
}

func (z *ZoneRepoImpl) UpdateZone(ctx context.Context, params db.UpdateZoneParams) (db.Zone, error) {
	return z.store.UpdateZone(ctx, params)
}

func (z *ZoneRepoImpl) ListZones(ctx context.Context, tenantID uuid.UUID, isActive bool) ([]db.ListZonesRow, error) {
	return z.store.ListZones(ctx, db.ListZonesParams{
		TenantID: tenantID,
		IsActive: isActive,
	})
}

func (z *ZoneRepoImpl) ToggleZoneIsActive(ctx context.Context, zoneID uuid.UUID, isActive bool) (db.Zone, error) {
	return z.store.ToggleZoneIsActive(ctx, db.ToggleZoneIsActiveParams{
		ID:       zoneID,
		IsActive: isActive,
	})
}

func (z *ZoneRepoImpl) UpdateZoneHydroDetails(ctx context.Context, params db.UpdateZoneHydroDetailsParams) (db.ZoneHydroDetail, error) {
	return z.store.UpdateZoneHydroDetails(ctx, params)
}

func (z *ZoneRepoImpl) UpdateZoneSoilDetails(ctx context.Context, params db.UpdateZoneSoilDetailsParams) (db.ZoneSoilDetail, error) {
	return z.store.UpdateZoneSoilDetails(ctx, params)
}
