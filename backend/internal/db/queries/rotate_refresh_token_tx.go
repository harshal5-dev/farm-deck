package queries

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

type RotateRefreshTokenTxParams struct {
	OldTokenHash string
	NewTokenHash string
	UserAgent    *string
	Ip           *string
	NewExpiresAt time.Time
	UserID       uuid.UUID
}

func (store *SQLStore) RotateRefreshTokenTx(ctx context.Context, arg RotateRefreshTokenTxParams) (RefreshToken, error) {
	var result RefreshToken

	err := store.execTx(ctx, func(q *Queries) error {
		old, err := q.GetRefreshTokenByHash(ctx, arg.OldTokenHash)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return domain.ErrRefreshTokenInvalid
			}
			return err
		}

		if old.RevokedAt != nil {
			return domain.ErrRefreshTokenInvalid
		}

		if err := q.RevokeRefreshTokenByHash(ctx, arg.OldTokenHash); err != nil {
			return err
		}

		result, err = q.CreateRefreshToken(ctx, CreateRefreshTokenParams{
			UserID:    arg.UserID,
			TokenHash: arg.NewTokenHash,
			ExpiresAt: arg.NewExpiresAt,
			UserAgent: arg.UserAgent,
			Ip:        arg.Ip,
		})
		return err
	})

	return result, err
}
