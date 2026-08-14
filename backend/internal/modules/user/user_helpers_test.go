package user

import (
	"testing"
	"time"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

func TestToUserProfileResponse(t *testing.T) {
	uid := uuidMust("11111111-1111-1111-1111-111111111111")
	tid := uuidMust("22222222-2222-2222-2222-222222222222")
	created := time.Date(2026, 1, 2, 3, 4, 5, 0, time.UTC)
	tenantCreated := time.Date(2025, 12, 1, 0, 0, 0, 0, time.UTC)
	desc := "A farm"
	pic := "pic.png"

	row := db.GetUserProfileDetailsRow{
		ID:              uid,
		FullName:        "Alice",
		EmailID:         "alice@farmdeck.app",
		Role:            "owner",
		Status:          "active",
		ProfilePicture:  &pic,
		CreatedAt:       created,
		TenantID:        tid,
		TenantName:      "Alice's Farm",
		Subdomain:       "alice.farmdeck.app",
		Description:     &desc,
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

func TestToCreateMemberTxParams(t *testing.T) {
	tenantID := uuidMust("11111111-1111-1111-1111-111111111111")
	inviterID := uuidMust("22222222-2222-2222-2222-222222222222")
	expiresAt := time.Date(2026, 1, 8, 0, 0, 0, 0, time.UTC)
	pic := "pic.png"

	got := toCreateMemberTxParams(tenantID, inviterID, "tok-hash", expiresAt, CreateMemberRequest{
		FullName:       "Bob",
		EmailID:        "bob@farmdeck.app",
		Role:           "grower",
		ProfilePicture: &pic,
	})

	if got.FullName != "Bob" {
		t.Errorf("FullName: got %q", got.FullName)
	}
	if got.EmailID != "bob@farmdeck.app" {
		t.Errorf("EmailID: got %q", got.EmailID)
	}
	if got.TenantID != tenantID {
		t.Errorf("TenantID: got %v", got.TenantID)
	}
	if got.Role != "grower" {
		t.Errorf("Role: got %q", got.Role)
	}
	if got.Status != domain.UserStatusInvited {
		t.Errorf("Status: got %q want %q", got.Status, domain.UserStatusInvited)
	}
	if got.ProfilePicture == nil || *got.ProfilePicture != "pic.png" {
		t.Errorf("ProfilePicture: got %v", got.ProfilePicture)
	}
	if got.TokenHash != "tok-hash" {
		t.Errorf("TokenHash: got %q", got.TokenHash)
	}
	if !got.ExpiresAt.Equal(expiresAt) {
		t.Errorf("ExpiresAt: got %v want %v", got.ExpiresAt, expiresAt)
	}
	if got.CreatedBy != inviterID {
		t.Errorf("CreatedBy: got %v want %v", got.CreatedBy, inviterID)
	}
}

func TestBuildAcceptURL(t *testing.T) {
	got := buildAcceptURL("http://localhost:5173", "raw-token-value")
	want := "http://localhost:5173/accept-invite?token=raw-token-value"
	if got != want {
		t.Errorf("buildAcceptURL = %q want %q", got, want)
	}
}

func TestMapToListMemberResponse(t *testing.T) {
	created := time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC)
	active := time.Date(2026, 2, 2, 0, 0, 0, 0, time.UTC)

	users := []db.User{
		{FullName: "Alice", EmailID: "alice@farmdeck.app", Role: domain.UserRoleOwner, Status: domain.UserStatusActive, CreatedAt: created, LastActiveAt: &active},
		{FullName: "Bob", EmailID: "bob@farmdeck.app", Role: domain.UserRoleGrower, Status: domain.UserStatusInvited, CreatedAt: created},
		{FullName: "Eve", EmailID: "eve@farmdeck.app", Role: domain.UserRoleViewer, Status: domain.UserStatusSuspended, CreatedAt: created},
	}

	got := mapToListMemberResponse(users)

	if got.Total != 3 {
		t.Errorf("Total: got %d want 3", got.Total)
	}
	if got.ActiveCount != 1 || got.InvitedCount != 1 {
		t.Errorf("counts: active=%d invited=%d, want 1/1", got.ActiveCount, got.InvitedCount)
	}
	if len(got.Members) != 3 {
		t.Fatalf("Members len: got %d want 3", len(got.Members))
	}
	if got.Members[0].FullName != "Alice" {
		t.Errorf("Members[0].FullName: got %q", got.Members[0].FullName)
	}
	// An active user carries last_active_at; an invited user does not (nil).
	if got.Members[0].LastActiveAt == nil || !got.Members[0].LastActiveAt.Equal(active) {
		t.Errorf("Members[0].LastActiveAt: got %v want %v", got.Members[0].LastActiveAt, active)
	}
	if got.Members[1].LastActiveAt != nil {
		t.Errorf("Members[1].LastActiveAt: got %v want nil", got.Members[1].LastActiveAt)
	}
	if got.Members[1].Status != domain.UserStatusInvited {
		t.Errorf("Members[1].Status: got %q want %q", got.Members[1].Status, domain.UserStatusInvited)
	}
}

func TestMapToListMemberResponse_Empty(t *testing.T) {
	got := mapToListMemberResponse(nil)

	if got.Total != 0 || len(got.Members) != 0 {
		t.Errorf("empty input: got Total=%d Members=%d, want 0/0", got.Total, len(got.Members))
	}
	if got.ActiveCount != 0 || got.InvitedCount != 0 {
		t.Errorf("empty counts: got %d/%d, want 0/0", got.ActiveCount, got.InvitedCount)
	}
}
