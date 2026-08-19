package queries

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Store interface {
	Querier
	RegisterUserTx(ctx context.Context, arg domain.RegisterUserTxParams) (RegisterUserTxResult, error)
	RotateRefreshTokenTx(ctx context.Context, arg domain.RotateRefreshTokenTxParams) (RotateRefreshTokenTxResult, error)
	CreateMemberTx(ctx context.Context, arg domain.CreateMemberTxParams) (CreateMemberTxResult, error)
	CreateRefreshTokenTx(ctx context.Context, arg CreateRefreshTokenParams) (RefreshToken, error)
	AcceptInvitationTx(ctx context.Context, arg domain.AcceptInvitationTxParams) (AcceptInvitationTxResult, error)
	DeleteMemberTx(ctx context.Context, id uuid.UUID) error
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

func (store *SQLStore) Close() {
	store.connPool.Close()
}

func (store *SQLStore) execTx(ctx context.Context, fn func(*Queries) error) error {
	tx, err := store.connPool.Begin(ctx)
	if err != nil {
		return err
	}

	q := New(tx)

	if err := fn(q); err != nil {
		if rbErr := tx.Rollback(ctx); rbErr != nil {
			return fmt.Errorf("tx err: %v, rollback err: %v", err, rbErr)
		}
		return err
	}

	return tx.Commit(ctx)
}
