package repository

import (
	"context"
	"errors"
	"fmt"
	"testing"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

func TestUserRepo_GetUserByEmailID(t *testing.T) {
	ctx := context.Background()
	want := db.User{
		ID:       uuidMust("11111111-1111-1111-1111-111111111111"),
		EmailID:  "alice@farmdeck.app",
		FullName: "Alice",
		Role:     domain.UserRoleOwner,
		Status:   domain.UserStatusActive,
	}

	t.Run("forwards the email and returns the store result", func(t *testing.T) {
		var gotEmail string
		store := &mockStore{getUserByEmailID: func(_ context.Context, emailID string) (db.User, error) {
			gotEmail = emailID
			return want, nil
		}}
		repo := NewUserRepo(store)

		got, err := repo.GetUserByEmailID(ctx, "alice@farmdeck.app")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != want {
			t.Errorf("user: got %+v want %+v", got, want)
		}
		if gotEmail != "alice@farmdeck.app" {
			t.Errorf("email not forwarded: got %q", gotEmail)
		}
	})

	t.Run("translates ErrNoRows into ErrUserNotFound", func(t *testing.T) {
		store := &mockStore{getUserByEmailID: func(context.Context, string) (db.User, error) {
			return db.User{}, pgx.ErrNoRows
		}}
		repo := NewUserRepo(store)

		_, err := repo.GetUserByEmailID(ctx, "missing")
		if !errors.Is(err, domain.ErrUserNotFound) {
			t.Fatalf("expected ErrUserNotFound, got %v", err)
		}
		if errors.Is(err, pgx.ErrNoRows) {
			t.Error("the low-level pgx error leaked through the domain boundary")
		}
	})

	t.Run("forwards any other error unchanged", func(t *testing.T) {
		other := errors.New("timeout")
		store := &mockStore{getUserByEmailID: func(context.Context, string) (db.User, error) {
			return db.User{}, other
		}}
		repo := NewUserRepo(store)

		got, err := repo.GetUserByEmailID(ctx, "alice@farmdeck.app")
		if !errors.Is(err, other) {
			t.Fatalf("expected %v, got %v", other, err)
		}
		if got != (db.User{}) {
			t.Errorf("expected zero-value user on error, got %+v", got)
		}
	})
}

func TestUserRepo_GetUserByID(t *testing.T) {
	ctx := context.Background()
	id := uuidMust("22222222-2222-2222-2222-222222222222")
	want := db.User{ID: id, EmailID: "bob@farmdeck.app", FullName: "Bob", Role: domain.UserRoleGrower}

	t.Run("forwards the id and returns the store result", func(t *testing.T) {
		var gotID uuid.UUID
		store := &mockStore{getUserByID: func(_ context.Context, uid uuid.UUID) (db.User, error) {
			gotID = uid
			return want, nil
		}}
		repo := NewUserRepo(store)

		got, err := repo.GetUserByID(ctx, id)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != want {
			t.Errorf("user: got %+v want %+v", got, want)
		}
		if gotID != id {
			t.Errorf("id not forwarded: got %v want %v", gotID, id)
		}
	})

	t.Run("translates ErrNoRows into ErrUserNotFound", func(t *testing.T) {
		store := &mockStore{getUserByID: func(context.Context, uuid.UUID) (db.User, error) {
			return db.User{}, pgx.ErrNoRows
		}}
		repo := NewUserRepo(store)

		_, err := repo.GetUserByID(ctx, id)
		if !errors.Is(err, domain.ErrUserNotFound) {
			t.Fatalf("expected ErrUserNotFound, got %v", err)
		}
	})

	t.Run("detects ErrNoRows even when wrapped", func(t *testing.T) {
		wrapped := fmt.Errorf("get user: %w", pgx.ErrNoRows)
		store := &mockStore{getUserByID: func(context.Context, uuid.UUID) (db.User, error) {
			return db.User{}, wrapped
		}}
		repo := NewUserRepo(store)

		_, err := repo.GetUserByID(ctx, id)
		if !errors.Is(err, domain.ErrUserNotFound) {
			t.Fatalf("expected ErrUserNotFound for wrapped ErrNoRows, got %v", err)
		}
	})

	t.Run("forwards any other error unchanged", func(t *testing.T) {
		other := errors.New("connection reset")
		store := &mockStore{getUserByID: func(context.Context, uuid.UUID) (db.User, error) {
			return db.User{}, other
		}}
		repo := NewUserRepo(store)

		got, err := repo.GetUserByID(ctx, id)
		if !errors.Is(err, other) {
			t.Fatalf("expected %v, got %v", other, err)
		}
		if got != (db.User{}) {
			t.Errorf("expected zero-value user on error, got %+v", got)
		}
	})
}

func TestUserRepo_GetUserProfileDetails(t *testing.T) {
	ctx := context.Background()
	id := uuidMust("33333333-3333-3333-3333-333333333333")
	want := db.GetUserProfileDetailsRow{
		ID:         id,
		FullName:   "Carol",
		EmailID:    "carol@farmdeck.app",
		Role:       domain.UserRoleManager,
		Status:     domain.UserStatusActive,
		TenantName: "Carol Co",
		Subdomain:  "carol",
	}

	t.Run("forwards the id and returns the store result", func(t *testing.T) {
		var gotID uuid.UUID
		store := &mockStore{getUserProfileDetails: func(_ context.Context, uid uuid.UUID) (db.GetUserProfileDetailsRow, error) {
			gotID = uid
			return want, nil
		}}
		repo := NewUserRepo(store)

		got, err := repo.GetUserProfileDetails(ctx, id)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != want {
			t.Errorf("row: got %+v want %+v", got, want)
		}
		if gotID != id {
			t.Errorf("id not forwarded: got %v want %v", gotID, id)
		}
	})

	t.Run("translates ErrNoRows into ErrUserNotFound", func(t *testing.T) {
		store := &mockStore{getUserProfileDetails: func(context.Context, uuid.UUID) (db.GetUserProfileDetailsRow, error) {
			return db.GetUserProfileDetailsRow{}, pgx.ErrNoRows
		}}
		repo := NewUserRepo(store)

		_, err := repo.GetUserProfileDetails(ctx, id)
		if !errors.Is(err, domain.ErrUserNotFound) {
			t.Fatalf("expected ErrUserNotFound, got %v", err)
		}
	})

	t.Run("forwards any other error unchanged", func(t *testing.T) {
		other := errors.New("timeout")
		store := &mockStore{getUserProfileDetails: func(context.Context, uuid.UUID) (db.GetUserProfileDetailsRow, error) {
			return db.GetUserProfileDetailsRow{}, other
		}}
		repo := NewUserRepo(store)

		got, err := repo.GetUserProfileDetails(ctx, id)
		if !errors.Is(err, other) {
			t.Fatalf("expected %v, got %v", other, err)
		}
		if got != (db.GetUserProfileDetailsRow{}) {
			t.Errorf("expected zero-value row on error, got %+v", got)
		}
	})
}

func TestUserRepo_UpdateUserProfile(t *testing.T) {
	ctx := context.Background()
	pic := "pic.png"
	params := db.UpdateUserProfileParams{
		ID:             uuidMust("44444444-4444-4444-4444-444444444444"),
		FullName:       "Dave",
		ProfilePicture: &pic,
	}
	want := db.User{ID: params.ID, FullName: "Dave", ProfilePicture: &pic}

	t.Run("forwards params and returns the store result", func(t *testing.T) {
		var gotParams db.UpdateUserProfileParams
		store := &mockStore{updateUserProfile: func(_ context.Context, arg db.UpdateUserProfileParams) (db.User, error) {
			gotParams = arg
			return want, nil
		}}
		repo := NewUserRepo(store)

		got, err := repo.UpdateUserProfile(ctx, params)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != want {
			t.Errorf("user: got %+v want %+v", got, want)
		}
		if !updateProfileParamsEqual(gotParams, params) {
			t.Errorf("params not forwarded: got %+v want %+v", gotParams, params)
		}
	})

	t.Run("translates ErrNoRows into ErrUserNotFound", func(t *testing.T) {
		store := &mockStore{updateUserProfile: func(context.Context, db.UpdateUserProfileParams) (db.User, error) {
			return db.User{}, pgx.ErrNoRows
		}}
		repo := NewUserRepo(store)

		_, err := repo.UpdateUserProfile(ctx, params)
		if !errors.Is(err, domain.ErrUserNotFound) {
			t.Fatalf("expected ErrUserNotFound, got %v", err)
		}
	})

	t.Run("forwards any other error unchanged", func(t *testing.T) {
		other := errors.New("connection reset")
		store := &mockStore{updateUserProfile: func(context.Context, db.UpdateUserProfileParams) (db.User, error) {
			return db.User{}, other
		}}
		repo := NewUserRepo(store)

		got, err := repo.UpdateUserProfile(ctx, params)
		if !errors.Is(err, other) {
			t.Fatalf("expected %v, got %v", other, err)
		}
		if got != (db.User{}) {
			t.Errorf("expected zero-value user on error, got %+v", got)
		}
	})
}

// updateProfileParamsEqual compares two UpdateUserProfileParams by value rather
// than with ==, since ProfilePicture is a *string and we want to compare the
// pointed-to string, not the pointer identity.
func updateProfileParamsEqual(a, b db.UpdateUserProfileParams) bool {
	if a.ID != b.ID || a.FullName != b.FullName {
		return false
	}
	return ptrStringEqual(a.ProfilePicture, b.ProfilePicture)
}

func ptrStringEqual(a, b *string) bool {
	if a == nil || b == nil {
		return a == b
	}
	return *a == *b
}

func TestUserRepo_ListMembers(t *testing.T) {
	ctx := context.Background()
	tenantID := uuidMust("55555555-5555-5555-5555-555555555555")
	excludeID := uuidMust("66666666-6666-6666-6666-666666666666")
	want := []db.User{
		{ID: uuidMust("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), EmailID: "alice@farmdeck.app", FullName: "Alice", Role: domain.UserRoleGrower, Status: domain.UserStatusActive},
	}

	t.Run("forwards tenantID/excludeID and returns the store result", func(t *testing.T) {
		var gotArg db.ListMembersParams
		store := &mockStore{listMembers: func(_ context.Context, a db.ListMembersParams) ([]db.User, error) {
			gotArg = a
			return want, nil
		}}
		repo := NewUserRepo(store)

		got, err := repo.ListMembers(ctx, tenantID, excludeID)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(got) != 1 || got[0].ID != want[0].ID {
			t.Errorf("members: got %+v want %+v", got, want)
		}
		if gotArg.TenantID != tenantID || gotArg.ID != excludeID {
			t.Errorf("params: got %+v, want {TenantID:%v ID:%v}", gotArg, tenantID, excludeID)
		}
	})

	t.Run("forwards the store error unchanged", func(t *testing.T) {
		storeErr := errors.New("connection reset")
		store := &mockStore{listMembers: func(context.Context, db.ListMembersParams) ([]db.User, error) {
			return nil, storeErr
		}}
		repo := NewUserRepo(store)

		got, err := repo.ListMembers(ctx, tenantID, excludeID)
		if !errors.Is(err, storeErr) {
			t.Fatalf("expected %v, got %v", storeErr, err)
		}
		if got != nil {
			t.Errorf("expected nil members on error, got %+v", got)
		}
	})
}

func TestUserRepo_TouchUserLastActive(t *testing.T) {
	ctx := context.Background()
	id := uuidMust("77777777-7777-7777-7777-777777777777")

	t.Run("forwards the id and returns nil on success", func(t *testing.T) {
		var gotID uuid.UUID
		store := &mockStore{touchUserLastActive: func(_ context.Context, uid uuid.UUID) error {
			gotID = uid
			return nil
		}}
		repo := NewUserRepo(store)

		if err := repo.TouchUserLastActive(ctx, id); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if gotID != id {
			t.Errorf("id not forwarded: got %v want %v", gotID, id)
		}
	})

	t.Run("forwards the store error unchanged", func(t *testing.T) {
		storeErr := errors.New("connection refused")
		store := &mockStore{touchUserLastActive: func(context.Context, uuid.UUID) error {
			return storeErr
		}}
		repo := NewUserRepo(store)

		if err := repo.TouchUserLastActive(ctx, id); !errors.Is(err, storeErr) {
			t.Fatalf("expected %v, got %v", storeErr, err)
		}
	})
}
