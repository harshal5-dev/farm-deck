package httptransport

import (
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
)

// mockStore satisfies db.Store for the server-wiring tests. No store method is
// called during app.NewContainer, NewServer, setupRoutes, or a GET /health, so
// a nil embedded interface is sufficient — promoted methods only panic if one
// is accidentally invoked, which would itself be a bug worth surfacing.
type mockStore struct {
	db.Store
}

// compile-time interface check.
var _ db.Store = (*mockStore)(nil)
