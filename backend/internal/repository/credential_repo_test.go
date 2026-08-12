package repository

import (
	"context"
	"errors"
	"fmt"
	"testing"

	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

func TestCredentialRepo_RegisterUser(t *testing.T) {
	ctx := context.Background()
	params := domain.RegisterUserTxParams{
		UserInfo:   domain.UserInfo{FullName: "Alice", EmailID: "alice@farmdeck.app"},
		TenantInfo: domain.TenantInfo{Name: "Alice's Farm", Subdomain: "alice"},
		Credential: domain.Credential{EmailID: "alice@farmdeck.app", PasswordHash: "hashed"},
	}
	want := db.RegisterUserTxResult{
		User:   db.User{EmailID: "alice@farmdeck.app", FullName: "Alice"},
		Tenant: db.Tenant{Subdomain: "alice"},
	}

	t.Run("forwards params and returns the store result", func(t *testing.T) {
		var gotParams domain.RegisterUserTxParams
		store := &mockStore{registerUserTx: func(_ context.Context, p domain.RegisterUserTxParams) (db.RegisterUserTxResult, error) {
			gotParams = p
			return want, nil
		}}
		repo := NewCredentialRepo(store)

		got, err := repo.RegisterUser(ctx, params)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != want {
			t.Errorf("result: got %+v want %+v", got, want)
		}
		if gotParams != params {
			t.Errorf("params not forwarded: got %+v want %+v", gotParams, params)
		}
	})

	t.Run("forwards the store error and returns a zero result", func(t *testing.T) {
		// RegisterUser performs no error translation; a domain error surfaced by
		// the transaction layer (e.g. ErrUserExists) must reach the caller as-is.
		store := &mockStore{registerUserTx: func(context.Context, domain.RegisterUserTxParams) (db.RegisterUserTxResult, error) {
			return db.RegisterUserTxResult{}, domain.ErrUserExists
		}}
		repo := NewCredentialRepo(store)

		got, err := repo.RegisterUser(ctx, params)
		if !errors.Is(err, domain.ErrUserExists) {
			t.Fatalf("expected ErrUserExists, got %v", err)
		}
		if got != (db.RegisterUserTxResult{}) {
			t.Errorf("expected zero-value result on error, got %+v", got)
		}
	})
}

func TestCredentialRepo_GetCredentialByEmail(t *testing.T) {
	ctx := context.Background()
	want := db.GetCredentialByEmailRow{
		UserID:       uuidMust("33333333-3333-3333-3333-333333333333"),
		EmailID:      "alice@farmdeck.app",
		PasswordHash: "hashed",
		FullName:     "Alice",
		Role:         domain.UserRoleOwner,
		TenantID:     uuidMust("44444444-4444-4444-4444-444444444444"),
	}

	t.Run("forwards the email and returns the store result", func(t *testing.T) {
		var gotEmail string
		store := &mockStore{getCredentialByEmail: func(_ context.Context, emailID string) (db.GetCredentialByEmailRow, error) {
			gotEmail = emailID
			return want, nil
		}}
		repo := NewCredentialRepo(store)

		got, err := repo.GetCredentialByEmail(ctx, "alice@farmdeck.app")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != want {
			t.Errorf("row: got %+v want %+v", got, want)
		}
		if gotEmail != "alice@farmdeck.app" {
			t.Errorf("email not forwarded: got %q", gotEmail)
		}
	})

	t.Run("translates ErrNoRows into ErrCredentialNotFound", func(t *testing.T) {
		store := &mockStore{getCredentialByEmail: func(context.Context, string) (db.GetCredentialByEmailRow, error) {
			return db.GetCredentialByEmailRow{}, pgx.ErrNoRows
		}}
		repo := NewCredentialRepo(store)

		_, err := repo.GetCredentialByEmail(ctx, "missing")
		if !errors.Is(err, domain.ErrCredentialNotFound) {
			t.Fatalf("expected ErrCredentialNotFound, got %v", err)
		}
		if errors.Is(err, pgx.ErrNoRows) {
			t.Error("the low-level pgx error leaked through the domain boundary")
		}
	})

	t.Run("detects ErrNoRows even when wrapped", func(t *testing.T) {
		wrapped := fmt.Errorf("get credential: %w", pgx.ErrNoRows)
		store := &mockStore{getCredentialByEmail: func(context.Context, string) (db.GetCredentialByEmailRow, error) {
			return db.GetCredentialByEmailRow{}, wrapped
		}}
		repo := NewCredentialRepo(store)

		_, err := repo.GetCredentialByEmail(ctx, "missing")
		if !errors.Is(err, domain.ErrCredentialNotFound) {
			t.Fatalf("expected ErrCredentialNotFound for wrapped ErrNoRows, got %v", err)
		}
	})

	t.Run("forwards any other error unchanged", func(t *testing.T) {
		other := errors.New("timeout")
		store := &mockStore{getCredentialByEmail: func(context.Context, string) (db.GetCredentialByEmailRow, error) {
			return db.GetCredentialByEmailRow{}, other
		}}
		repo := NewCredentialRepo(store)

		got, err := repo.GetCredentialByEmail(ctx, "alice@farmdeck.app")
		if !errors.Is(err, other) {
			t.Fatalf("expected %v, got %v", other, err)
		}
		if got != (db.GetCredentialByEmailRow{}) {
			t.Errorf("expected zero-value row on error, got %+v", got)
		}
	})
}
