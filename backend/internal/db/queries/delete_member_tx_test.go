package queries

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

// These tests cover the unexported deleteMemberAndCredential helper in
// delete_member_tx.go, which holds the real business rule: an active member's
// credential is removed in the same transaction, while invited/suspended
// members (which have no credential) skip that step.
//
// DeleteMemberTx itself wraps this in execTx (which needs a real connection
// pool) and is therefore left to an integration test suite, mirroring the
// existing register_tx_test.go.

func TestDeleteMemberAndCredential(t *testing.T) {
	ctx := context.Background()
	id := uuidMust("11111111-1111-1111-1111-111111111111")
	tenantID := uuidMust("22222222-2222-2222-2222-222222222222")
	ts := time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC)

	// DeleteMember is a QueryRow returning the soft-deleted user row, in the
	// column order of the generated RETURNING clause:
	// id, tenant_id, email_id, full_name, profile_picture, role, status,
	// created_at, updated_at, last_active_at, deleted_at.
	activeRow := rowFrom(
		id, tenantID, "alice@farmdeck.app", "Alice", nil,
		domain.UserRoleOwner, domain.UserStatusActive, ts, ts, nil, nil,
	)
	invitedRow := rowFrom(
		id, tenantID, "bob@farmdeck.app", "Bob", nil,
		domain.UserRoleGrower, domain.UserStatusInvited, ts, ts, nil, nil,
	)

	t.Run("active member also deletes the credential", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{activeRow}}
		q := New(m)

		if err := deleteMemberAndCredential(ctx, q, id); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if m.queryRowCalls != 1 {
			t.Errorf("expected 1 QueryRow (DeleteMember), got %d", m.queryRowCalls)
		}
		if m.execCalls != 1 {
			t.Errorf("expected 1 Exec (DeleteCredentialByUserID), got %d", m.execCalls)
		}
		if !equalAny(m.lastArgs[0], id) {
			t.Errorf("DeleteCredentialByUserID arg = %v, want %v", m.lastArgs[0], id)
		}
	})

	t.Run("non-active member skips credential deletion", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{invitedRow}}
		q := New(m)

		if err := deleteMemberAndCredential(ctx, q, id); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if m.queryRowCalls != 1 {
			t.Errorf("expected 1 QueryRow (DeleteMember), got %d", m.queryRowCalls)
		}
		if m.execCalls != 0 {
			t.Errorf("expected no Exec (DeleteCredentialByUserID), got %d", m.execCalls)
		}
	})

	t.Run("propagates the DeleteMember error", func(t *testing.T) {
		delErr := errors.New("delete failed")
		m := &mockDBTX{nextRows: []pgx.Row{errRow(delErr)}}
		q := New(m)

		err := deleteMemberAndCredential(ctx, q, id)
		if !errors.Is(err, delErr) {
			t.Fatalf("expected %v, got %v", delErr, err)
		}
		if m.execCalls != 0 {
			t.Errorf("expected no Exec after DeleteMember failure, got %d", m.execCalls)
		}
	})

	t.Run("propagates the DeleteCredentialByUserID error", func(t *testing.T) {
		credErr := errors.New("credential delete failed")
		m := &mockDBTX{nextRows: []pgx.Row{activeRow}, execErr: credErr}
		q := New(m)

		err := deleteMemberAndCredential(ctx, q, id)
		if !errors.Is(err, credErr) {
			t.Fatalf("expected %v, got %v", credErr, err)
		}
	})
}
