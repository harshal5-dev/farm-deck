package queries

import (
	"context"
	"errors"
	"reflect"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
)

func TestQueries_CreateRefreshToken(t *testing.T) {
	ctx := context.Background()
	id := uuidMust("11111111-2222-3333-4444-555566667777")
	uid := uuidMust("22222222-3333-4444-5555-666677778888")
	expires := time.Now().Add(24 * time.Hour).UTC()
	created := time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC)

	t.Run("maps all columns including nullable fields", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			id, uid, "token-hash", expires, timePtr(created), strPtr("Mozilla/5.0"), strPtr("1.2.3.4"), created,
		)}}
		q := New(m)

		got, err := q.CreateRefreshToken(ctx, CreateRefreshTokenParams{
			UserID:    uid,
			TokenHash: "token-hash",
			ExpiresAt: expires,
			UserAgent: strPtr("Mozilla/5.0"),
			Ip:        strPtr("1.2.3.4"),
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.ID != id {
			t.Errorf("ID: got %v want %v", got.ID, id)
		}
		if got.UserID != uid {
			t.Errorf("UserID: got %v want %v", got.UserID, uid)
		}
		if got.TokenHash != "token-hash" {
			t.Errorf("TokenHash: got %q", got.TokenHash)
		}
		if !got.ExpiresAt.Equal(expires) {
			t.Errorf("ExpiresAt: got %v want %v", got.ExpiresAt, expires)
		}
		if got.RevokedAt == nil || !got.RevokedAt.Equal(created) {
			t.Errorf("RevokedAt: got %v", got.RevokedAt)
		}
		if got.UserAgent == nil || *got.UserAgent != "Mozilla/5.0" {
			t.Errorf("UserAgent: got %v", got.UserAgent)
		}
		if got.Ip == nil || *got.Ip != "1.2.3.4" {
			t.Errorf("Ip: got %v", got.Ip)
		}
		if !got.CreatedAt.Equal(created) {
			t.Errorf("CreatedAt: got %v want %v", got.CreatedAt, created)
		}

		// SQL arg order: user_id, token_hash, expires_at, user_agent, ip.
		wantArgs := []any{uid, "token-hash", expires, strPtr("Mozilla/5.0"), strPtr("1.2.3.4")}
		if !reflect.DeepEqual(m.lastArgs, wantArgs) {
			t.Errorf("args: got %v want %v", m.lastArgs, wantArgs)
		}
	})

	t.Run("nullable columns stay nil", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			id, uid, "token-hash", expires, nil, nil, nil, created,
		)}}
		q := New(m)

		got, err := q.CreateRefreshToken(ctx, CreateRefreshTokenParams{
			UserID:    uid,
			TokenHash: "token-hash",
			ExpiresAt: expires,
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.RevokedAt != nil {
			t.Errorf("expected nil RevokedAt, got %v", *got.RevokedAt)
		}
		if got.UserAgent != nil {
			t.Errorf("expected nil UserAgent, got %v", *got.UserAgent)
		}
		if got.Ip != nil {
			t.Errorf("expected nil Ip, got %v", *got.Ip)
		}
	})

	t.Run("propagates scan error", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{errRow(errors.New("boom"))}}
		q := New(m)

		_, err := q.CreateRefreshToken(ctx, CreateRefreshTokenParams{UserID: uid})
		if err == nil {
			t.Fatal("expected error, got nil")
		}
	})
}

func TestQueries_GetRefreshTokenByHash(t *testing.T) {
	ctx := context.Background()
	id := uuidMust("33333333-4444-5555-6666-777788889999")
	uid := uuidMust("44444444-5555-6666-7777-888899990000")
	expires := time.Now().Add(1 * time.Hour).UTC()
	created := time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC)

	t.Run("maps scanned row", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			id, uid, "hash-abc", expires, nil, strPtr("curl/8"), strPtr("9.9.9.9"), created,
		)}}
		q := New(m)

		got, err := q.GetRefreshTokenByHash(ctx, "hash-abc")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.ID != id {
			t.Errorf("ID: got %v want %v", got.ID, id)
		}
		if got.UserID != uid {
			t.Errorf("UserID: got %v want %v", got.UserID, uid)
		}
		if got.TokenHash != "hash-abc" {
			t.Errorf("TokenHash: got %q", got.TokenHash)
		}
		if got.RevokedAt != nil {
			t.Errorf("expected nil RevokedAt, got %v", *got.RevokedAt)
		}
		if got.UserAgent == nil || *got.UserAgent != "curl/8" {
			t.Errorf("UserAgent: got %v", got.UserAgent)
		}
		if got.Ip == nil || *got.Ip != "9.9.9.9" {
			t.Errorf("Ip: got %v", got.Ip)
		}
		if m.lastArgs[0] != "hash-abc" {
			t.Errorf("expected token hash as arg, got %v", m.lastArgs[0])
		}
	})

	t.Run("propagates scan error", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{errRow(errors.New("no rows"))}}
		q := New(m)

		_, err := q.GetRefreshTokenByHash(ctx, "missing")
		if err == nil {
			t.Fatal("expected error, got nil")
		}
	})
}

func TestQueries_RevokeRefreshTokenByHash(t *testing.T) {
	ctx := context.Background()

	t.Run("issues an exec and returns nil on success", func(t *testing.T) {
		m := &mockDBTX{}
		q := New(m)

		err := q.RevokeRefreshTokenByHash(ctx, "hash-abc")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if m.execCalls != 1 {
			t.Errorf("expected 1 Exec call, got %d", m.execCalls)
		}
		if m.queryRowCalls != 0 {
			t.Errorf("expected 0 QueryRow calls, got %d", m.queryRowCalls)
		}
		if m.lastArgs[0] != "hash-abc" {
			t.Errorf("expected token hash as arg, got %v", m.lastArgs[0])
		}
	})

	t.Run("propagates exec error", func(t *testing.T) {
		execErr := errors.New("connection reset")
		m := &mockDBTX{execErr: execErr}
		q := New(m)

		err := q.RevokeRefreshTokenByHash(ctx, "hash-abc")
		if !errors.Is(err, execErr) {
			t.Fatalf("expected %v, got %v", execErr, err)
		}
	})
}
