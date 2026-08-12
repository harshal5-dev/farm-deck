package auth

import (
	"testing"
	"time"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/pkg/slug"
)

func TestToRegisterUserTxParams(t *testing.T) {
	req := RegisterUserRequest{
		FullName:   "Alice",
		EmailID:    "alice@farmdeck.app",
		TenantName: "Alice's Farm",
	}

	got := toRegisterUserTxParams(req, "hashed-pw")

	if got.UserInfo.FullName != "Alice" {
		t.Errorf("UserInfo.FullName = %q", got.UserInfo.FullName)
	}
	if got.UserInfo.EmailID != "alice@farmdeck.app" {
		t.Errorf("UserInfo.EmailID = %q", got.UserInfo.EmailID)
	}
	if got.TenantInfo.Name != "Alice's Farm" {
		t.Errorf("TenantInfo.Name = %q", got.TenantInfo.Name)
	}
	// Subdomain must be derived from the tenant name via the slug package.
	wantSub := slug.GenerateTenantDomain("Alice's Farm")
	if got.TenantInfo.Subdomain != wantSub {
		t.Errorf("TenantInfo.Subdomain = %q, want %q", got.TenantInfo.Subdomain, wantSub)
	}
	if got.Credential.PasswordHash != "hashed-pw" {
		t.Errorf("Credential.PasswordHash = %q", got.Credential.PasswordHash)
	}
	if got.Credential.EmailID != "alice@farmdeck.app" {
		t.Errorf("Credential.EmailID = %q", got.Credential.EmailID)
	}
}

func TestToRotateParams(t *testing.T) {
	meta := SessionMeta{UserAgent: "Mozilla/5.0", IP: "1.2.3.4"}
	ttl := 720 * time.Hour
	before := time.Now()

	got := toRotateParams("old-hash", "new-hash", meta, ttl)

	if got.OldTokenHash != "old-hash" {
		t.Errorf("OldTokenHash = %q", got.OldTokenHash)
	}
	if got.NewTokenHash != "new-hash" {
		t.Errorf("NewTokenHash = %q", got.NewTokenHash)
	}
	// NewExpiresAt should be roughly now + ttl.
	if got.NewExpiresAt.Before(before.Add(ttl)) || got.NewExpiresAt.After(time.Now().Add(ttl).Add(time.Second)) {
		t.Errorf("NewExpiresAt = %v, expected ~ now+%v", got.NewExpiresAt, ttl)
	}
	if got.UserAgent == nil || *got.UserAgent != "Mozilla/5.0" {
		t.Errorf("UserAgent = %v", got.UserAgent)
	}
	if got.Ip == nil || *got.Ip != "1.2.3.4" {
		t.Errorf("Ip = %v", got.Ip)
	}
}

func TestToRotateParams_EmptyMetaBecomesNil(t *testing.T) {
	got := toRotateParams("a", "b", SessionMeta{}, time.Hour)
	if got.UserAgent != nil {
		t.Errorf("expected nil UserAgent for empty meta, got %v", *got.UserAgent)
	}
	if got.Ip != nil {
		t.Errorf("expected nil Ip for empty meta, got %v", *got.Ip)
	}
}

func TestToCreateRefreshTokenParams(t *testing.T) {
	uid := uuid.MustParse("11111111-1111-1111-1111-111111111111")
	ua, ip := "Mozilla", "9.9.9.9"
	before := time.Now()

	got := toCreateRefreshTokenParams(uid, "hash", time.Hour, &ua, &ip)

	if got.UserID != uid {
		t.Errorf("UserID = %v", got.UserID)
	}
	if got.TokenHash != "hash" {
		t.Errorf("TokenHash = %q", got.TokenHash)
	}
	if got.ExpiresAt.Before(before.Add(time.Hour)) || got.ExpiresAt.After(time.Now().Add(time.Hour).Add(time.Second)) {
		t.Errorf("ExpiresAt = %v, expected ~ now+1h", got.ExpiresAt)
	}
	if got.UserAgent == nil || *got.UserAgent != "Mozilla" {
		t.Errorf("UserAgent = %v", got.UserAgent)
	}
	if got.Ip == nil || *got.Ip != "9.9.9.9" {
		t.Errorf("Ip = %v", got.Ip)
	}
}

func TestToJwtUserDetailsFromEmail(t *testing.T) {
	uid := uuid.MustParse("22222222-2222-2222-2222-222222222222")
	tid := uuid.MustParse("33333333-3333-3333-3333-333333333333")
	row := db.GetCredentialByEmailRow{UserID: uid, TenantID: tid, Role: domain.UserRoleOwner, FullName: "Alice", EmailID: "a@b.com"}

	got := toJwtUserDetailsFromEmail(row)

	if got.UserId != uid || got.TenantId != tid || got.Role != domain.UserRoleOwner {
		t.Errorf("got %+v", got)
	}
}

func TestToJwtUserDetailsFromUserID(t *testing.T) {
	uid := uuid.MustParse("44444444-4444-4444-4444-444444444444")
	tid := uuid.MustParse("55555555-5555-5555-5555-555555555555")
	row := db.GetCredentialByUserIDRow{UserID: uid, TenantID: tid, Role: domain.UserRoleGrower}

	got := toJwtUserDetailsFromUserID(row)

	if got.UserId != uid || got.TenantId != tid || got.Role != domain.UserRoleGrower {
		t.Errorf("got %+v", got)
	}
}

func TestStringPtr(t *testing.T) {
	if got := stringPtr(""); got != nil {
		t.Errorf("expected nil for empty input, got %v", *got)
	}
	got := stringPtr("x")
	if got == nil || *got != "x" {
		t.Errorf("expected &\"x\", got %v", got)
	}
}
