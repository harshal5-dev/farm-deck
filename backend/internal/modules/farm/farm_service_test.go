package farm

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
)

type mockFarmRepo struct {
	repository.FarmRepo
	createFarm         func(context.Context, db.CreateFarmParams) (db.Farm, error)
	listFarms          func(context.Context, uuid.UUID) ([]db.Farm, error)
	updateFarm         func(context.Context, db.UpdateFarmParams) (db.Farm, error)
	toggleFarmIsActive func(context.Context, uuid.UUID, uuid.UUID, bool) (db.Farm, error)
}

func (m *mockFarmRepo) CreateFarm(ctx context.Context, p db.CreateFarmParams) (db.Farm, error) {
	return m.createFarm(ctx, p)
}
func (m *mockFarmRepo) ListFarms(ctx context.Context, tID uuid.UUID) ([]db.Farm, error) {
	return m.listFarms(ctx, tID)
}
func (m *mockFarmRepo) UpdateFarm(ctx context.Context, p db.UpdateFarmParams) (db.Farm, error) {
	return m.updateFarm(ctx, p)
}
func (m *mockFarmRepo) ToggleFarmIsActive(ctx context.Context, id, tID uuid.UUID, active bool) (db.Farm, error) {
	return m.toggleFarmIsActive(ctx, id, tID, active)
}

func validRequest() ManageFarmRequest {
	lat, lon, area := 18.5204, 73.8567, 12.5
	location, notes := "Pune, MH", "North-facing slope"
	return ManageFarmRequest{
		Name:       "Greenfield Orchard",
		Location:   &location,
		Latitude:   &lat,
		Longitude:  &lon,
		TotalArea:  &area,
		AreaUnit:   "acres",
		Notes:      &notes,
		FarmTypeID: uuidMust("22222222-2222-2222-2222-222222222222"),
	}
}

func uuidMust(s string) uuid.UUID { return uuid.MustParse(s) }

func TestFarmService_CreateFarm_ForwardsParamsAndWrapsError(t *testing.T) {
	tenantID := uuidMust("11111111-1111-1111-1111-111111111111")
	req := validRequest()

	t.Run("success forwards the params and tenant id", func(t *testing.T) {
		var gotParams db.CreateFarmParams
		repo := &mockFarmRepo{createFarm: func(_ context.Context, p db.CreateFarmParams) (db.Farm, error) {
			gotParams = p
			return db.Farm{ID: uuidMust("33333333-3333-3333-3333-333333333333")}, nil
		}}
		svc := NewFarmService(repo)

		if err := svc.CreateFarm(context.Background(), tenantID, req); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if gotParams.TenantID != tenantID {
			t.Errorf("TenantID: got %v want %v", gotParams.TenantID, tenantID)
		}
		if gotParams.Name != req.Name {
			t.Errorf("Name: got %q want %q", gotParams.Name, req.Name)
		}
		if gotParams.AreaUnit != req.AreaUnit {
			t.Errorf("AreaUnit: got %q want %q", gotParams.AreaUnit, req.AreaUnit)
		}
		if gotParams.FarmTypeID != req.FarmTypeID {
			t.Errorf("FarmTypeID: got %v want %v", gotParams.FarmTypeID, req.FarmTypeID)
		}
		if gotParams.Latitude == nil || *gotParams.Latitude != *req.Latitude {
			t.Errorf("Latitude: got %v want %v", gotParams.Latitude, req.Latitude)
		}
		if gotParams.Longitude == nil || *gotParams.Longitude != *req.Longitude {
			t.Errorf("Longitude: got %v want %v", gotParams.Longitude, req.Longitude)
		}
		if gotParams.TotalArea == nil || *gotParams.TotalArea != *req.TotalArea {
			t.Errorf("TotalArea: got %v want %v", gotParams.TotalArea, req.TotalArea)
		}
		if gotParams.Location == nil || *gotParams.Location != *req.Location {
			t.Errorf("Location: got %v want %v", gotParams.Location, req.Location)
		}
		if gotParams.Notes == nil || *gotParams.Notes != *req.Notes {
			t.Errorf("Notes: got %v want %v", gotParams.Notes, req.Notes)
		}
	})

	t.Run("repo error is wrapped and the sentinel is preserved", func(t *testing.T) {
		storeErr := errors.New("unique violation")
		repo := &mockFarmRepo{createFarm: func(context.Context, db.CreateFarmParams) (db.Farm, error) {
			return db.Farm{}, storeErr
		}}
		svc := NewFarmService(repo)

		err := svc.CreateFarm(context.Background(), tenantID, req)
		if err == nil {
			t.Fatal("expected error, got nil")
		}
		if !errors.Is(err, storeErr) {
			t.Errorf("expected wrapped %v, got %v", storeErr, err)
		}
	})
}

func TestFarmService_ListFarms_MapsAndCounts(t *testing.T) {
	tenantID := uuidMust("44444444-4444-4444-4444-444444444444")
	now := time.Date(2026, 8, 22, 9, 0, 0, 0, time.UTC)
	lat, lon, area := 18.5204, 73.8567, 12.5
	location := "Pune, MH"

	farms := []db.Farm{
		{ID: uuidMust("55555555-5555-5555-5555-555555555555"), TenantID: tenantID, FarmTypeID: uuidMust("77777777-7777-7777-7777-777777777777"), Name: "Orchard A", AreaUnit: "acres", IsActive: true, CreatedAt: now, UpdatedAt: now, Latitude: &lat, Longitude: &lon, TotalArea: &area, Location: &location},
		{ID: uuidMust("66666666-6666-6666-6666-666666666666"), TenantID: tenantID, FarmTypeID: uuidMust("77777777-7777-7777-7777-777777777777"), Name: "Orchard B", AreaUnit: "hectares", IsActive: true, CreatedAt: now, UpdatedAt: now},
		{ID: uuidMust("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), TenantID: tenantID, FarmTypeID: uuidMust("77777777-7777-7777-7777-777777777777"), Name: "Orchard C", AreaUnit: "acres", IsActive: false, CreatedAt: now, UpdatedAt: now},
	}

	repo := &mockFarmRepo{listFarms: func(_ context.Context, tID uuid.UUID) ([]db.Farm, error) {
		if tID != tenantID {
			t.Errorf("tenantID forwarded: got %v want %v", tID, tenantID)
		}
		return farms, nil
	}}
	svc := NewFarmService(repo)

	got, err := svc.ListFarms(context.Background(), tenantID)
	if err != nil {
		t.Fatalf("ListFarms: %v", err)
	}
	if got.Total != 3 {
		t.Errorf("Total: got %d want 3", got.Total)
	}
	if got.Active != 2 {
		t.Errorf("Active: got %d want 2", got.Active)
	}
	if got.Inactive != 1 {
		t.Errorf("Inactive: got %d want 1", got.Inactive)
	}
	if len(got.Farms) != 3 {
		t.Fatalf("Farms len: got %d want 3", len(got.Farms))
	}
	if got.Farms[0].ID != farms[0].ID {
		t.Errorf("Farms[0].ID: got %v want %v", got.Farms[0].ID, farms[0].ID)
	}
	if got.Farms[0].Name != "Orchard A" {
		t.Errorf("Farms[0].Name: got %q", got.Farms[0].Name)
	}
	if !got.Farms[0].IsActive {
		t.Errorf("Farms[0].IsActive: got %v want true", got.Farms[0].IsActive)
	}
	if got.Farms[2].IsActive {
		t.Errorf("Farms[2].IsActive: got %v want false", got.Farms[2].IsActive)
	}
}

func TestFarmService_ListFarms_EmptyListYieldsZeroCounts(t *testing.T) {
	repo := &mockFarmRepo{listFarms: func(context.Context, uuid.UUID) ([]db.Farm, error) {
		return nil, nil
	}}
	svc := NewFarmService(repo)

	got, err := svc.ListFarms(context.Background(), uuidMust("44444444-4444-4444-4444-444444444444"))
	if err != nil {
		t.Fatalf("ListFarms: %v", err)
	}
	if got.Total != 0 || got.Active != 0 || got.Inactive != 0 {
		t.Errorf("expected all zero counts, got %+v", got)
	}
	if got.Farms == nil {
		t.Error("Farms should be a (possibly empty) non-nil slice, got nil")
	}
}

func TestFarmService_ListFarms_RepoErrorPropagates(t *testing.T) {
	storeErr := errors.New("db down")
	repo := &mockFarmRepo{listFarms: func(context.Context, uuid.UUID) ([]db.Farm, error) {
		return nil, storeErr
	}}
	svc := NewFarmService(repo)

	_, err := svc.ListFarms(context.Background(), uuid.Nil)
	if !errors.Is(err, storeErr) {
		t.Errorf("expected %v, got %v", storeErr, err)
	}
}

func TestFarmService_UpdateFarm_ForwardsParamsAndWrapsError(t *testing.T) {
	farmID := uuidMust("88888888-8888-8888-8888-888888888888")
	tenantID := uuidMust("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
	req := validRequest()

	t.Run("success forwards the id, tenant id and the rest of the request", func(t *testing.T) {
		var gotParams db.UpdateFarmParams
		repo := &mockFarmRepo{updateFarm: func(_ context.Context, p db.UpdateFarmParams) (db.Farm, error) {
			gotParams = p
			return db.Farm{ID: p.ID, Name: p.Name}, nil
		}}
		svc := NewFarmService(repo)

		if err := svc.UpdateFarm(context.Background(), tenantID, farmID, req); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if gotParams.ID != farmID {
			t.Errorf("ID: got %v want %v", gotParams.ID, farmID)
		}
		if gotParams.TenantID != tenantID {
			t.Errorf("TenantID: got %v want %v", gotParams.TenantID, tenantID)
		}
		if gotParams.Name != req.Name {
			t.Errorf("Name: got %q want %q", gotParams.Name, req.Name)
		}
		if gotParams.FarmTypeID != req.FarmTypeID {
			t.Errorf("FarmTypeID: got %v want %v (the type update must be forwarded)", gotParams.FarmTypeID, req.FarmTypeID)
		}
		if gotParams.AreaUnit != req.AreaUnit {
			t.Errorf("AreaUnit: got %q want %q", gotParams.AreaUnit, req.AreaUnit)
		}
	})

	t.Run("repo error is wrapped and ErrFarmNotFound is preserved", func(t *testing.T) {
		repo := &mockFarmRepo{updateFarm: func(context.Context, db.UpdateFarmParams) (db.Farm, error) {
			return db.Farm{}, domain.ErrFarmNotFound
		}}
		svc := NewFarmService(repo)

		err := svc.UpdateFarm(context.Background(), tenantID, farmID, req)
		if !errors.Is(err, domain.ErrFarmNotFound) {
			t.Fatalf("expected ErrFarmNotFound, got %v", err)
		}
	})

	t.Run("other repo errors are wrapped", func(t *testing.T) {
		storeErr := errors.New("db down")
		repo := &mockFarmRepo{updateFarm: func(context.Context, db.UpdateFarmParams) (db.Farm, error) {
			return db.Farm{}, storeErr
		}}
		svc := NewFarmService(repo)

		err := svc.UpdateFarm(context.Background(), tenantID, farmID, req)
		if !errors.Is(err, storeErr) {
			t.Errorf("expected wrapped %v, got %v", storeErr, err)
		}
	})
}

func TestFarmService_DeactivateFarm_ForwardsIDAndWrapsError(t *testing.T) {
	farmID := uuidMust("99999999-9999-9999-9999-999999999999")
	tenantID := uuidMust("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")

	t.Run("success forwards the id and tenant id", func(t *testing.T) {
		var gotID, gotTenantID uuid.UUID
		var gotActive bool
		repo := &mockFarmRepo{toggleFarmIsActive: func(_ context.Context, id, tID uuid.UUID, active bool) (db.Farm, error) {
			gotID = id
			gotTenantID = tID
			gotActive = active
			return db.Farm{ID: id, IsActive: active}, nil
		}}
		svc := NewFarmService(repo)

		if err := svc.DeactivateFarm(context.Background(), tenantID, farmID); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if gotID != farmID {
			t.Errorf("id forwarded: got %v want %v", gotID, farmID)
		}
		if gotTenantID != tenantID {
			t.Errorf("tenant id forwarded: got %v want %v", gotTenantID, tenantID)
		}
		if gotActive {
			t.Errorf("active forwarded: got %v want false", gotActive)
		}
	})

	t.Run("repo error is wrapped", func(t *testing.T) {
		storeErr := errors.New("connection refused")
		repo := &mockFarmRepo{toggleFarmIsActive: func(context.Context, uuid.UUID, uuid.UUID, bool) (db.Farm, error) {
			return db.Farm{}, storeErr
		}}
		svc := NewFarmService(repo)

		err := svc.DeactivateFarm(context.Background(), tenantID, farmID)
		if !errors.Is(err, storeErr) {
			t.Errorf("expected wrapped %v, got %v", storeErr, err)
		}
	})
}

func TestFarmService_ActivateFarm_ForwardsIDAndWrapsError(t *testing.T) {
	farmID := uuidMust("99999999-9999-9999-9999-999999999999")
	tenantID := uuidMust("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")

	t.Run("success forwards the id and tenant id", func(t *testing.T) {
		var gotID, gotTenantID uuid.UUID
		var gotActive bool
		repo := &mockFarmRepo{toggleFarmIsActive: func(_ context.Context, id, tID uuid.UUID, active bool) (db.Farm, error) {
			gotID = id
			gotTenantID = tID
			gotActive = active
			return db.Farm{ID: id, IsActive: active}, nil
		}}
		svc := NewFarmService(repo)

		if err := svc.ActivateFarm(context.Background(), tenantID, farmID); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if gotID != farmID {
			t.Errorf("id forwarded: got %v want %v", gotID, farmID)
		}
		if gotTenantID != tenantID {
			t.Errorf("tenant id forwarded: got %v want %v", gotTenantID, tenantID)
		}
		if !gotActive {
			t.Errorf("active forwarded: got %v want true", gotActive)
		}
	})

	t.Run("repo error is wrapped", func(t *testing.T) {
		storeErr := errors.New("connection refused")
		repo := &mockFarmRepo{toggleFarmIsActive: func(context.Context, uuid.UUID, uuid.UUID, bool) (db.Farm, error) {
			return db.Farm{}, storeErr
		}}
		svc := NewFarmService(repo)

		err := svc.ActivateFarm(context.Background(), tenantID, farmID)
		if !errors.Is(err, storeErr) {
			t.Errorf("expected wrapped %v, got %v", storeErr, err)
		}
	})
}
