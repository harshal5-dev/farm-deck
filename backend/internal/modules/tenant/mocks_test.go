package tenant

import (
	"context"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
)

func uuidMust(s string) uuid.UUID { return uuid.MustParse(s) }

// mockTenantRepo embeds repository.TenantRepo; only UpdateTenant (the method
// exercised by the service) is overridden.
type mockTenantRepo struct {
	repository.TenantRepo
	updateTenant func(context.Context, db.UpdateTenantParams) (db.Tenant, error)
}

func (m *mockTenantRepo) UpdateTenant(ctx context.Context, p db.UpdateTenantParams) (db.Tenant, error) {
	return m.updateTenant(ctx, p)
}

// fakeTenantService mocks TenantService for handler tests.
type fakeTenantService struct {
	updateTenant func(context.Context, uuid.UUID, UpdateTenantRequest) error
}

func (f *fakeTenantService) UpdateTenant(ctx context.Context, id uuid.UUID, r UpdateTenantRequest) error {
	return f.updateTenant(ctx, id, r)
}
