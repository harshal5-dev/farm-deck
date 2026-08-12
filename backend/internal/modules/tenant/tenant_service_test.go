package tenant

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
)

func TestTenantService_UpdateTenant_Success(t *testing.T) {
	tid := uuidMust("11111111-1111-1111-1111-111111111111")

	repo := &mockTenantRepo{updateTenant: func(_ context.Context, p db.UpdateTenantParams) (db.Tenant, error) {
		if p.ID != tid {
			t.Errorf("id forwarded: got %v want %v", p.ID, tid)
		}
		if p.Name != "Renamed" {
			t.Errorf("Name: got %q", p.Name)
		}
		return db.Tenant{ID: p.ID, Name: p.Name}, nil
	}}
	svc := NewTenantService(repo)

	if err := svc.UpdateTenant(context.Background(), tid, UpdateTenantRequest{Name: "Renamed"}); err != nil {
		t.Fatalf("UpdateTenant: %v", err)
	}
}

func TestTenantService_UpdateTenant_NotFoundPropagates(t *testing.T) {
	repo := &mockTenantRepo{updateTenant: func(context.Context, db.UpdateTenantParams) (db.Tenant, error) {
		return db.Tenant{}, domain.ErrTenantNotFound
	}}
	svc := NewTenantService(repo)

	err := svc.UpdateTenant(context.Background(), uuid.New(), UpdateTenantRequest{Name: "X"})
	if !errors.Is(err, domain.ErrTenantNotFound) {
		t.Fatalf("expected ErrTenantNotFound, got %v", err)
	}
}

func TestTenantService_UpdateTenant_OtherErrorPropagates(t *testing.T) {
	repo := &mockTenantRepo{updateTenant: func(context.Context, db.UpdateTenantParams) (db.Tenant, error) {
		return db.Tenant{}, errors.New("db down")
	}}
	svc := NewTenantService(repo)

	if err := svc.UpdateTenant(context.Background(), uuid.New(), UpdateTenantRequest{Name: "X"}); err == nil {
		t.Fatal("expected the repo error to propagate, got nil")
	}
}
