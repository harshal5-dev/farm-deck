package repository

import (
	"context"
	"errors"
	"fmt"
	"testing"

	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

func TestTenantRepo_CreateTenant(t *testing.T) {
	ctx := context.Background()
	params := db.CreateTenantParams{Name: "Dave's Farm", Subdomain: "daves"}
	want := db.Tenant{ID: uuidMust("11111111-1111-1111-1111-111111111111"), Name: "Dave's Farm", Subdomain: "daves"}

	t.Run("forwards params and returns the store result", func(t *testing.T) {
		var gotParams db.CreateTenantParams
		store := &mockStore{createTenant: func(_ context.Context, p db.CreateTenantParams) (db.Tenant, error) {
			gotParams = p
			return want, nil
		}}
		repo := NewTenantRepo(store)

		got, err := repo.CreateTenant(ctx, params)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != want {
			t.Errorf("tenant: got %v want %v", got, want)
		}
		if gotParams != params {
			t.Errorf("params not forwarded: got %v want %v", gotParams, params)
		}
	})

	t.Run("forwards the store error and returns an empty tenant", func(t *testing.T) {
		storeErr := errors.New("unique violation")
		store := &mockStore{createTenant: func(context.Context, db.CreateTenantParams) (db.Tenant, error) {
			return db.Tenant{}, storeErr
		}}
		repo := NewTenantRepo(store)

		got, err := repo.CreateTenant(ctx, params)
		if !errors.Is(err, storeErr) {
			t.Fatalf("expected %v, got %v", storeErr, err)
		}
		if got != (db.Tenant{}) {
			t.Errorf("expected zero-value tenant on error, got %v", got)
		}
	})
}

func TestTenantRepo_UpdateTenant(t *testing.T) {
	ctx := context.Background()
	params := db.UpdateTenantParams{
		ID:        uuidMust("22222222-2222-2222-2222-222222222222"),
		Name:      "Renamed",
		Subdomain: "renamed",
	}
	want := db.Tenant{ID: params.ID, Name: "Renamed", Subdomain: "renamed"}

	t.Run("returns the store result on success", func(t *testing.T) {
		store := &mockStore{updateTenant: func(_ context.Context, p db.UpdateTenantParams) (db.Tenant, error) {
			if p != params {
				t.Errorf("params not forwarded: got %v want %v", p, params)
			}
			return want, nil
		}}
		repo := NewTenantRepo(store)

		got, err := repo.UpdateTenant(ctx, params)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != want {
			t.Errorf("tenant: got %v want %v", got, want)
		}
	})

	t.Run("translates ErrNoRows into ErrTenantNotFound", func(t *testing.T) {
		store := &mockStore{updateTenant: func(context.Context, db.UpdateTenantParams) (db.Tenant, error) {
			return db.Tenant{}, pgx.ErrNoRows
		}}
		repo := NewTenantRepo(store)

		_, err := repo.UpdateTenant(ctx, params)
		if !errors.Is(err, domain.ErrTenantNotFound) {
			t.Fatalf("expected ErrTenantNotFound, got %v", err)
		}
		if errors.Is(err, pgx.ErrNoRows) {
			t.Error("the low-level pgx error leaked through the domain boundary")
		}
	})

	t.Run("detects ErrNoRows even when wrapped", func(t *testing.T) {
		wrapped := fmt.Errorf("update tenant: %w", pgx.ErrNoRows)
		store := &mockStore{updateTenant: func(context.Context, db.UpdateTenantParams) (db.Tenant, error) {
			return db.Tenant{}, wrapped
		}}
		repo := NewTenantRepo(store)

		_, err := repo.UpdateTenant(ctx, params)
		if !errors.Is(err, domain.ErrTenantNotFound) {
			t.Fatalf("expected ErrTenantNotFound for wrapped ErrNoRows, got %v", err)
		}
	})

	t.Run("forwards any other error unchanged", func(t *testing.T) {
		other := errors.New("connection reset")
		store := &mockStore{updateTenant: func(context.Context, db.UpdateTenantParams) (db.Tenant, error) {
			return db.Tenant{}, other
		}}
		repo := NewTenantRepo(store)

		got, err := repo.UpdateTenant(ctx, params)
		if !errors.Is(err, other) {
			t.Fatalf("expected %v, got %v", other, err)
		}
		if got != (db.Tenant{}) {
			t.Errorf("expected zero-value tenant on error, got %v", got)
		}
	})
}
