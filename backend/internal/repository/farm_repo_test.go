package repository

import (
	"context"
	"errors"
	"fmt"
	"testing"
	"time"

	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

func newCreateFarmParams() db.CreateFarmParams {
	lat, lon, area := 18.5204, 73.8567, 12.5
	location, notes := "Pune, MH", "North-facing slope"
	return db.CreateFarmParams{
		Name:       "Greenfield Orchard",
		Location:   &location,
		Latitude:   &lat,
		Longitude:  &lon,
		TotalArea:  &area,
		AreaUnit:   "acres",
		Notes:      &notes,
		TenantID:   uuidMust("11111111-1111-1111-1111-111111111111"),
		FarmTypeID: uuidMust("22222222-2222-2222-2222-222222222222"),
	}
}

func TestFarmRepo_CreateFarm(t *testing.T) {
	ctx := context.Background()
	params := newCreateFarmParams()
	want := db.Farm{ID: uuidMust("33333333-3333-3333-3333-333333333333"), Name: params.Name}

	t.Run("forwards params and returns the store result", func(t *testing.T) {
		var gotParams db.CreateFarmParams
		store := &mockStore{createFarm: func(_ context.Context, p db.CreateFarmParams) (db.Farm, error) {
			gotParams = p
			return want, nil
		}}
		repo := NewFarmRepo(store)

		got, err := repo.CreateFarm(ctx, params)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != want {
			t.Errorf("farm: got %+v want %+v", got, want)
		}
		if gotParams != params {
			t.Errorf("params not forwarded: got %+v want %+v", gotParams, params)
		}
	})

	t.Run("forwards the store error unchanged", func(t *testing.T) {
		storeErr := errors.New("unique violation")
		store := &mockStore{createFarm: func(context.Context, db.CreateFarmParams) (db.Farm, error) {
			return db.Farm{}, storeErr
		}}
		repo := NewFarmRepo(store)

		got, err := repo.CreateFarm(ctx, params)
		if !errors.Is(err, storeErr) {
			t.Fatalf("expected %v, got %v", storeErr, err)
		}
		if got != (db.Farm{}) {
			t.Errorf("expected zero-value farm on error, got %+v", got)
		}
	})
}

func TestFarmRepo_ListFarms(t *testing.T) {
	ctx := context.Background()
	tenantID := uuidMust("44444444-4444-4444-4444-444444444444")
	want := []db.Farm{
		{ID: uuidMust("55555555-5555-5555-5555-555555555555"), Name: "Orchard A", TenantID: tenantID, IsActive: true},
		{ID: uuidMust("66666666-6666-6666-6666-666666666666"), Name: "Orchard B", TenantID: tenantID, IsActive: false},
	}

	t.Run("forwards params and returns the store result", func(t *testing.T) {
		var gotParams db.ListFarmsParams
		store := &mockStore{listFarms: func(_ context.Context, p db.ListFarmsParams) ([]db.Farm, error) {
			gotParams = p
			return want, nil
		}}
		repo := NewFarmRepo(store)

		got, err := repo.ListFarms(ctx, tenantID, true)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(got) != len(want) || got[0].ID != want[0].ID {
			t.Errorf("farms: got %+v want %+v", got, want)
		}
		if gotParams.TenantID != tenantID {
			t.Errorf("tenantID not forwarded: got %v want %v", gotParams.TenantID, tenantID)
		}
		if !gotParams.IsActive {
			t.Errorf("IsActive not forwarded: got %v want true", gotParams.IsActive)
		}
	})

	t.Run("returns an empty slice when no farms exist", func(t *testing.T) {
		store := &mockStore{listFarms: func(context.Context, db.ListFarmsParams) ([]db.Farm, error) {
			return nil, nil
		}}
		repo := NewFarmRepo(store)

		got, err := repo.ListFarms(ctx, tenantID, false)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != nil {
			t.Errorf("expected nil slice, got %+v", got)
		}
	})

	t.Run("forwards the store error unchanged", func(t *testing.T) {
		storeErr := errors.New("connection reset")
		store := &mockStore{listFarms: func(context.Context, db.ListFarmsParams) ([]db.Farm, error) {
			return nil, storeErr
		}}
		repo := NewFarmRepo(store)

		got, err := repo.ListFarms(ctx, tenantID, true)
		if !errors.Is(err, storeErr) {
			t.Fatalf("expected %v, got %v", storeErr, err)
		}
		if got != nil {
			t.Errorf("expected nil farms on error, got %+v", got)
		}
	})
}

func TestFarmRepo_UpdateFarm(t *testing.T) {
	ctx := context.Background()
	params := db.UpdateFarmParams{
		ID:       uuidMust("77777777-7777-7777-7777-777777777777"),
		Name:     "Renamed Orchard",
		AreaUnit: "hectares",
	}
	want := db.Farm{ID: params.ID, Name: params.Name, AreaUnit: params.AreaUnit, UpdatedAt: time.Now().UTC()}

	t.Run("forwards params and returns the store result", func(t *testing.T) {
		var gotParams db.UpdateFarmParams
		store := &mockStore{updateFarm: func(_ context.Context, p db.UpdateFarmParams) (db.Farm, error) {
			gotParams = p
			return want, nil
		}}
		repo := NewFarmRepo(store)

		got, err := repo.UpdateFarm(ctx, params)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != want {
			t.Errorf("farm: got %+v want %+v", got, want)
		}
		if gotParams != params {
			t.Errorf("params not forwarded: got %+v want %+v", gotParams, params)
		}
	})

	t.Run("translates ErrNoRows into ErrFarmNotFound", func(t *testing.T) {
		store := &mockStore{updateFarm: func(context.Context, db.UpdateFarmParams) (db.Farm, error) {
			return db.Farm{}, pgx.ErrNoRows
		}}
		repo := NewFarmRepo(store)

		_, err := repo.UpdateFarm(ctx, params)
		if !errors.Is(err, domain.ErrFarmNotFound) {
			t.Fatalf("expected ErrFarmNotFound, got %v", err)
		}
		if errors.Is(err, pgx.ErrNoRows) {
			t.Error("the low-level pgx error leaked through the domain boundary")
		}
	})

	t.Run("detects ErrNoRows even when wrapped", func(t *testing.T) {
		wrapped := fmt.Errorf("update farm: %w", pgx.ErrNoRows)
		store := &mockStore{updateFarm: func(context.Context, db.UpdateFarmParams) (db.Farm, error) {
			return db.Farm{}, wrapped
		}}
		repo := NewFarmRepo(store)

		_, err := repo.UpdateFarm(ctx, params)
		if !errors.Is(err, domain.ErrFarmNotFound) {
			t.Fatalf("expected ErrFarmNotFound for wrapped ErrNoRows, got %v", err)
		}
	})

	t.Run("forwards any other error unchanged", func(t *testing.T) {
		other := errors.New("connection reset")
		store := &mockStore{updateFarm: func(context.Context, db.UpdateFarmParams) (db.Farm, error) {
			return db.Farm{}, other
		}}
		repo := NewFarmRepo(store)

		got, err := repo.UpdateFarm(ctx, params)
		if !errors.Is(err, other) {
			t.Fatalf("expected %v, got %v", other, err)
		}
		if got != (db.Farm{}) {
			t.Errorf("expected zero-value farm on error, got %+v", got)
		}
	})
}

func TestFarmRepo_ToggleFarmIsActive(t *testing.T) {
	ctx := context.Background()
	id := uuidMust("99999999-9999-9999-9999-999999999999")
	want := db.Farm{ID: id, Name: "Orchard A", IsActive: false}

	t.Run("forwards params and returns the store result", func(t *testing.T) {
		var gotParams db.ToggleFarmIsActiveParams
		store := &mockStore{toggleFarmIsActive: func(_ context.Context, p db.ToggleFarmIsActiveParams) (db.Farm, error) {
			gotParams = p
			return want, nil
		}}
		repo := NewFarmRepo(store)

		got, err := repo.ToggleFarmIsActive(ctx, id, false)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != want {
			t.Errorf("farm: got %+v want %+v", got, want)
		}
		if gotParams.ID != id {
			t.Errorf("id not forwarded: got %v want %v", gotParams.ID, id)
		}
		if gotParams.IsActive {
			t.Errorf("IsActive not forwarded: got %v want false", gotParams.IsActive)
		}
	})

	t.Run("forwards the store error unchanged", func(t *testing.T) {
		storeErr := errors.New("connection refused")
		store := &mockStore{toggleFarmIsActive: func(context.Context, db.ToggleFarmIsActiveParams) (db.Farm, error) {
			return db.Farm{}, storeErr
		}}
		repo := NewFarmRepo(store)

		got, err := repo.ToggleFarmIsActive(ctx, id, true)
		if !errors.Is(err, storeErr) {
			t.Fatalf("expected %v, got %v", storeErr, err)
		}
		if got != (db.Farm{}) {
			t.Errorf("expected zero-value farm on error, got %+v", got)
		}
	})
}
