package repository

import (
	"context"

	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
)

type LookupRepo interface {
	ListFarmTypes(ctx context.Context) ([]db.FarmType, error)
	ListSoilTypes(ctx context.Context) ([]db.SoilType, error)
	ListHydroSystemTypes(ctx context.Context) ([]db.HydroSystemType, error)
	ListZoneTypes(ctx context.Context) ([]db.ZoneType, error)
}

type LookupRepoImpl struct {
	store db.Store
}

func NewLookupRepo(store db.Store) LookupRepo {
	return &LookupRepoImpl{store: store}
}

func (r *LookupRepoImpl) ListFarmTypes(ctx context.Context) ([]db.FarmType, error) {
	return r.store.ListFarmTypes(ctx)
}

func (r *LookupRepoImpl) ListSoilTypes(ctx context.Context) ([]db.SoilType, error) {
	return r.store.ListSoilTypes(ctx)
}

func (r *LookupRepoImpl) ListHydroSystemTypes(ctx context.Context) ([]db.HydroSystemType, error) {
	return r.store.ListHydroSystemTypes(ctx)
}

func (r *LookupRepoImpl) ListZoneTypes(ctx context.Context) ([]db.ZoneType, error) {
	return r.store.ListZoneTypes(ctx)
}
