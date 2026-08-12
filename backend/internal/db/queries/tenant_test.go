package queries

import (
	"context"
	"errors"
	"reflect"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
)

func TestQueries_CheckTenantExistsBySubdomain(t *testing.T) {
	ctx := context.Background()

	t.Run("returns true when row scans true", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(true)}}
		q := New(m)

		got, err := q.CheckTenantExistsBySubdomain(ctx, "daves")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if !got {
			t.Fatal("expected exists=true")
		}
		if m.lastArgs[0] != "daves" {
			t.Errorf("expected subdomain as arg, got %v", m.lastArgs[0])
		}
	})

	t.Run("returns false when row scans false", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(false)}}
		q := New(m)

		got, err := q.CheckTenantExistsBySubdomain(ctx, "free")
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

		_, err := q.CheckTenantExistsBySubdomain(ctx, "x")
		if !errors.Is(err, scanErr) {
			t.Fatalf("expected %v, got %v", scanErr, err)
		}
	})
}

func TestQueries_CreateTenant(t *testing.T) {
	ctx := context.Background()
	tid := uuidMust("11111111-2222-3333-4444-555555555555")
	ts := time.Date(2026, 3, 4, 5, 6, 7, 0, time.UTC)

	t.Run("maps scanned columns into Tenant and forwards args", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			tid, "Dave's Farm", "daves", strPtr("A nice farm"), ts, ts,
		)}}
		q := New(m)

		got, err := q.CreateTenant(ctx, CreateTenantParams{
			Name:      "Dave's Farm",
			Subdomain: "daves",
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.ID != tid {
			t.Errorf("ID: got %v want %v", got.ID, tid)
		}
		if got.Name != "Dave's Farm" {
			t.Errorf("Name: got %q", got.Name)
		}
		if got.Subdomain != "daves" {
			t.Errorf("Subdomain: got %q", got.Subdomain)
		}
		if got.Description == nil || *got.Description != "A nice farm" {
			t.Errorf("Description: got %v", got.Description)
		}
		if !got.CreatedAt.Equal(ts) {
			t.Errorf("CreatedAt: got %v want %v", got.CreatedAt, ts)
		}

		// SQL arg order: name, subdomain.
		wantArgs := []any{"Dave's Farm", "daves"}
		if !reflect.DeepEqual(m.lastArgs, wantArgs) {
			t.Errorf("args: got %v want %v", m.lastArgs, wantArgs)
		}
	})

	t.Run("description stays nil when scanned nil", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			tid, "Bare Tenant", "bare", nil, ts, ts,
		)}}
		q := New(m)

		got, err := q.CreateTenant(ctx, CreateTenantParams{Name: "Bare Tenant", Subdomain: "bare"})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.Description != nil {
			t.Errorf("expected nil Description, got %v", *got.Description)
		}
	})

	t.Run("propagates scan error", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{errRow(errors.New("unique violation"))}}
		q := New(m)

		_, err := q.CreateTenant(ctx, CreateTenantParams{Name: "Dup", Subdomain: "dup"})
		if err == nil {
			t.Fatal("expected error, got nil")
		}
	})
}

func TestQueries_UpdateTenant(t *testing.T) {
	ctx := context.Background()
	tid := uuidMust("66666666-7777-8888-9999-aaaaaaaaaaaa")
	ts := time.Date(2026, 6, 7, 8, 9, 0, 0, time.UTC)

	t.Run("maps scanned row and forwards args", func(t *testing.T) {
		desc := "Updated description"
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			tid, "New Name", "new-sub", &desc, ts, ts,
		)}}
		q := New(m)

		got, err := q.UpdateTenant(ctx, UpdateTenantParams{
			ID:          tid,
			Name:        "New Name",
			Subdomain:   "new-sub",
			Description: &desc,
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got.Name != "New Name" {
			t.Errorf("Name: got %q", got.Name)
		}
		if got.Subdomain != "new-sub" {
			t.Errorf("Subdomain: got %q", got.Subdomain)
		}
		if got.Description == nil || *got.Description != "Updated description" {
			t.Errorf("Description: got %v", got.Description)
		}

		// SQL arg order: id, name, subdomain, description.
		wantArgs := []any{tid, "New Name", "new-sub", &desc}
		if !reflect.DeepEqual(m.lastArgs, wantArgs) {
			t.Errorf("args: got %v want %v", m.lastArgs, wantArgs)
		}
	})

	t.Run("forwards nil description arg", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{rowFrom(
			tid, "Name", "sub", nil, ts, ts,
		)}}
		q := New(m)

		_, err := q.UpdateTenant(ctx, UpdateTenantParams{
			ID:          tid,
			Name:        "Name",
			Subdomain:   "sub",
			Description: nil,
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		wantArgs := []any{tid, "Name", "sub", (*string)(nil)}
		if !reflect.DeepEqual(m.lastArgs, wantArgs) {
			t.Errorf("args: got %v want %v", m.lastArgs, wantArgs)
		}
	})

	t.Run("propagates scan error", func(t *testing.T) {
		m := &mockDBTX{nextRows: []pgx.Row{errRow(errors.New("boom"))}}
		q := New(m)

		_, err := q.UpdateTenant(ctx, UpdateTenantParams{ID: tid})
		if err == nil {
			t.Fatal("expected error, got nil")
		}
	})
}
