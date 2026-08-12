package db

import (
	"strings"
	"testing"
)

// Init wraps pgxpool.New + Ping and is the only entry point that can't be
// reached with the mock DBTX (it needs a concrete *pgxpool.Pool). These tests
// cover its two error branches without a healthy database: a malformed DSN
// fails at pool construction, and an unreachable host fails the ping.
//
// The success path (Init returns a usable Store) requires a live, migrated
// Postgres and belongs to an integration test suite.

func TestInit_MalformedDSNReturnsError(t *testing.T) {
	store, err := Init("postgres://localhost:not-a-port/x")

	if err == nil {
		t.Fatal("expected an error for a malformed DSN, got nil")
	}
	if store != nil {
		t.Errorf("expected nil store on failure, got %T", store)
	}
	if !strings.Contains(err.Error(), "database") {
		t.Errorf("expected a database-related message, got %q", err.Error())
	}
}

func TestInit_UnreachableHostReturnsError(t *testing.T) {
	// Nothing listens on localhost:1, so the connection is refused quickly.
	// connect_timeout keeps the failure fast even on odd environments.
	store, err := Init("postgres://u:p@127.0.0.1:1/x?sslmode=disable&connect_timeout=1")

	if err == nil {
		t.Fatal("expected an error for an unreachable host, got nil")
	}
	if store != nil {
		t.Errorf("expected nil store on failure, got %T", store)
	}
	if !strings.Contains(err.Error(), "database") {
		t.Errorf("expected a database-related message, got %q", err.Error())
	}
}
