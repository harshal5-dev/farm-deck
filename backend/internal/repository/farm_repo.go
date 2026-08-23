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
	ListFarms(ctx context.Context, tenantID uuid.UUID) ([]db.Farm, error)
	UpdateFarm(ctx context.Context, params db.UpdateFarmParams) (db.Farm, error)
	InactivateFarm(ctx context.Context, farmID uuid.UUID) error
	ActivateFarm(ctx context.Context, farmID uuid.UUID) error
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

func (r *FarmRepoImpl) ListFarms(ctx context.Context, tenantID uuid.UUID) ([]db.Farm, error) {
	return r.store.ListFarms(ctx, tenantID)
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

func (r *FarmRepoImpl) InactivateFarm(ctx context.Context, farmID uuid.UUID) error {
	return r.store.InactivateFarm(ctx, farmID)
}

func (r *FarmRepoImpl) ActivateFarm(ctx context.Context, farmID uuid.UUID) error {
	return r.store.ActivateFarm(ctx, farmID)
}
