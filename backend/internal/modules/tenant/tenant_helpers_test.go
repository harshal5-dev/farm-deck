package tenant

import (
	"testing"

	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/pkg/slug"
)

func TestToUpdateTenantParams(t *testing.T) {
	tid := uuidMust("11111111-1111-1111-1111-111111111111")
	desc := "A description"

	got := toUpdateTenantParams(tid, UpdateTenantRequest{
		Name:        "Alice's Farm",
		Description: &desc,
	})

	if got.ID != tid {
		t.Errorf("ID: got %v want %v", got.ID, tid)
	}
	if got.Name != "Alice's Farm" {
		t.Errorf("Name: got %q", got.Name)
	}
	if got.Description == nil || *got.Description != "A description" {
		t.Errorf("Description: got %v", got.Description)
	}
	// Subdomain must be derived from the name via the slug package.
	if want := slug.GenerateTenantDomain("Alice's Farm"); got.Subdomain != want {
		t.Errorf("Subdomain: got %q want %q", got.Subdomain, want)
	}
}

func TestToUpdateTenantParams_NilDescriptionCarriedThrough(t *testing.T) {
	got := toUpdateTenantParams(uuidMust("22222222-2222-2222-2222-222222222222"), UpdateTenantRequest{
		Name:        "Bare Tenant",
		Description: nil,
	})
	if got.Description != nil {
		t.Errorf("expected nil Description to be preserved, got %v", *got.Description)
	}
	// sanity: ensure we return the package type
	var _ db.UpdateTenantParams = got
}
