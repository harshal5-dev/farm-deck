package user

import (
	"context"
	"errors"
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
)

func TestUserService_GetMyProfile_SuccessMapsRow(t *testing.T) {
	uid := uuid.MustParse("11111111-1111-1111-1111-111111111111")
	row := db.GetUserProfileDetailsRow{
		ID:         uid,
		FullName:   "Alice",
		EmailID:    "alice@farmdeck.app",
		Role:       domain.UserRoleOwner,
		Status:     domain.UserStatusActive,
		CreatedAt:  time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC),
		TenantName: "Alice's Farm",
		Subdomain:  "alice.farmdeck.app",
	}

	repo := &mockUserRepo{getUserProfileDetails: func(_ context.Context, id uuid.UUID) (db.GetUserProfileDetailsRow, error) {
		if id != uid {
			t.Errorf("id forwarded: got %v want %v", id, uid)
		}
		return row, nil
	}}
	svc := NewUserService(repo, &fakeEmailService{}, testServiceCfg())

	got, err := svc.GetMyProfile(context.Background(), uid)
	if err != nil {
		t.Fatalf("GetMyProfile: %v", err)
	}
	if got.FullName != "Alice" {
		t.Errorf("FullName: got %q", got.FullName)
	}
	if got.EmailID != "alice@farmdeck.app" {
		t.Errorf("EmailID: got %q", got.EmailID)
	}
	if got.Role != domain.UserRoleOwner {
		t.Errorf("Role: got %q", got.Role)
	}
	if got.TenantDetails.Name != "Alice's Farm" {
		t.Errorf("TenantDetails.Name: got %q", got.TenantDetails.Name)
	}
}

func TestUserService_GetMyProfile_RepoErrorPropagates(t *testing.T) {
	repo := &mockUserRepo{getUserProfileDetails: func(context.Context, uuid.UUID) (db.GetUserProfileDetailsRow, error) {
		return db.GetUserProfileDetailsRow{}, domain.ErrUserNotFound
	}}
	svc := NewUserService(repo, &fakeEmailService{}, testServiceCfg())

	_, err := svc.GetMyProfile(context.Background(), uuid.Nil)
	if !errors.Is(err, domain.ErrUserNotFound) {
		t.Fatalf("expected ErrUserNotFound, got %v", err)
	}
}

func TestUserService_UpdateUserProfile_Success(t *testing.T) {
	uid := uuid.MustParse("22222222-2222-2222-2222-222222222222")
	getCalled := false
	updateCalled := false

	repo := &mockUserRepo{
		getUserByID: func(_ context.Context, id uuid.UUID) (db.User, error) {
			getCalled = true
			if id != uid {
				t.Errorf("GetUserByID id: got %v", id)
			}
			return db.User{ID: id}, nil
		},
		updateUserProfile: func(_ context.Context, p db.UpdateUserProfileParams) (db.User, error) {
			updateCalled = true
			if p.ID != uid {
				t.Errorf("UpdateUserProfile ID: got %v", p.ID)
			}
			if p.FullName != "Alice Updated" {
				t.Errorf("UpdateUserProfile FullName: got %q", p.FullName)
			}
			return db.User{ID: p.ID, FullName: p.FullName}, nil
		},
	}
	svc := NewUserService(repo, &fakeEmailService{}, testServiceCfg())

	err := svc.UpdateUserProfile(context.Background(), uid, UpdateUserProfileRequest{FullName: "Alice Updated"})
	if err != nil {
		t.Fatalf("UpdateUserProfile: %v", err)
	}
	if !getCalled || !updateCalled {
		t.Errorf("expected both lookups to run (get=%v update=%v)", getCalled, updateCalled)
	}
}

func TestUserService_UpdateUserProfile_GetErrorShortCircuits(t *testing.T) {
	updateCalled := false
	repo := &mockUserRepo{
		getUserByID: func(context.Context, uuid.UUID) (db.User, error) {
			return db.User{}, domain.ErrUserNotFound
		},
		updateUserProfile: func(context.Context, db.UpdateUserProfileParams) (db.User, error) {
			updateCalled = true
			return db.User{}, nil
		},
	}
	svc := NewUserService(repo, &fakeEmailService{}, testServiceCfg())

	err := svc.UpdateUserProfile(context.Background(), uuid.Nil, UpdateUserProfileRequest{FullName: "x"})
	if !errors.Is(err, domain.ErrUserNotFound) {
		t.Fatalf("expected ErrUserNotFound, got %v", err)
	}
	if updateCalled {
		t.Error("UpdateUserProfile must not run when the user lookup fails")
	}
}

func TestUserService_UpdateUserProfile_UpdateErrorPropagates(t *testing.T) {
	repo := &mockUserRepo{
		getUserByID: func(context.Context, uuid.UUID) (db.User, error) { return db.User{}, nil },
		updateUserProfile: func(context.Context, db.UpdateUserProfileParams) (db.User, error) {
			return db.User{}, errors.New("db down")
		},
	}
	svc := NewUserService(repo, &fakeEmailService{}, testServiceCfg())

	if err := svc.UpdateUserProfile(context.Background(), uuid.Nil, UpdateUserProfileRequest{FullName: "x"}); err == nil {
		t.Fatal("expected the update error to propagate, got nil")
	}
}

func TestUserService_CreateMember_Success(t *testing.T) {
	tenantID := uuid.MustParse("11111111-1111-1111-1111-111111111111")
	inviterID := uuid.MustParse("22222222-2222-2222-2222-222222222222")
	userID := uuid.MustParse("33333333-3333-3333-3333-333333333333")
	invID := uuid.MustParse("44444444-4444-4444-4444-444444444444")

	expiresAt := time.Date(2026, 1, 8, 0, 0, 0, 0, time.UTC)

	repo := &mockUserRepo{
		createMember: func(_ context.Context, p domain.CreateMemberTxParams) (domain.CreateMemberTxResult, error) {
			if p.TenantID != tenantID {
				t.Errorf("TenantID: got %v", p.TenantID)
			}
			if p.CreatedBy != inviterID {
				t.Errorf("CreatedBy: got %v", p.CreatedBy)
			}
			if p.Status != domain.UserStatusInvited {
				t.Errorf("Status: got %q", p.Status)
			}
			if len(p.TokenHash) != 64 {
				t.Errorf("TokenHash should be 64 hex chars (sha256), got %d", len(p.TokenHash))
			}
			return domain.CreateMemberTxResult{
				User: domain.User{
					ID:       userID,
					EmailID:  p.EmailID,
					FullName: p.FullName,
					Status:   p.Status,
				},
				Invitation: domain.UserInvitation{
					ID:        invID,
					ExpiresAt: expiresAt,
				},
			}, nil
		},
	}
	email := &fakeEmailService{
		sendWelcome:    func(string, string) error { return nil },
		sendInvitation: func(string, string, string, string) error { return nil },
	}
	svc := NewUserService(repo, email, testServiceCfg())

	got, err := svc.CreateMember(context.Background(), tenantID, inviterID, CreateMemberRequest{
		FullName: "Bob",
		EmailID:  "bob@farmdeck.app",
		Role:     domain.UserRoleGrower,
	})
	if err != nil {
		t.Fatalf("CreateMember: %v", err)
	}
	if got.UserID != userID {
		t.Errorf("UserID: got %v", got.UserID)
	}
	if got.InvitationID != invID {
		t.Errorf("InvitationID: got %v", got.InvitationID)
	}
	if email.invitationCalls != 1 {
		t.Errorf("expected SendInvitationEmail called once, got %d", email.invitationCalls)
	}
	if email.lastInvitation.To != "bob@farmdeck.app" {
		t.Errorf("invitation To: got %q", email.lastInvitation.To)
	}
	if email.lastInvitation.Name != "Bob" {
		t.Errorf("invitation Name: got %q", email.lastInvitation.Name)
	}
	if !strings.Contains(email.lastInvitation.AcceptURL, "/accept-invite?token=") {
		t.Errorf("expected AcceptURL to contain /accept-invite?token=, got %q", email.lastInvitation.AcceptURL)
	}
}

func TestUserService_CreateMember_InvalidRoleRejected(t *testing.T) {
	repo := &mockUserRepo{
		createMember: func(context.Context, domain.CreateMemberTxParams) (domain.CreateMemberTxResult, error) {
			t.Fatal("CreateMember must not run when role is invalid")
			return domain.CreateMemberTxResult{}, nil
		},
	}
	email := &fakeEmailService{
		sendWelcome:    func(string, string) error { return nil },
		sendInvitation: func(string, string, string, string) error { return nil },
	}
	svc := NewUserService(repo, email, testServiceCfg())

	_, err := svc.CreateMember(context.Background(), uuid.Nil, uuid.Nil, CreateMemberRequest{
		FullName: "Bob", EmailID: "bob@farmdeck.app", Role: "owner",
	})
	if err == nil {
		t.Fatal("expected error for invalid role 'owner'")
	}
	if email.invitationCalls != 0 {
		t.Errorf("email must not be called on invalid role")
	}
}

func TestUserService_CreateMember_RepoErrorPropagates(t *testing.T) {
	repo := &mockUserRepo{
		createMember: func(context.Context, domain.CreateMemberTxParams) (domain.CreateMemberTxResult, error) {
			return domain.CreateMemberTxResult{}, domain.ErrUserExists
		},
	}
	email := &fakeEmailService{
		sendWelcome:    func(string, string) error { return nil },
		sendInvitation: func(string, string, string, string) error { return nil },
	}
	svc := NewUserService(repo, email, testServiceCfg())

	_, err := svc.CreateMember(context.Background(), uuid.Nil, uuid.Nil, CreateMemberRequest{
		FullName: "Bob", EmailID: "bob@farmdeck.app", Role: domain.UserRoleGrower,
	})
	if !errors.Is(err, domain.ErrUserExists) {
		t.Fatalf("expected ErrUserExists, got %v", err)
	}
	if email.invitationCalls != 0 {
		t.Errorf("email must not be called when the tx fails")
	}
}
