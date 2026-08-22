package repository

import (
	"context"

	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
)

type LookupRepo interface {
	ListFarmTypes(ctx context.Context) ([]db.FarmType, error)
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
