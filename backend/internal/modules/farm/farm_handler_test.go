package farm

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/pkg/ctxutil"
)

type fakeFarmService struct {
	createFarm     func(context.Context, uuid.UUID, ManageFarmRequest) error
	listFarms      func(context.Context, uuid.UUID) (ListFarmResponse, error)
	updateFarm     func(context.Context, uuid.UUID, uuid.UUID, ManageFarmRequest) error
	deactivateFarm func(context.Context, uuid.UUID, uuid.UUID) error
	activateFarm   func(context.Context, uuid.UUID, uuid.UUID) error
}

func (f *fakeFarmService) CreateFarm(ctx context.Context, tID uuid.UUID, r ManageFarmRequest) error {
	return f.createFarm(ctx, tID, r)
}
func (f *fakeFarmService) ListFarms(ctx context.Context, tID uuid.UUID) (ListFarmResponse, error) {
	return f.listFarms(ctx, tID)
}
func (f *fakeFarmService) UpdateFarm(ctx context.Context, tID, id uuid.UUID, r ManageFarmRequest) error {
	return f.updateFarm(ctx, tID, id, r)
}
func (f *fakeFarmService) DeactivateFarm(ctx context.Context, tID, id uuid.UUID) error {
	return f.deactivateFarm(ctx, tID, id)
}
func (f *fakeFarmService) ActivateFarm(ctx context.Context, tID, id uuid.UUID) error {
	return f.activateFarm(ctx, tID, id)
}

func newJSONCtx(method, path, body string) (*gin.Context, *httptest.ResponseRecorder) {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(w)
	req := httptest.NewRequest(method, path, strings.NewReader(body))
	if body != "" {
		req.Header.Set("Content-Type", "application/json")
	}
	ctx.Request = req
	return ctx, w
}

func withTenantID(ctx *gin.Context, id uuid.UUID) { ctx.Set(ctxutil.TenantIDKey, id) }
func withFarmID(ctx *gin.Context, id uuid.UUID)   { ctx.AddParam("id", id.String()) }

const validFarmBody = `{
	"name": "Greenfield Orchard",
	"areaUnit": "acres",
	"farmTypeID": "22222222-2222-2222-2222-222222222222"
}`

func TestFarmHandler_CreateFarm_NoTenantIDRejected(t *testing.T) {
	svc := &fakeFarmService{createFarm: func(context.Context, uuid.UUID, ManageFarmRequest) error {
		t.Fatal("service must not be called without a tenant id")
		return nil
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodPost, "/farms", validFarmBody)
	h.CreateFarm(ctx)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401 (body=%s)", w.Code, w.Body.String())
	}
	if !strings.Contains(w.Body.String(), "authentication required") {
		t.Errorf("expected 'authentication required', got %s", w.Body.String())
	}
}

func TestFarmHandler_CreateFarm_InvalidBodyRejected(t *testing.T) {
	svc := &fakeFarmService{createFarm: func(context.Context, uuid.UUID, ManageFarmRequest) error {
		t.Fatal("service must not be called on validation failure")
		return nil
	}}
	h := NewFarmHandler(svc)

	// name too short (min=2)
	ctx, w := newJSONCtx(http.MethodPost, "/farms", `{"name":"a","areaUnit":"acres","farmTypeID":"22222222-2222-2222-2222-222222222222"}`)
	withTenantID(ctx, uuidMust("11111111-1111-1111-1111-111111111111"))
	h.CreateFarm(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400 (body=%s)", w.Code, w.Body.String())
	}
	if !strings.Contains(w.Body.String(), "VALIDATION_ERROR") {
		t.Errorf("expected VALIDATION_ERROR, got %s", w.Body.String())
	}
}

func TestFarmHandler_CreateFarm_MissingRequiredField(t *testing.T) {
	svc := &fakeFarmService{createFarm: func(context.Context, uuid.UUID, ManageFarmRequest) error {
		t.Fatal("service must not be called when farmTypeID is missing")
		return nil
	}}
	h := NewFarmHandler(svc)

	// farmTypeID missing entirely
	ctx, w := newJSONCtx(http.MethodPost, "/farms", `{"name":"Greenfield","areaUnit":"acres"}`)
	withTenantID(ctx, uuidMust("11111111-1111-1111-1111-111111111111"))
	h.CreateFarm(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400 (body=%s)", w.Code, w.Body.String())
	}
}

func TestFarmHandler_CreateFarm_Success(t *testing.T) {
	tenantID := uuidMust("11111111-1111-1111-1111-111111111111")
	called := false
	svc := &fakeFarmService{createFarm: func(_ context.Context, tID uuid.UUID, r ManageFarmRequest) error {
		called = true
		if tID != tenantID {
			t.Errorf("tenantID forwarded: got %v want %v", tID, tenantID)
		}
		if r.Name != "Greenfield Orchard" {
			t.Errorf("Name: got %q", r.Name)
		}
		if r.AreaUnit != "acres" {
			t.Errorf("AreaUnit: got %q", r.AreaUnit)
		}
		if r.FarmTypeID != uuidMust("22222222-2222-2222-2222-222222222222") {
			t.Errorf("FarmTypeID: got %v", r.FarmTypeID)
		}
		return nil
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodPost, "/farms", validFarmBody)
	withTenantID(ctx, tenantID)
	h.CreateFarm(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	if !strings.Contains(w.Body.String(), "farm created successfully") {
		t.Errorf("expected success message, got %s", w.Body.String())
	}
	if !called {
		t.Error("expected CreateFarm to be called")
	}
}

func TestFarmHandler_CreateFarm_ServiceErrorMapped(t *testing.T) {
	svc := &fakeFarmService{createFarm: func(context.Context, uuid.UUID, ManageFarmRequest) error {
		return errors.New("db down")
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodPost, "/farms", validFarmBody)
	withTenantID(ctx, uuidMust("11111111-1111-1111-1111-111111111111"))
	h.CreateFarm(ctx)

	if w.Code != http.StatusInternalServerError {
		t.Fatalf("status: got %d want 500 (body=%s)", w.Code, w.Body.String())
	}
}

func TestFarmHandler_ListFarms_NoTenantIDRejected(t *testing.T) {
	svc := &fakeFarmService{listFarms: func(context.Context, uuid.UUID) (ListFarmResponse, error) {
		t.Fatal("service must not be called without a tenant id")
		return ListFarmResponse{}, nil
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodGet, "/farms", "")
	h.ListFarms(ctx)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401", w.Code)
	}
}

func TestFarmHandler_ListFarms_Success(t *testing.T) {
	tenantID := uuidMust("11111111-1111-1111-1111-111111111111")
	svc := &fakeFarmService{listFarms: func(_ context.Context, tID uuid.UUID) (ListFarmResponse, error) {
		if tID != tenantID {
			t.Errorf("tenantID forwarded: got %v want %v", tID, tenantID)
		}
		return ListFarmResponse{
			Total:    2,
			Active:   2,
			Inactive: 0,
			Farms: []FarmInfo{
				{ID: uuidMust("33333333-3333-3333-3333-333333333333"), Name: "Orchard A", IsActive: true},
				{ID: uuidMust("44444444-4444-4444-4444-444444444444"), Name: "Orchard B", IsActive: true},
			},
		}, nil
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodGet, "/farms", "")
	withTenantID(ctx, tenantID)
	h.ListFarms(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	var resp struct {
		Success bool             `json:"success"`
		Data    ListFarmResponse `json:"data"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if resp.Data.Total != 2 {
		t.Errorf("Total: got %d want 2", resp.Data.Total)
	}
	if len(resp.Data.Farms) != 2 {
		t.Fatalf("Farms len: got %d want 2", len(resp.Data.Farms))
	}
	if resp.Data.Farms[0].Name != "Orchard A" {
		t.Errorf("Farms[0].Name: got %q", resp.Data.Farms[0].Name)
	}
}

func TestFarmHandler_ListFarms_ServiceErrorMapped(t *testing.T) {
	svc := &fakeFarmService{listFarms: func(context.Context, uuid.UUID) (ListFarmResponse, error) {
		return ListFarmResponse{}, errors.New("db down")
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodGet, "/farms", "")
	withTenantID(ctx, uuidMust("11111111-1111-1111-1111-111111111111"))
	h.ListFarms(ctx)

	if w.Code != http.StatusInternalServerError {
		t.Fatalf("status: got %d want 500 (body=%s)", w.Code, w.Body.String())
	}
}

func TestFarmHandler_UpdateFarm_InvalidFarmIDRejected(t *testing.T) {
	svc := &fakeFarmService{updateFarm: func(context.Context, uuid.UUID, uuid.UUID, ManageFarmRequest) error {
		t.Fatal("service must not be called with an invalid farm id")
		return nil
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodPut, "/farms/not-a-uuid", validFarmBody)
	withTenantID(ctx, uuidMust("11111111-1111-1111-1111-111111111111"))
	h.UpdateFarm(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400", w.Code)
	}
	if !strings.Contains(w.Body.String(), "invalid farm id") {
		t.Errorf("expected 'invalid farm id', got %s", w.Body.String())
	}
}

func TestFarmHandler_UpdateFarm_NoTenantIDRejected(t *testing.T) {
	svc := &fakeFarmService{updateFarm: func(context.Context, uuid.UUID, uuid.UUID, ManageFarmRequest) error {
		t.Fatal("service must not be called without a tenant id")
		return nil
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodPut, "/farms/33333333-3333-3333-3333-333333333333", validFarmBody)
	withFarmID(ctx, uuidMust("33333333-3333-3333-3333-333333333333"))
	h.UpdateFarm(ctx)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401 (body=%s)", w.Code, w.Body.String())
	}
}

func TestFarmHandler_UpdateFarm_InvalidBodyRejected(t *testing.T) {
	svc := &fakeFarmService{updateFarm: func(context.Context, uuid.UUID, uuid.UUID, ManageFarmRequest) error {
		t.Fatal("service must not be called on validation failure")
		return nil
	}}
	h := NewFarmHandler(svc)

	// areaUnit too short
	ctx, w := newJSONCtx(http.MethodPut, "/farms/33333333-3333-3333-3333-333333333333", `{"name":"Greenfield","areaUnit":"a","farmTypeID":"22222222-2222-2222-2222-222222222222"}`)
	withTenantID(ctx, uuidMust("11111111-1111-1111-1111-111111111111"))
	withFarmID(ctx, uuidMust("33333333-3333-3333-3333-333333333333"))
	h.UpdateFarm(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400 (body=%s)", w.Code, w.Body.String())
	}
	if !strings.Contains(w.Body.String(), "VALIDATION_ERROR") {
		t.Errorf("expected VALIDATION_ERROR, got %s", w.Body.String())
	}
}

func TestFarmHandler_UpdateFarm_Success(t *testing.T) {
	farmID := uuidMust("33333333-3333-3333-3333-333333333333")
	tenantID := uuidMust("11111111-1111-1111-1111-111111111111")
	called := false
	svc := &fakeFarmService{updateFarm: func(_ context.Context, tID, id uuid.UUID, r ManageFarmRequest) error {
		called = true
		if tID != tenantID {
			t.Errorf("tenant id forwarded: got %v want %v", tID, tenantID)
		}
		if id != farmID {
			t.Errorf("id forwarded: got %v want %v", id, farmID)
		}
		if r.Name != "Greenfield Orchard" {
			t.Errorf("Name: got %q", r.Name)
		}
		if r.FarmTypeID != uuidMust("22222222-2222-2222-2222-222222222222") {
			t.Errorf("FarmTypeID not forwarded to service: got %v", r.FarmTypeID)
		}
		return nil
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodPut, "/farms/"+farmID.String(), validFarmBody)
	withTenantID(ctx, tenantID)
	withFarmID(ctx, farmID)
	h.UpdateFarm(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	if !strings.Contains(w.Body.String(), "farm updated successfully") {
		t.Errorf("expected success message, got %s", w.Body.String())
	}
	if !called {
		t.Error("expected UpdateFarm to be called")
	}
}

func TestFarmHandler_UpdateFarm_NotFoundMapped(t *testing.T) {
	svc := &fakeFarmService{updateFarm: func(context.Context, uuid.UUID, uuid.UUID, ManageFarmRequest) error {
		return domain.ErrFarmNotFound
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodPut, "/farms/33333333-3333-3333-3333-333333333333", validFarmBody)
	withTenantID(ctx, uuidMust("11111111-1111-1111-1111-111111111111"))
	withFarmID(ctx, uuidMust("33333333-3333-3333-3333-333333333333"))
	h.UpdateFarm(ctx)

	if w.Code != http.StatusNotFound {
		t.Fatalf("status: got %d want 404 (body=%s)", w.Code, w.Body.String())
	}
}

func TestFarmHandler_DeactivateFarm_NoTenantIDRejected(t *testing.T) {
	svc := &fakeFarmService{deactivateFarm: func(context.Context, uuid.UUID, uuid.UUID) error {
		t.Fatal("service must not be called without a tenant id")
		return nil
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodPatch, "/farms/33333333-3333-3333-3333-333333333333", "")
	withFarmID(ctx, uuidMust("33333333-3333-3333-3333-333333333333"))
	h.DeactivateFarm(ctx)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401", w.Code)
	}
}

func TestFarmHandler_DeactivateFarm_InvalidFarmIDRejected(t *testing.T) {
	svc := &fakeFarmService{deactivateFarm: func(context.Context, uuid.UUID, uuid.UUID) error {
		t.Fatal("service must not be called with an invalid farm id")
		return nil
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodPatch, "/farms/not-a-uuid", "")
	withTenantID(ctx, uuidMust("11111111-1111-1111-1111-111111111111"))
	h.DeactivateFarm(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400", w.Code)
	}
}

func TestFarmHandler_DeactivateFarm_Success(t *testing.T) {
	farmID := uuidMust("33333333-3333-3333-3333-333333333333")
	tenantID := uuidMust("11111111-1111-1111-1111-111111111111")
	called := false
	svc := &fakeFarmService{deactivateFarm: func(_ context.Context, tID, id uuid.UUID) error {
		called = true
		if tID != tenantID {
			t.Errorf("tenant id forwarded: got %v want %v", tID, tenantID)
		}
		if id != farmID {
			t.Errorf("id forwarded: got %v want %v", id, farmID)
		}
		return nil
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodPatch, "/farms/"+farmID.String(), "")
	withTenantID(ctx, tenantID)
	withFarmID(ctx, farmID)
	h.DeactivateFarm(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	if !strings.Contains(w.Body.String(), "farm deactivated successfully") {
		t.Errorf("expected success message, got %s", w.Body.String())
	}
	if !called {
		t.Error("expected DeactivateFarm to be called")
	}
}

func TestFarmHandler_DeactivateFarm_ServiceErrorMapped(t *testing.T) {
	svc := &fakeFarmService{deactivateFarm: func(context.Context, uuid.UUID, uuid.UUID) error {
		return errors.New("db down")
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodPatch, "/farms/33333333-3333-3333-3333-333333333333", "")
	withTenantID(ctx, uuidMust("11111111-1111-1111-1111-111111111111"))
	withFarmID(ctx, uuidMust("33333333-3333-3333-3333-333333333333"))
	h.DeactivateFarm(ctx)

	if w.Code != http.StatusInternalServerError {
		t.Fatalf("status: got %d want 500 (body=%s)", w.Code, w.Body.String())
	}
}

func TestFarmHandler_ActivateFarm_NoTenantIDRejected(t *testing.T) {
	svc := &fakeFarmService{activateFarm: func(context.Context, uuid.UUID, uuid.UUID) error {
		t.Fatal("service must not be called without a tenant id")
		return nil
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodPatch, "/farms/33333333-3333-3333-3333-333333333333/activate", "")
	withFarmID(ctx, uuidMust("33333333-3333-3333-3333-333333333333"))
	h.ActivateFarm(ctx)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status: got %d want 401", w.Code)
	}
}

func TestFarmHandler_ActivateFarm_InvalidFarmIDRejected(t *testing.T) {
	svc := &fakeFarmService{activateFarm: func(context.Context, uuid.UUID, uuid.UUID) error {
		t.Fatal("service must not be called with an invalid farm id")
		return nil
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodPatch, "/farms/not-a-uuid/activate", "")
	withTenantID(ctx, uuidMust("11111111-1111-1111-1111-111111111111"))
	h.ActivateFarm(ctx)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status: got %d want 400", w.Code)
	}
}

func TestFarmHandler_ActivateFarm_Success(t *testing.T) {
	farmID := uuidMust("33333333-3333-3333-3333-333333333333")
	tenantID := uuidMust("11111111-1111-1111-1111-111111111111")
	called := false
	svc := &fakeFarmService{activateFarm: func(_ context.Context, tID, id uuid.UUID) error {
		called = true
		if tID != tenantID {
			t.Errorf("tenant id forwarded: got %v want %v", tID, tenantID)
		}
		if id != farmID {
			t.Errorf("id forwarded: got %v want %v", id, farmID)
		}
		return nil
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodPatch, "/farms/"+farmID.String()+"/activate", "")
	withTenantID(ctx, tenantID)
	withFarmID(ctx, farmID)
	h.ActivateFarm(ctx)

	if w.Code != http.StatusOK {
		t.Fatalf("status: got %d want 200 (body=%s)", w.Code, w.Body.String())
	}
	if !strings.Contains(w.Body.String(), "farm activated successfully") {
		t.Errorf("expected success message, got %s", w.Body.String())
	}
	if !called {
		t.Error("expected ActivateFarm to be called")
	}
}

func TestFarmHandler_ActivateFarm_ServiceErrorMapped(t *testing.T) {
	svc := &fakeFarmService{activateFarm: func(context.Context, uuid.UUID, uuid.UUID) error {
		return errors.New("db down")
	}}
	h := NewFarmHandler(svc)

	ctx, w := newJSONCtx(http.MethodPatch, "/farms/33333333-3333-3333-3333-333333333333/activate", "")
	withTenantID(ctx, uuidMust("11111111-1111-1111-1111-111111111111"))
	withFarmID(ctx, uuidMust("33333333-3333-3333-3333-333333333333"))
	h.ActivateFarm(ctx)

	if w.Code != http.StatusInternalServerError {
		t.Fatalf("status: got %d want 500 (body=%s)", w.Code, w.Body.String())
	}
}
