package repository

import (
	"context"
	"errors"
	"testing"
	"time"

	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

// RefreshTokenRepoImpl methods are pure pass-throughs: they do not translate
// errors. The most important behavioural guarantee these tests pin down is that
// GetByHash surfaces pgx.ErrNoRows unchanged (the caller depends on it).

func TestRefreshTokenRepo_CreateRefreshToken(t *testing.T) {
	ctx := context.Background()
	expires := time.Now().Add(time.Hour).UTC()
	arg := db.CreateRefreshTokenParams{
		UserID:    uuidMust("11111111-1111-1111-1111-111111111111"),
		TokenHash: "hash-1",
		ExpiresAt: expires,
	}
	want := db.RefreshToken{ID: uuidMust("22222222-2222-2222-2222-222222222222"), UserID: arg.UserID, TokenHash: "hash-1"}

	t.Run("forwards args and returns the store result", func(t *testing.T) {
		var gotArg db.CreateRefreshTokenParams
		store := &mockStore{createRefreshTokenTx: func(_ context.Context, a db.CreateRefreshTokenParams) (db.RefreshToken, error) {
			gotArg = a
			return want, nil
		}}
		repo := NewRefreshTokenRepo(store)

		got, err := repo.CreateRefreshToken(ctx, arg)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != want {
			t.Errorf("token: got %+v want %+v", got, want)
		}
		if gotArg != arg {
			t.Errorf("args not forwarded: got %+v want %+v", gotArg, arg)
		}
	})

	t.Run("forwards the store error unchanged", func(t *testing.T) {
		storeErr := errors.New("constraint violation")
		store := &mockStore{createRefreshTokenTx: func(context.Context, db.CreateRefreshTokenParams) (db.RefreshToken, error) {
			return db.RefreshToken{}, storeErr
		}}
		repo := NewRefreshTokenRepo(store)

		got, err := repo.CreateRefreshToken(ctx, arg)
		if !errors.Is(err, storeErr) {
			t.Fatalf("expected %v, got %v", storeErr, err)
		}
		if got != (db.RefreshToken{}) {
			t.Errorf("expected zero-value token on error, got %+v", got)
		}
	})
}

func TestRefreshTokenRepo_GetByHash(t *testing.T) {
	ctx := context.Background()
	want := db.RefreshToken{
		ID:        uuidMust("33333333-3333-3333-3333-333333333333"),
		UserID:    uuidMust("44444444-4444-4444-4444-444444444444"),
		TokenHash: "hash-1",
	}

	t.Run("forwards the hash and returns the store result", func(t *testing.T) {
		var gotHash string
		store := &mockStore{getRefreshTokenByHash: func(_ context.Context, tokenHash string) (db.RefreshToken, error) {
			gotHash = tokenHash
			return want, nil
		}}
		repo := NewRefreshTokenRepo(store)

		got, err := repo.GetByHash(ctx, "hash-1")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != want {
			t.Errorf("token: got %+v want %+v", got, want)
		}
		if gotHash != "hash-1" {
			t.Errorf("hash not forwarded: got %q", gotHash)
		}
	})

	t.Run("surfaces ErrNoRows unchanged (no translation)", func(t *testing.T) {
		store := &mockStore{getRefreshTokenByHash: func(context.Context, string) (db.RefreshToken, error) {
			return db.RefreshToken{}, pgx.ErrNoRows
		}}
		repo := NewRefreshTokenRepo(store)

		_, err := repo.GetByHash(ctx, "missing")
		if !errors.Is(err, pgx.ErrNoRows) {
			t.Fatalf("expected pgx.ErrNoRows to be surfaced unchanged, got %v", err)
		}
	})

	t.Run("forwards any other error unchanged", func(t *testing.T) {
		other := errors.New("connection reset")
		store := &mockStore{getRefreshTokenByHash: func(context.Context, string) (db.RefreshToken, error) {
			return db.RefreshToken{}, other
		}}
		repo := NewRefreshTokenRepo(store)

		got, err := repo.GetByHash(ctx, "hash-1")
		if !errors.Is(err, other) {
			t.Fatalf("expected %v, got %v", other, err)
		}
		if got != (db.RefreshToken{}) {
			t.Errorf("expected zero-value token on error, got %+v", got)
		}
	})
}

func TestRefreshTokenRepo_RevokeByHash(t *testing.T) {
	ctx := context.Background()

	t.Run("forwards the hash and returns nil on success", func(t *testing.T) {
		var gotHash string
		store := &mockStore{revokeRefreshTokenByHash: func(_ context.Context, tokenHash string) error {
			gotHash = tokenHash
			return nil
		}}
		repo := NewRefreshTokenRepo(store)

		if err := repo.RevokeByHash(ctx, "hash-1"); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if gotHash != "hash-1" {
			t.Errorf("hash not forwarded: got %q", gotHash)
		}
	})

	t.Run("forwards the store error unchanged", func(t *testing.T) {
		storeErr := errors.New("connection refused")
		store := &mockStore{revokeRefreshTokenByHash: func(context.Context, string) error {
			return storeErr
		}}
		repo := NewRefreshTokenRepo(store)

		if err := repo.RevokeByHash(ctx, "hash-1"); !errors.Is(err, storeErr) {
			t.Fatalf("expected %v, got %v", storeErr, err)
		}
	})
}

func TestRefreshTokenRepo_Rotate(t *testing.T) {
	ctx := context.Background()
	arg := domain.RotateRefreshTokenTxParams{
		OldTokenHash: "old-hash",
		NewTokenHash: "new-hash",
		NewExpiresAt: time.Now().Add(time.Hour).UTC(),
	}
	want := db.RotateRefreshTokenTxResult{
		RefreshToken: db.RefreshToken{TokenHash: "new-hash"},
	}

	t.Run("forwards args and returns the store result", func(t *testing.T) {
		var gotArg domain.RotateRefreshTokenTxParams
		store := &mockStore{rotateRefreshTokenTx: func(_ context.Context, a domain.RotateRefreshTokenTxParams) (db.RotateRefreshTokenTxResult, error) {
			gotArg = a
			return want, nil
		}}
		repo := NewRefreshTokenRepo(store)

		got, err := repo.Rotate(ctx, arg)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.RefreshToken.TokenHash != want.RefreshToken.TokenHash {
			t.Errorf("result: got %+v want %+v", got, want)
		}
		if gotArg != arg {
			t.Errorf("args not forwarded: got %+v want %+v", gotArg, arg)
		}
	})

	t.Run("forwards the store error unchanged", func(t *testing.T) {
		// A domain error from the tx layer (e.g. ErrRefreshTokenInvalid) must
		// reach the caller as-is, since Rotate performs no translation.
		store := &mockStore{rotateRefreshTokenTx: func(context.Context, domain.RotateRefreshTokenTxParams) (db.RotateRefreshTokenTxResult, error) {
			return db.RotateRefreshTokenTxResult{}, domain.ErrRefreshTokenInvalid
		}}
		repo := NewRefreshTokenRepo(store)

		got, err := repo.Rotate(ctx, arg)
		if !errors.Is(err, domain.ErrRefreshTokenInvalid) {
			t.Fatalf("expected ErrRefreshTokenInvalid, got %v", err)
		}
		if got != (db.RotateRefreshTokenTxResult{}) {
			t.Errorf("expected zero-value result on error, got %+v", got)
		}
	})
}
