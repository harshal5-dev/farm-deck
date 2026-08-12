package queries

import (
	"context"
	"testing"

	"github.com/jackc/pgx/v5"
)

// These tests cover the constructors defined in the generated db.go (New and
// WithTx), proving that a *Queries routes its calls through the injected DBTX.

func TestNew_BindsProvidedDBTX(t *testing.T) {
	ctx := context.Background()
	m := &mockDBTX{nextRows: []pgx.Row{rowFrom(true)}}

	q := New(m)

	exists, err := q.CheckUserExistsByEmailID(ctx, "someone@farmdeck.app")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !exists {
		t.Fatal("expected exists=true, got false")
	}
	if m.queryRowCalls != 1 {
		t.Errorf("expected exactly one QueryRow call, got %d", m.queryRowCalls)
	}
}

func TestWithTx_ReturnsQueriesBoundToTx(t *testing.T) {
	ctx := context.Background()

	// The original Queries is wired to a mock that is never touched.
	original := New(&mockDBTX{nextRows: []pgx.Row{rowFrom(false)}})

	// The transaction-backed Queries should route through the tx instead.
	tx := &fakeTx{row: rowFrom(true)}
	txQueries := original.WithTx(tx)

	got, err := txQueries.CheckUserExistsByEmailID(ctx, "anyone@farmdeck.app")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !got {
		t.Fatal("expected exists=true from the tx-backed query")
	}
	if tx.queryRowCalls != 1 {
		t.Errorf("expected the tx QueryRow to be called once, got %d", tx.queryRowCalls)
	}
}

func TestWithTx_DoesNotMutateOriginalQueries(t *testing.T) {
	original := New(&mockDBTX{})

	other := original.WithTx(&fakeTx{})

	if other == nil {
		t.Fatal("WithTx returned nil")
	}
	// A new *Queries must be returned; the original must not be reused.
	if other == original {
		t.Fatal("WithTx should return a distinct *Queries, not the receiver")
	}
}
