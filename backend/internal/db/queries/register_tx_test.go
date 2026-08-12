package queries

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

// These tests cover the unexported helpers in register_tx.go — saveTenant,
// saveUser and saveCredential — which hold the real business rules (duplicate
// tenant/user detection, role/status defaults) and are the only part of the
// transaction layer reachable without a live *pgxpool.Pool.
//
// RegisterUserTx itself wraps these in execTx (which needs a real connection
// pool) and is therefore left to an integration test suite.

func TestSaveTenant(t *testing.T) {
	ctx := context.Background()
	arg := domain.TenantInfo{Name: "Dave's Farm", Subdomain: "daves"}
	tenantID := uuidMust("11111111-1111-1111-1111-111111111111")
	ts := time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC)

	t.Run("creates tenant when subdomain is free", func(t *testing.T) {
		// Row 1: CheckTenantExistsBySubdomain -> false.
		// Row 2: CreateTenant -> the new tenant row.
		m := &mockDBTX{nextRows: []pgx.Row{
			rowFrom(false),
			rowFrom(tenantID, "Dave's Farm", "daves", strPtr("ignored"), ts, ts),
		}}
		q := New(m)

		got, err := saveTenant(ctx, q, arg)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.ID != tenantID {
			t.Errorf("ID: got %v want %v", got.ID, tenantID)
		}
		if got.Name != "Dave's Farm" {
			t.Errorf("Name: got %q", got.Name)
		}
		if got.Subdomain != "daves" {
			t.Errorf("Subdomain: got %q", got.Subdomain)
		}
		if m.queryRowCalls != 2 {
			t.Errorf("expected check + create (2 calls), got %d", m.queryRowCalls)
		}
		// CreateTenant call should forward name + subdomain.
		createArgs := m.argsByCall[1]
		if createArgs[0] != "Dave's Farm" || createArgs[1] != "daves" {
			t.Errorf("CreateTenant args: got %v", createArgs)
		}
	})

	t.Run("returns ErrTenantExists when subdomain is taken", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(true)}}
		q := New(m)

		_, err := saveTenant(ctx, q, arg)
		if !errors.Is(err, domain.ErrTenantExists) {
			t.Fatalf("expected ErrTenantExists, got %v", err)
		}
		// Must short-circuit before CreateTenant.
		if m.queryRowCalls != 1 {
			t.Errorf("expected only the existence check (1 call), got %d", m.queryRowCalls)
		}
	})

	t.Run("propagates the existence-check error", func(t *testing.T) {
		checkErr := errors.New("connection refused")
		m := &mockDBTX{nextRows: []pgx.Row{errRow(checkErr)}}
		q := New(m)

		_, err := saveTenant(ctx, q, arg)
		if !errors.Is(err, checkErr) {
			t.Fatalf("expected %v, got %v", checkErr, err)
		}
	})

	t.Run("propagates the create error", func(t *testing.T) {
		createErr := errors.New("unique violation")
		m := &mockDBTX{nextRows: []pgx.Row{
			rowFrom(false),
			errRow(createErr),
		}}
		q := New(m)

		_, err := saveTenant(ctx, q, arg)
		if !errors.Is(err, createErr) {
			t.Fatalf("expected %v, got %v", createErr, err)
		}
	})
}

func TestSaveUser(t *testing.T) {
	ctx := context.Background()
	arg := domain.UserInfo{FullName: "Alice", EmailID: "alice@farmdeck.app"}
	tenantID := uuidMust("22222222-2222-2222-2222-222222222222")
	userID := uuidMust("33333333-3333-3333-3333-333333333333")
	ts := time.Date(2026, 2, 2, 0, 0, 0, 0, time.UTC)

	t.Run("creates user with owner role and active status", func(t *testing.T) {
		// Row 1: CheckUserExistsByEmailID -> false.
		// Row 2: CreateUser -> the new user row.
		m := &mockDBTX{nextRows: []pgx.Row{
			rowFrom(false),
			rowFrom(userID, tenantID, "alice@farmdeck.app", "Alice", nil, domain.UserRoleOwner, domain.UserStatusActive, ts, ts),
		}}
		q := New(m)

		got, err := saveUser(ctx, q, arg, tenantID)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.ID != userID {
			t.Errorf("ID: got %v want %v", got.ID, userID)
		}
		if got.TenantID != tenantID {
			t.Errorf("TenantID: got %v want %v", got.TenantID, tenantID)
		}
		if got.Role != domain.UserRoleOwner {
			t.Errorf("Role: got %q want %q", got.Role, domain.UserRoleOwner)
		}
		if got.Status != domain.UserStatusActive {
			t.Errorf("Status: got %q want %q", got.Status, domain.UserStatusActive)
		}
		if m.queryRowCalls != 2 {
			t.Errorf("expected check + create (2 calls), got %d", m.queryRowCalls)
		}

		// CreateUser SQL arg order: full_name, email_id, role, status, tenant_id.
		// saveUser must force role=owner and status=active regardless of input.
		createArgs := m.argsByCall[1]
		wantArgs := []any{"Alice", "alice@farmdeck.app", domain.UserRoleOwner, domain.UserStatusActive, tenantID}
		if len(createArgs) != len(wantArgs) {
			t.Fatalf("CreateTenant arg count: got %d want %d", len(createArgs), len(wantArgs))
		}
		for i, want := range wantArgs {
			if !equalAny(createArgs[i], want) {
				t.Errorf("CreateUser arg[%d]: got %v want %v", i, createArgs[i], want)
			}
		}
	})

	t.Run("returns ErrUserExists when email is taken", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(true)}}
		q := New(m)

		_, err := saveUser(ctx, q, arg, tenantID)
		if !errors.Is(err, domain.ErrUserExists) {
			t.Fatalf("expected ErrUserExists, got %v", err)
		}
		if m.queryRowCalls != 1 {
			t.Errorf("expected only the existence check (1 call), got %d", m.queryRowCalls)
		}
	})

	t.Run("propagates the existence-check error", func(t *testing.T) {
		checkErr := errors.New("timeout")
		m := &mockDBTX{nextRows: []pgx.Row{errRow(checkErr)}}
		q := New(m)

		_, err := saveUser(ctx, q, arg, tenantID)
		if !errors.Is(err, checkErr) {
			t.Fatalf("expected %v, got %v", checkErr, err)
		}
	})

	t.Run("propagates the create error", func(t *testing.T) {
		createErr := errors.New("constraint violation")
		m := &mockDBTX{nextRows: []pgx.Row{
			rowFrom(false),
			errRow(createErr),
		}}
		q := New(m)

		_, err := saveUser(ctx, q, arg, tenantID)
		if !errors.Is(err, createErr) {
			t.Fatalf("expected %v, got %v", createErr, err)
		}
	})
}

func TestSaveCredential(t *testing.T) {
	ctx := context.Background()
	userID := uuid.MustParse("44444444-4444-4444-4444-444444444444")
	arg := domain.Credential{EmailID: "alice@farmdeck.app", PasswordHash: "hashed-secret"}
	ts := time.Date(2026, 3, 3, 0, 0, 0, 0, time.UTC)

	t.Run("creates credential bound to the user id", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			userID, "alice@farmdeck.app", "hashed-secret", ts, ts,
		)}}
		q := New(m)

		if err := saveCredential(ctx, q, userID, arg); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		// CreateCredential SQL arg order: user_id, email_id, password_hash.
		got := m.lastArgs
		if got[0] != userID {
			t.Errorf("user_id arg: got %v want %v", got[0], userID)
		}
		if got[1] != "alice@farmdeck.app" {
			t.Errorf("email_id arg: got %v", got[1])
		}
		if got[2] != "hashed-secret" {
			t.Errorf("password_hash arg: got %v", got[2])
		}
	})

	t.Run("propagates create error", func(t *testing.T) {
		createErr := errors.New("fk violation")
		m := &mockDBTX{nextRows: []pgx.Row{errRow(createErr)}}
		q := New(m)

		err := saveCredential(ctx, q, userID, arg)
		if !errors.Is(err, createErr) {
			t.Fatalf("expected %v, got %v", createErr, err)
		}
	})
}

// equalAny compares two values that may be uuid.UUID (an array type) using
// reflect, since == does not work on them when boxed in interface{}.
func equalAny(a, b any) bool {
	if va, ok := a.(uuid.UUID); ok {
		if vb, ok := b.(uuid.UUID); ok {
			return va == vb
		}
	}
	return a == b
}
