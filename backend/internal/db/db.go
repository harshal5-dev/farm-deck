package db

import (
	"context"
	"fmt"

	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Init(dbSource string) (store db.Store, err error) {
	ctx := context.Background()
	connPool, err := pgxpool.New(ctx, dbSource)
	if err != nil {
		return nil, fmt.Errorf("Failed connect to database: %w", err)
	}

	if err := connPool.Ping(ctx); err != nil {
		connPool.Close()
		return nil, fmt.Errorf("Failed ping database: %w", err)
	}

	return db.NewStore(connPool), nil
}
