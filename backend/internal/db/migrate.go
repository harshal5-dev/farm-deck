package db

import (
	"context"
	"database/sql"
	"fmt"
	"io/fs"

	_ "github.com/jackc/pgx/v5/stdlib" // registers the "pgx/v5" database/sql driver
	"github.com/pressly/goose/v3"

	dbmigrations "github.com/harshal5-dev/farm-deck/backend/db"
)

// MigrateUp applies every pending migration embedded in the binary. It opens
// its own short-lived connection via pgx's stdlib driver so it can run before
// Init. The goose_db_version bookkeeping table is the same one the goose CLI
// writes, so CLI runs and server-startup runs stay interchangeable.
func MigrateUp(dbSource string) error {
	sqlDB, err := sql.Open("pgx/v5", dbSource)
	if err != nil {
		return fmt.Errorf("failed connect to database: %w", err)
	}
	defer func(sqlDB *sql.DB) {
		err := sqlDB.Close()
		if err != nil {
			fmt.Printf("failed close database connection: %v\n", err)
		}
	}(sqlDB)

	migrations, err := fs.Sub(dbmigrations.FS, "migrations")
	if err != nil {
		return fmt.Errorf("failed to load embedded migrations: %w", err)
	}

	provider, err := goose.NewProvider(goose.DialectPostgres, sqlDB, migrations)
	if err != nil {
		return fmt.Errorf("failed to create migrator: %w", err)
	}

	if err := sqlDB.Ping(); err != nil {
		return fmt.Errorf("failed ping database: %w", err)
	}

	if _, err := provider.Up(context.Background()); err != nil {
		return fmt.Errorf("failed to apply migrations: %w", err)
	}
	return nil
}
