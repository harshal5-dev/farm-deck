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

func TestQueries_CheckUserExistsByEmailID(t *testing.T) {
	ctx := context.Background()

	t.Run("returns true when row scans true", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(true)}}
		q := New(m)

		got, err := q.CheckUserExistsByEmailID(ctx, "alice@farmdeck.app")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if !got {
			t.Fatal("expected exists=true")
		}
		if m.lastArgs[0] != "alice@farmdeck.app" {
			t.Errorf("expected email as first arg, got %v", m.lastArgs[0])
		}
	})

	t.Run("returns false when row scans false", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(false)}}
		q := New(m)

		got, err := q.CheckUserExistsByEmailID(ctx, "nobody@farmdeck.app")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got {
			t.Fatal("expected exists=false")
		}
	})

	t.Run("propagates scan error", func(t *testing.T) {
		scanErr := errors.New("scan failure")
		m := &mockDBTX{nextRows: []pgx.Row{errRow(scanErr)}}
		q := New(m)

		_, err := q.CheckUserExistsByEmailID(ctx, "x")
		if !errors.Is(err, scanErr) {
			t.Fatalf("expected %v, got %v", scanErr, err)
		}
	})
}

func TestQueries_CreateUser(t *testing.T) {
	ctx := context.Background()
	uid := uuidMust("11111111-1111-1111-1111-111111111111")
	tid := uuidMust("22222222-2222-2222-2222-222222222222")
	ts := time.Date(2026, 1, 2, 3, 4, 5, 0, time.UTC)

	t.Run("maps all scanned columns into the User", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			uid, tid, "alice@farmdeck.app", "Alice", strPtr("pic.png"), domain.UserRoleOwner, domain.UserStatusActive, ts, ts,
		)}}
		q := New(m)

		got, err := q.CreateUser(ctx, CreateUserParams{
			FullName: "Alice",
			EmailID:  "alice@farmdeck.app",
			Role:     domain.UserRoleOwner,
			Status:   domain.UserStatusActive,
			TenantID: tid,
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.ID != uid {
			t.Errorf("ID: got %v want %v", got.ID, uid)
		}
		if got.TenantID != tid {
			t.Errorf("TenantID: got %v want %v", got.TenantID, tid)
		}
		if got.EmailID != "alice@farmdeck.app" {
			t.Errorf("EmailID: got %q", got.EmailID)
		}
		if got.FullName != "Alice" {
			t.Errorf("FullName: got %q", got.FullName)
		}
		if got.ProfilePicture == nil || *got.ProfilePicture != "pic.png" {
			t.Errorf("ProfilePicture: got %v", got.ProfilePicture)
		}
		if got.Role != domain.UserRoleOwner {
			t.Errorf("Role: got %q", got.Role)
		}
		if got.Status != domain.UserStatusActive {
			t.Errorf("Status: got %q", got.Status)
		}
		if !got.CreatedAt.Equal(ts) {
			t.Errorf("CreatedAt: got %v want %v", got.CreatedAt, ts)
		}
		if !got.UpdatedAt.Equal(ts) {
			t.Errorf("UpdatedAt: got %v want %v", got.UpdatedAt, ts)
		}

		// SQL arg order: full_name, email_id, role, status, tenant_id.
		wantArgs := []any{"Alice", "alice@farmdeck.app", domain.UserRoleOwner, domain.UserStatusActive, tid}
		if !reflect.DeepEqual(m.lastArgs, wantArgs) {
			t.Errorf("args: got %v want %v", m.lastArgs, wantArgs)
		}
		if m.queryRowCalls != 1 {
			t.Errorf("expected 1 QueryRow call, got %d", m.queryRowCalls)
		}
	})

	t.Run("nil profile picture stays nil", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			uid, tid, "alice@farmdeck.app", "Alice", nil, domain.UserRoleOwner, domain.UserStatusActive, ts, ts,
		)}}
		q := New(m)

		got, err := q.CreateUser(ctx, CreateUserParams{
			FullName: "Alice",
			EmailID:  "alice@farmdeck.app",
			TenantID: tid,
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.ProfilePicture != nil {
			t.Errorf("expected nil ProfilePicture, got %v", *got.ProfilePicture)
		}
	})

	t.Run("propagates scan error", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{errRow(errors.New("unique violation"))}}
		q := New(m)

		_, err := q.CreateUser(ctx, CreateUserParams{TenantID: tid})
		if err == nil {
			t.Fatal("expected error, got nil")
		}
	})
}

func TestQueries_GetUserByEmailID(t *testing.T) {
	ctx := context.Background()
	uid := uuidMust("33333333-3333-3333-3333-333333333333")
	tid := uuidMust("44444444-4444-4444-4444-444444444444")
	ts := time.Date(2026, 5, 6, 7, 8, 9, 0, time.UTC)

	t.Run("maps scanned row into User", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			uid, tid, "bob@farmdeck.app", "Bob", strPtr("bob.png"), domain.UserRoleGrower, domain.UserStatusActive, ts, ts,
		)}}
		q := New(m)

		got, err := q.GetUserByEmailID(ctx, "bob@farmdeck.app")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.ID != uid {
			t.Errorf("ID: got %v want %v", got.ID, uid)
		}
		if got.EmailID != "bob@farmdeck.app" {
			t.Errorf("EmailID: got %q", got.EmailID)
		}
		if got.Role != domain.UserRoleGrower {
			t.Errorf("Role: got %q", got.Role)
		}
		if m.lastArgs[0] != "bob@farmdeck.app" {
			t.Errorf("expected email as arg, got %v", m.lastArgs[0])
		}
	})

	t.Run("propagates scan error", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{errRow(errors.New("no rows"))}}
		q := New(m)

		_, err := q.GetUserByEmailID(ctx, "missing")
		if err == nil {
			t.Fatal("expected error, got nil")
		}
	})
}

func TestQueries_GetUserByID(t *testing.T) {
	ctx := context.Background()
	uid := uuidMust("55555555-5555-5555-5555-555555555555")
	tid := uuidMust("66666666-6666-6666-6666-666666666666")
	ts := time.Date(2026, 7, 8, 9, 10, 11, 0, time.UTC)

	t.Run("maps scanned row into User", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			uid, tid, "carol@farmdeck.app", "Carol", nil, domain.UserRoleManager, domain.UserStatusPending, ts, ts,
		)}}
		q := New(m)

		got, err := q.GetUserByID(ctx, uid)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.ID != uid {
			t.Errorf("ID: got %v want %v", got.ID, uid)
		}
		if got.Status != domain.UserStatusPending {
			t.Errorf("Status: got %q", got.Status)
		}
		if got.ProfilePicture != nil {
			t.Errorf("expected nil ProfilePicture, got %v", *got.ProfilePicture)
		}
		if m.lastArgs[0] != uid {
			t.Errorf("expected id as arg, got %v", m.lastArgs[0])
		}
	})

	t.Run("propagates scan error", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{errRow(errors.New("no rows"))}}
		q := New(m)

		_, err := q.GetUserByID(ctx, uid)
		if err == nil {
			t.Fatal("expected error, got nil")
		}
	})
}

func TestQueries_GetUserProfileDetails(t *testing.T) {
	ctx := context.Background()
	uid := uuidMust("77777777-7777-7777-7777-777777777777")
	tid := uuidMust("88888888-8888-8888-8888-888888888888")
	userCreated := time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC)
	tenantCreated := time.Date(2025, 12, 1, 0, 0, 0, 0, time.UTC)
	lastActive := time.Date(2026, 2, 3, 4, 5, 6, 0, time.UTC)

	t.Run("maps joined user+tenant columns", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			uid, "Dave", "dave@farmdeck.app", domain.UserRoleOwner, strPtr("dave.png"),
			domain.UserStatusActive, userCreated, timePtr(lastActive),
			tid, "Dave's Farm", "daves", strPtr("A nice farm"), tenantCreated,
		)}}
		q := New(m)

		got, err := q.GetUserProfileDetails(ctx, uid)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.ID != uid {
			t.Errorf("ID: got %v want %v", got.ID, uid)
		}
		if got.FullName != "Dave" {
			t.Errorf("FullName: got %q", got.FullName)
		}
		if got.EmailID != "dave@farmdeck.app" {
			t.Errorf("EmailID: got %q", got.EmailID)
		}
		if got.Role != domain.UserRoleOwner {
			t.Errorf("Role: got %q", got.Role)
		}
		if got.ProfilePicture == nil || *got.ProfilePicture != "dave.png" {
			t.Errorf("ProfilePicture: got %v", got.ProfilePicture)
		}
		if got.Status != domain.UserStatusActive {
			t.Errorf("Status: got %q", got.Status)
		}
		if !got.CreatedAt.Equal(userCreated) {
			t.Errorf("CreatedAt: got %v want %v", got.CreatedAt, userCreated)
		}
		if got.LastActiveAt == nil || !got.LastActiveAt.Equal(lastActive) {
			t.Errorf("LastActiveAt: got %v want %v", got.LastActiveAt, lastActive)
		}
		if got.TenantID != tid {
			t.Errorf("TenantID: got %v want %v", got.TenantID, tid)
		}
		if got.TenantName != "Dave's Farm" {
			t.Errorf("TenantName: got %q", got.TenantName)
		}
		if got.Subdomain != "daves" {
			t.Errorf("Subdomain: got %q", got.Subdomain)
		}
		if got.Description == nil || *got.Description != "A nice farm" {
			t.Errorf("Description: got %v", got.Description)
		}
		if !got.TenantCreatedAt.Equal(tenantCreated) {
			t.Errorf("TenantCreatedAt: got %v want %v", got.TenantCreatedAt, tenantCreated)
		}
		if m.lastArgs[0] != uid {
			t.Errorf("expected id as arg, got %v", m.lastArgs[0])
		}
	})

	t.Run("nullable columns stay nil", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			uid, "Eve", "eve@farmdeck.app", domain.UserRoleViewer, nil,
			domain.UserStatusActive, userCreated, nil,
			tid, "Eve Co", "eve", nil, tenantCreated,
		)}}
		q := New(m)

		got, err := q.GetUserProfileDetails(ctx, uid)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.ProfilePicture != nil {
			t.Errorf("expected nil ProfilePicture, got %v", *got.ProfilePicture)
		}
		if got.Description != nil {
			t.Errorf("expected nil Description, got %v", *got.Description)
		}
		if got.LastActiveAt != nil {
			t.Errorf("expected nil LastActiveAt, got %v", *got.LastActiveAt)
		}
	})

	t.Run("propagates scan error", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{errRow(errors.New("boom"))}}
		q := New(m)

		_, err := q.GetUserProfileDetails(ctx, uid)
		if err == nil {
			t.Fatal("expected error, got nil")
		}
	})
}

func TestQueries_UpdateUserProfile(t *testing.T) {
	ctx := context.Background()
	uid := uuidMust("99999999-9999-9999-9999-999999999999")
	tid := uuidMust("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
	ts := time.Date(2026, 2, 2, 2, 2, 2, 0, time.UTC)

	t.Run("returns updated user and forwards args", func(t *testing.T) {
		pic := "new-pic.png"
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			uid, tid, "frank@farmdeck.app", "Frank New", &pic,
			domain.UserRoleOwner, domain.UserStatusActive, ts, ts,
		)}}
		q := New(m)

		got, err := q.UpdateUserProfile(ctx, UpdateUserProfileParams{
			ID:             uid,
			FullName:       "Frank New",
			ProfilePicture: &pic,
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.FullName != "Frank New" {
			t.Errorf("FullName: got %q", got.FullName)
		}
		if got.ProfilePicture == nil || *got.ProfilePicture != "new-pic.png" {
			t.Errorf("ProfilePicture: got %v", got.ProfilePicture)
		}

		// SQL arg order: id, full_name, profile_picture.
		wantArgs := []any{uid, "Frank New", &pic}
		if !reflect.DeepEqual(m.lastArgs, wantArgs) {
			t.Errorf("args: got %v want %v", m.lastArgs, wantArgs)
		}
	})

	t.Run("forwards nil profile picture arg", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			uid, tid, "frank@farmdeck.app", "Frank", nil,
			domain.UserRoleOwner, domain.UserStatusActive, ts, ts,
		)}}
		q := New(m)

		got, err := q.UpdateUserProfile(ctx, UpdateUserProfileParams{
			ID:             uid,
			FullName:       "Frank",
			ProfilePicture: nil,
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.ProfilePicture != nil {
			t.Errorf("expected nil ProfilePicture, got %v", *got.ProfilePicture)
		}
		wantArgs := []any{uid, "Frank", (*string)(nil)}
		if !reflect.DeepEqual(m.lastArgs, wantArgs) {
			t.Errorf("args: got %v want %v", m.lastArgs, wantArgs)
		}
	})

	t.Run("propagates scan error", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{errRow(errors.New("boom"))}}
		q := New(m)

		_, err := q.UpdateUserProfile(ctx, UpdateUserProfileParams{ID: uid})
		if err == nil {
			t.Fatal("expected error, got nil")
		}
	})
}
