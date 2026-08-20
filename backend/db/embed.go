// Package dbmigrations embeds the SQL migration files so the server binary
// can apply pending migrations at startup without external files or the
// migrate CLI. The files live here next to sqlc.yaml and are the single
// source of truth shared with the Makefile migrate targets.
package dbmigrations

import "embed"

// FS holds all migration SQL files. New migrations added to db/migrations are
// picked up automatically at the next build.
//
//go:embed migrations/*.sql
var FS embed.FS
