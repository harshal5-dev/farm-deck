package queries

import (
	"context"
	"errors"
	"time"

	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

type AcceptInvitationTxResult struct {
	User       User
	Invitation UserInvitation
}

func (store *SQLStore) AcceptInvitationTx(ctx context.Context, arg domain.AcceptInvitationTxParams) (AcceptInvitationTxResult, error) {
	var result AcceptInvitationTxResult

	err := store.execTx(ctx, func(q *Queries) error {
		inv, err := q.GetUserInvitationByTokenHash(ctx, arg.TokenHash)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return domain.ErrInvitationInvalid
			}
			return err
		}

		if inv.AcceptedAt != nil {
			return domain.ErrInvitationAccepted
		}
		if inv.RevokedAt != nil {
			return domain.ErrInvitationRevoked
		}
		if time.Now().After(inv.ExpiresAt) {
			return domain.ErrInvitationExpired
		}

		user, err := q.GetUserByID(ctx, inv.UserID)
		if err != nil {
			return err
		}
		if _, err := q.CreateCredential(ctx, CreateCredentialParams{
			UserID: user.ID, EmailID: user.EmailID, PasswordHash: arg.PasswordHash,
		}); err != nil {
			return err
		}

		if _, err := q.UpdateUserStatus(ctx, UpdateUserStatusParams{
			ID: user.ID, Status: domain.UserStatusActive,
		}); err != nil {
			return err
		}

		result.Invitation, err = q.MarkUserInvitationAccepted(ctx, inv.ID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return domain.ErrInvitationAccepted // lost the race
			}
			return err
		}

		result.User = user
		return nil

	})

	return result, err
}
