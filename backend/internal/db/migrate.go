package db

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/golang-migrate/migrate/v4"
	pgx5 "github.com/golang-migrate/migrate/v4/database/pgx/v5"
	"github.com/golang-migrate/migrate/v4/source/iofs"

	dbmigrations "github.com/harshal5-dev/farm-deck/backend/db"
)

// MigrateUp applies every pending migration embedded in the binary. It opens
// its own short-lived connection via pgx's stdlib driver so it can run before
// Init. The schema_migrations bookkeeping table is the same one the migrate
// CLI writes, so CLI runs and server-startup runs stay interchangeable. A
// dirty state from a previously failed migration surfaces as an error here,
// refusing startup instead of running the app against a broken schema.
func MigrateUp(dbSource string) error {
	sqlDB, err := sql.Open("pgx/v5", dbSource)
	if err != nil {
		return fmt.Errorf("failed connect to database: %w", err)
	}
	defer sqlDB.Close()

	if err := sqlDB.Ping(); err != nil {
		return fmt.Errorf("failed ping database: %w", err)
	}

	// The migration files contain multiple statements each; the pgx driver
	// needs MultiStatementEnabled to split and exec them one by one.
	// WithInstance does not default MultiStatementMaxSize, and a zero max
	// makes every statement fail with "token too long".
	driver, err := pgx5.WithInstance(sqlDB, &pgx5.Config{
		MultiStatementEnabled: true,
		MultiStatementMaxSize: pgx5.DefaultMultiStatementMaxSize,
	})
	if err != nil {
		return fmt.Errorf("failed to init migrate driver: %w", err)
	}

	source, err := iofs.New(dbmigrations.FS, "migrations")
	if err != nil {
		return fmt.Errorf("failed to load embedded migrations: %w", err)
	}

	m, err := migrate.NewWithInstance("iofs", source, "pgx5", driver)
	if err != nil {
		return fmt.Errorf("failed to create migrator: %w", err)
	}

	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return fmt.Errorf("failed to apply migrations: %w", err)
	}
	return nil
}
