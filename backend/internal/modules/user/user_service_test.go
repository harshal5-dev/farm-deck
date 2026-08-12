package user

import (
	"context"
	"errors"
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
	svc := NewUserService(repo)

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
	svc := NewUserService(repo)

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
	svc := NewUserService(repo)

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
	svc := NewUserService(repo)

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
	svc := NewUserService(repo)

	if err := svc.UpdateUserProfile(context.Background(), uuid.Nil, UpdateUserProfileRequest{FullName: "x"}); err == nil {
		t.Fatal("expected the update error to propagate, got nil")
	}
}
