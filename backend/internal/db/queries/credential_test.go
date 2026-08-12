package queries

import (
	"context"
	"errors"
	"reflect"
	"testing"
	"time"

	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

func TestQueries_CreateCredential(t *testing.T) {
	ctx := context.Background()
	uid := uuidMust("11111111-2222-3333-4444-555566667777")
	ts := time.Date(2026, 1, 2, 3, 4, 5, 0, time.UTC)

	t.Run("maps scanned columns and forwards args", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			uid, "alice@farmdeck.app", "hashed-secret", ts, ts,
		)}}
		q := New(m)

		got, err := q.CreateCredential(ctx, CreateCredentialParams{
			UserID:       uid,
			EmailID:      "alice@farmdeck.app",
			PasswordHash: "hashed-secret",
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.UserID != uid {
			t.Errorf("UserID: got %v want %v", got.UserID, uid)
		}
		if got.EmailID != "alice@farmdeck.app" {
			t.Errorf("EmailID: got %q", got.EmailID)
		}
		if got.PasswordHash != "hashed-secret" {
			t.Errorf("PasswordHash: got %q", got.PasswordHash)
		}
		if !got.CreatedAt.Equal(ts) {
			t.Errorf("CreatedAt: got %v want %v", got.CreatedAt, ts)
		}

		// SQL arg order: user_id, email_id, password_hash.
		wantArgs := []any{uid, "alice@farmdeck.app", "hashed-secret"}
		if !reflect.DeepEqual(m.lastArgs, wantArgs) {
			t.Errorf("args: got %v want %v", m.lastArgs, wantArgs)
		}
	})

	t.Run("propagates scan error", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{errRow(errors.New("fk violation"))}}
		q := New(m)

		_, err := q.CreateCredential(ctx, CreateCredentialParams{UserID: uid})
		if err == nil {
			t.Fatal("expected error, got nil")
		}
	})
}

func TestQueries_GetCredentialByEmail(t *testing.T) {
	ctx := context.Background()
	uid := uuidMust("22222222-3333-4444-5555-666677778888")
	tid := uuidMust("33333333-4444-5555-6666-777788889999")

	t.Run("maps joined credential+user columns", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			uid, "alice@farmdeck.app", "hashed-secret", "Alice", domain.UserRoleOwner, tid,
		)}}
		q := New(m)

		got, err := q.GetCredentialByEmail(ctx, "alice@farmdeck.app")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.UserID != uid {
			t.Errorf("UserID: got %v want %v", got.UserID, uid)
		}
		if got.EmailID != "alice@farmdeck.app" {
			t.Errorf("EmailID: got %q", got.EmailID)
		}
		if got.PasswordHash != "hashed-secret" {
			t.Errorf("PasswordHash: got %q", got.PasswordHash)
		}
		if got.FullName != "Alice" {
			t.Errorf("FullName: got %q", got.FullName)
		}
		if got.Role != domain.UserRoleOwner {
			t.Errorf("Role: got %q", got.Role)
		}
		if got.TenantID != tid {
			t.Errorf("TenantID: got %v want %v", got.TenantID, tid)
		}
		if m.lastArgs[0] != "alice@farmdeck.app" {
			t.Errorf("expected email as arg, got %v", m.lastArgs[0])
		}
	})

	t.Run("propagates scan error", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{errRow(errors.New("no rows"))}}
		q := New(m)

		_, err := q.GetCredentialByEmail(ctx, "missing")
		if err == nil {
			t.Fatal("expected error, got nil")
		}
	})
}

func TestQueries_GetCredentialByUserID(t *testing.T) {
	ctx := context.Background()
	uid := uuidMust("44444444-5555-6666-7777-888899990000")
	tid := uuidMust("55555555-6666-7777-8888-999900001111")

	t.Run("maps joined credential+user columns", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			uid, "bob@farmdeck.app", "hashed-bob", "Bob", domain.UserRoleGrower, tid,
		)}}
		q := New(m)

		got, err := q.GetCredentialByUserID(ctx, uid)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.UserID != uid {
			t.Errorf("UserID: got %v want %v", got.UserID, uid)
		}
		if got.FullName != "Bob" {
			t.Errorf("FullName: got %q", got.FullName)
		}
		if got.Role != domain.UserRoleGrower {
			t.Errorf("Role: got %q", got.Role)
		}
		if got.TenantID != tid {
			t.Errorf("TenantID: got %v want %v", got.TenantID, tid)
		}
		if m.lastArgs[0] != uid {
			t.Errorf("expected userID as arg, got %v", m.lastArgs[0])
		}
	})

	t.Run("propagates scan error", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{errRow(errors.New("no rows"))}}
		q := New(m)

		_, err := q.GetCredentialByUserID(ctx, uid)
		if err == nil {
			t.Fatal("expected error, got nil")
		}
	})
}
