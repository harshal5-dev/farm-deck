package repository

import (
	"context"
	"errors"

	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

type InvitationRepo interface {
	AcceptInvitation(ctx context.Context, arg domain.AcceptInvitationTxParams) (db.AcceptInvitationTxResult, error)
	VerifyInvitation(ctx context.Context, tokenHash string) (db.GetInvitationDetailsByTokenHashRow, error)
}

type invitationRepoImpl struct {
	store db.Store
}

func NewInvitationRepo(store db.Store) InvitationRepo {
	return &invitationRepoImpl{store: store}
}

func (r *invitationRepoImpl) AcceptInvitation(ctx context.Context, arg domain.AcceptInvitationTxParams) (db.AcceptInvitationTxResult, error) {
	return r.store.AcceptInvitationTx(ctx, arg)
}

func (r *invitationRepoImpl) VerifyInvitation(ctx context.Context, tokenHash string) (db.GetInvitationDetailsByTokenHashRow, error) {
	row, err := r.store.GetInvitationDetailsByTokenHash(ctx, tokenHash)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.GetInvitationDetailsByTokenHashRow{}, domain.ErrInvitationInvalid
		}
		return db.GetInvitationDetailsByTokenHashRow{}, err
	}
	return row, nil
}
