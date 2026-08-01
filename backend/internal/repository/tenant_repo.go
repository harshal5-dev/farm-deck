package repository

import (
	"context"

	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
)

type TenantRepo interface {
	CreateTenant(context.Context, db.CreateTenantParams) (db.Tenant, error)
}

type TenantRepoImpl struct {
	store db.Store
}

func NewTenantRepo(store db.Store) TenantRepo {
	return &TenantRepoImpl{store: store}
}

func (r *TenantRepoImpl) CreateTenant(ctx context.Context, params db.CreateTenantParams) (db.Tenant, error) {
	tenant, err := r.store.CreateTenant(ctx, params)
	if err != nil {
		return db.Tenant{}, err
	}
	return tenant, nil
}
