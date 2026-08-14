package queries

import (
	"context"
	"errors"
	"time"

	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

type RotateRefreshTokenTxResult struct {
	GetCredentialByUserIDRow GetCredentialByUserIDRow
	RefreshToken             RefreshToken
}

func (store *SQLStore) RotateRefreshTokenTx(ctx context.Context, arg domain.RotateRefreshTokenTxParams) (RotateRefreshTokenTxResult, error) {
	var result RotateRefreshTokenTxResult

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

		if old.ExpiresAt.Before(time.Now()) {
			return domain.ErrRefreshTokenExpired
		}

		if err := q.RevokeRefreshTokenByHash(ctx, arg.OldTokenHash); err != nil {
			return err
		}

		result.RefreshToken, err = q.CreateRefreshToken(ctx, CreateRefreshTokenParams{
			UserID:    old.UserID,
			TokenHash: arg.NewTokenHash,
			ExpiresAt: arg.NewExpiresAt,
			UserAgent: arg.UserAgent,
			Ip:        arg.Ip,
		})
		if err != nil {
			return err
		}

		result.GetCredentialByUserIDRow, err = q.GetCredentialByUserID(ctx, old.UserID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return domain.ErrCredentialNotFound
			}
			return err
		}

		if err := q.TouchUserLastActive(ctx, old.UserID); err != nil {
			return err
		}

		return nil
	})

	return result, err
}
