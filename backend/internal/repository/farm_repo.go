package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

type FarmRepo interface {
	CreateFarm(ctx context.Context, params db.CreateFarmParams) (db.Farm, error)
	ListFarms(ctx context.Context, tenantID uuid.UUID, isActive bool) ([]db.Farm, error)
	UpdateFarm(ctx context.Context, params db.UpdateFarmParams) (db.Farm, error)
	ToggleFarmIsActive(ctx context.Context, farmID uuid.UUID, isActive bool) (db.Farm, error)
}

type FarmRepoImpl struct {
	store db.Store
}

func NewFarmRepo(store db.Store) FarmRepo {
	return &FarmRepoImpl{store: store}
}

func (r *FarmRepoImpl) CreateFarm(ctx context.Context, params db.CreateFarmParams) (db.Farm, error) {
	return r.store.CreateFarm(ctx, params)
}

func (r *FarmRepoImpl) ListFarms(ctx context.Context, tenantID uuid.UUID, isActive bool) ([]db.Farm, error) {
	return r.store.ListFarms(ctx, db.ListFarmsParams{TenantID: tenantID, IsActive: isActive})
}

func (r *FarmRepoImpl) UpdateFarm(ctx context.Context, params db.UpdateFarmParams) (db.Farm, error) {
	farm, err := r.store.UpdateFarm(ctx, params)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.Farm{}, domain.ErrFarmNotFound
		}
		return db.Farm{}, err
	}
	return farm, nil
}

func (r *FarmRepoImpl) ToggleFarmIsActive(ctx context.Context, farmID uuid.UUID, isActive bool) (db.Farm, error) {
	return r.store.ToggleFarmIsActive(ctx, db.ToggleFarmIsActiveParams{ID: farmID, IsActive: isActive})
}
