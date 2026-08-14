package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

type InvitationRepo interface {
	Create(ctx context.Context, arg db.CreateUserInvitationParams) (db.UserInvitation, error)
	GetByTokenHash(ctx context.Context, tokenHash string) (db.UserInvitation, error)
	GetByID(ctx context.Context, id uuid.UUID) (db.UserInvitation, error)
	MarkAccepted(ctx context.Context, id uuid.UUID) (db.UserInvitation, error)
	Revoke(ctx context.Context, id uuid.UUID) error
	RevokeOpenForUser(ctx context.Context, userID uuid.UUID) error
}

type invitationRepoImpl struct {
	store db.Store
}

func NewInvitationRepo(store db.Store) InvitationRepo {
	return &invitationRepoImpl{store: store}
}

func (r *invitationRepoImpl) Create(ctx context.Context, arg db.CreateUserInvitationParams) (db.UserInvitation, error) {
	row, err := r.store.CreateUserInvitation(ctx, arg)
	if err != nil {
		return db.UserInvitation{}, err
	}
	return row, nil
}

func (r *invitationRepoImpl) GetByTokenHash(ctx context.Context, tokenHash string) (db.UserInvitation, error) {
	row, err := r.store.GetUserInvitationByTokenHash(ctx, tokenHash)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.UserInvitation{}, domain.ErrInvitationInvalid
		}
		return db.UserInvitation{}, err
	}
	return row, nil
}

func (r *invitationRepoImpl) GetByID(ctx context.Context, id uuid.UUID) (db.UserInvitation, error) {
	row, err := r.store.GetUserInvitationByID(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.UserInvitation{}, domain.ErrInvitationInvalid
		}
		return db.UserInvitation{}, err
	}
	return row, nil
}

func (r *invitationRepoImpl) MarkAccepted(ctx context.Context, id uuid.UUID) (db.UserInvitation, error) {
	row, err := r.store.MarkUserInvitationAccepted(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.UserInvitation{}, domain.ErrInvitationInvalid
		}
		return db.UserInvitation{}, err
	}
	return row, nil
}

func (r *invitationRepoImpl) Revoke(ctx context.Context, id uuid.UUID) error {
	return r.store.RevokeUserInvitationByID(ctx, id)
}

func (r *invitationRepoImpl) RevokeOpenForUser(ctx context.Context, userID uuid.UUID) error {
	return r.store.RevokeOpenUserInvitationsByUserID(ctx, userID)
}
