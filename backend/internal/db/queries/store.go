package queries

import (
	"github.com/jackc/pgx/v5/pgxpool"
)

type Store interface {
	Querier
	Close()
}

type SQLStore struct {
	connPool *pgxpool.Pool
	*Queries
}

func NewStore(connPool *pgxpool.Pool) Store {
	return &SQLStore{
		connPool: connPool,
		Queries:  New(connPool),
	}
}

func (s *SQLStore) Close() {
	s.connPool.Close()
}
