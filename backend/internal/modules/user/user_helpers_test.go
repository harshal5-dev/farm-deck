package user

import (
	"testing"
	"time"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
)

func TestToUserProfileResponse(t *testing.T) {
	uid := uuidMust("11111111-1111-1111-1111-111111111111")
	tid := uuidMust("22222222-2222-2222-2222-222222222222")
	created := time.Date(2026, 1, 2, 3, 4, 5, 0, time.UTC)
	tenantCreated := time.Date(2025, 12, 1, 0, 0, 0, 0, time.UTC)
	desc := "A farm"
	pic := "pic.png"

	row := db.GetUserProfileDetailsRow{
		ID:             uid,
		FullName:       "Alice",
		EmailID:        "alice@farmdeck.app",
		Role:           "owner",
		Status:         "active",
		ProfilePicture: &pic,
		CreatedAt:      created,
		TenantID:       tid,
		TenantName:     "Alice's Farm",
		Subdomain:      "alice.farmdeck.app",
		Description:    &desc,
		TenantCreatedAt: tenantCreated,
	}

	got := toUserProfileResponse(row)

	if got.ID != uid {
		t.Errorf("ID: got %v", got.ID)
	}
	if got.FullName != "Alice" {
		t.Errorf("FullName: got %q", got.FullName)
	}
	if got.EmailID != "alice@farmdeck.app" {
		t.Errorf("EmailID: got %q", got.EmailID)
	}
	if got.Role != "owner" || got.Status != "active" {
		t.Errorf("Role/Status: got %q/%q", got.Role, got.Status)
	}
	if got.ProfilePicture == nil || *got.ProfilePicture != "pic.png" {
		t.Errorf("ProfilePicture: got %v", got.ProfilePicture)
	}
	if !got.CreatedAt.Equal(created) {
		t.Errorf("CreatedAt: got %v", got.CreatedAt)
	}
	// Tenant details
	if got.TenantDetails.ID != tid {
		t.Errorf("TenantDetails.ID: got %v", got.TenantDetails.ID)
	}
	if got.TenantDetails.Name != "Alice's Farm" {
		t.Errorf("TenantDetails.Name: got %q", got.TenantDetails.Name)
	}
	if got.TenantDetails.Subdomain != "alice.farmdeck.app" {
		t.Errorf("TenantDetails.Subdomain: got %q", got.TenantDetails.Subdomain)
	}
	if got.TenantDetails.Description == nil || *got.TenantDetails.Description != "A farm" {
		t.Errorf("TenantDetails.Description: got %v", got.TenantDetails.Description)
	}
	if !got.TenantDetails.CreatedAt.Equal(tenantCreated) {
		t.Errorf("TenantDetails.CreatedAt: got %v", got.TenantDetails.CreatedAt)
	}
}

func TestToUserProfileResponse_NilOptionals(t *testing.T) {
	row := db.GetUserProfileDetailsRow{} // all optionals nil/zero

	got := toUserProfileResponse(row)

	if got.ProfilePicture != nil {
		t.Errorf("expected nil ProfilePicture, got %v", *got.ProfilePicture)
	}
	if got.TenantDetails.Description != nil {
		t.Errorf("expected nil Description, got %v", *got.TenantDetails.Description)
	}
}

func TestToUpdateUserProfileParams(t *testing.T) {
	uid := uuidMust("33333333-3333-3333-3333-333333333333")
	pic := "new-pic.png"

	got := toUpdateUserProfileParams(uid, UpdateUserProfileRequest{
		FullName:       "Alice Updated",
		ProfilePicture: &pic,
	})

	if got.ID != uid {
		t.Errorf("ID: got %v", got.ID)
	}
	if got.FullName != "Alice Updated" {
		t.Errorf("FullName: got %q", got.FullName)
	}
	if got.ProfilePicture == nil || *got.ProfilePicture != "new-pic.png" {
		t.Errorf("ProfilePicture: got %v", got.ProfilePicture)
	}
}

func uuidMust(s string) uuid.UUID { return uuid.MustParse(s) }
