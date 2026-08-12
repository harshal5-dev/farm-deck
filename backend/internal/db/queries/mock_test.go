package queries

import (
	"context"
	"fmt"
	"reflect"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

// This file holds the test doubles shared by the db package unit tests.
//
// The sqlc-generated code talks to the database exclusively through the DBTX
// interface (Exec / Query / QueryRow). By driving a hand-rolled mock that
// implements DBTX we can exercise every Queries method — and the unexported
// register-tx helpers — with zero database dependencies.
//
// What this suite deliberately does NOT cover: the *SQLStore transaction
// methods (RegisterUserTx, RotateRefreshTokenTx), execTx, NewStore/Close and
// db.Init's happy path. They all depend on a concrete *pgxpool.Pool and need a
// live Postgres (see Makefile's migrate-up) — they belong to an integration
// test suite, which the project opted out of for now.

// --- mock DBTX ---------------------------------------------------------------

// mockDBTX is a test double for the sqlc-generated DBTX interface. It serves
// queued rows to successive QueryRow calls (FIFO) and records call metadata
// for assertions. Exec is exercised by the :exec query methods.
type mockDBTX struct {
	nextRows []pgx.Row // queued results returned by successive QueryRow calls
	execErr  error     // error returned by Exec
	execTag  pgconn.CommandTag

	queryRowCalls int
	execCalls     int
	queryCalls    int
	lastSQL       string
	lastArgs      []any
	argsByCall    [][]any // args captured per QueryRow call
}

func (m *mockDBTX) QueryRow(_ context.Context, sql string, args ...any) pgx.Row {
	idx := m.queryRowCalls
	m.queryRowCalls++
	m.lastSQL = sql
	m.lastArgs = args
	m.argsByCall = append(m.argsByCall, args)
	if idx < len(m.nextRows) {
		return m.nextRows[idx]
	}
	return errRow(fmt.Errorf("mockDBTX: no row queued for QueryRow call #%d", idx+1))
}

func (m *mockDBTX) Exec(_ context.Context, sql string, args ...any) (pgconn.CommandTag, error) {
	m.execCalls++
	m.lastSQL = sql
	m.lastArgs = args
	return m.execTag, m.execErr
}

func (m *mockDBTX) Query(_ context.Context, _ string, _ ...any) (pgx.Rows, error) {
	m.queryCalls++
	// No generated method in this package uses Query (all use QueryRow/Exec),
	// so a nil stub is sufficient for interface satisfaction.
	return nil, nil
}

// --- stub pgx.Row -----------------------------------------------------------

// stubRow implements pgx.Row. On Scan it either returns the configured error
// or copies pre-staged element values into the destination pointers. A nil
// entry in values leaves the corresponding destination at its zero value,
// which is how nullable (nil) columns are modelled.
type stubRow struct {
	values []any
	err    error
}

func (r *stubRow) Scan(dest ...any) error {
	if r.err != nil {
		return r.err
	}
	for i, v := range r.values {
		if v == nil {
			continue // leave destination at its zero value (models NULL)
		}
		rv := reflect.ValueOf(dest[i]).Elem()
		rv.Set(reflect.ValueOf(v).Convert(rv.Type()))
	}
	return nil
}

func (r *stubRow) DatatypeValues() []uint32 { return nil }
func (r *stubRow) Locations() []int16       { return nil }

// rowFrom builds a successful stubRow whose values are scanned, in order, into
// the destinations the generated code passes to Scan.
func rowFrom(values ...any) *stubRow { return &stubRow{values: values} }

// errRow builds a stubRow that always fails Scan with err.
func errRow(err error) *stubRow { return &stubRow{err: err} }

// --- test value helpers ------------------------------------------------------

func strPtr(s string) *string           { return &s }
func timePtr(t time.Time) *time.Time    { return &t }
func uuidMust(s string) uuid.UUID       { return uuid.MustParse(s) }

// --- minimal pgx.Tx for the WithTx test -------------------------------------

// fakeTx is a no-op pgx.Tx used only to exercise Queries.WithTx. Everything
// except QueryRow returns a zero value; QueryRow returns the configured row so
// we can assert the returned *Queries is bound to the tx rather than the
// original DBTX.
type fakeTx struct {
	row           pgx.Row
	queryRowCalls int
}

func (t *fakeTx) Begin(context.Context) (pgx.Tx, error) { return nil, nil }
func (t *fakeTx) Commit(context.Context) error          { return nil }
func (t *fakeTx) Rollback(context.Context) error        { return nil }
func (t *fakeTx) CopyFrom(context.Context, pgx.Identifier, []string, pgx.CopyFromSource) (int64, error) {
	return 0, nil
}
func (t *fakeTx) SendBatch(context.Context, *pgx.Batch) pgx.BatchResults { return nil }
func (t *fakeTx) LargeObjects() pgx.LargeObjects                        { return pgx.LargeObjects{} }
func (t *fakeTx) Prepare(context.Context, string, string) (*pgconn.StatementDescription, error) {
	return nil, nil
}
func (t *fakeTx) Exec(context.Context, string, ...any) (pgconn.CommandTag, error) {
	return pgconn.CommandTag{}, nil
}
func (t *fakeTx) Query(context.Context, string, ...any) (pgx.Rows, error) { return nil, nil }
func (t *fakeTx) QueryRow(_ context.Context, _ string, _ ...any) pgx.Row {
	t.queryRowCalls++
	return t.row
}
func (t *fakeTx) Conn() *pgx.Conn { return nil }
