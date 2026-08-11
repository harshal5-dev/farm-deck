package tenant

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
)

type TenantService interface {
	UpdateTenant(ctx context.Context, tenantID uuid.UUID, req UpdateTenantRequest) error
}

type TenantServiceImpl struct {
	tenantRepo repository.TenantRepo
}

func NewTenantService(tenantRepo repository.TenantRepo) TenantService {
	return &TenantServiceImpl{
		tenantRepo: tenantRepo,
	}
}

func (s *TenantServiceImpl) UpdateTenant(ctx context.Context, tenantID uuid.UUID, req UpdateTenantRequest) error {
	_, err := s.tenantRepo.UpdateTenant(ctx, toUpdateTenantParams(tenantID, req))
	if err != nil {
		return fmt.Errorf("failed to update tenant: %w", err)
	}
	return nil
}
