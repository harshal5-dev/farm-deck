package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

// InvitationRepo is the read/write surface for user_invitations. All methods
// are safe to call from request handlers; they each wrap pgx.ErrNoRows into
// a domain-level error so callers don't import pgx directly.
type InvitationRepo interface {
	Create(ctx context.Context, arg db.CreateUserInvitationParams) (domain.UserInvitation, error)
	GetByTokenHash(ctx context.Context, tokenHash string) (domain.UserInvitation, error)
	GetByID(ctx context.Context, id uuid.UUID) (domain.UserInvitation, error)
	MarkAccepted(ctx context.Context, id uuid.UUID) (domain.UserInvitation, error)
	Revoke(ctx context.Context, id uuid.UUID) error
	RevokeOpenForUser(ctx context.Context, userID uuid.UUID) error
}

type invitationRepoImpl struct {
	store db.Store
}

func NewInvitationRepo(store db.Store) InvitationRepo {
	return &invitationRepoImpl{store: store}
}

func (r *invitationRepoImpl) Create(ctx context.Context, arg db.CreateUserInvitationParams) (domain.UserInvitation, error) {
	row, err := r.store.CreateUserInvitation(ctx, arg)
	if err != nil {
		return domain.UserInvitation{}, err
	}
	return toDomainInvitation(row), nil
}

func (r *invitationRepoImpl) GetByTokenHash(ctx context.Context, tokenHash string) (domain.UserInvitation, error) {
	row, err := r.store.GetUserInvitationByTokenHash(ctx, tokenHash)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.UserInvitation{}, domain.ErrInvitationInvalid
		}
		return domain.UserInvitation{}, err
	}
	return toDomainInvitation(row), nil
}

func (r *invitationRepoImpl) GetByID(ctx context.Context, id uuid.UUID) (domain.UserInvitation, error) {
	row, err := r.store.GetUserInvitationByID(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.UserInvitation{}, domain.ErrInvitationInvalid
		}
		return domain.UserInvitation{}, err
	}
	return toDomainInvitation(row), nil
}

func (r *invitationRepoImpl) MarkAccepted(ctx context.Context, id uuid.UUID) (domain.UserInvitation, error) {
	row, err := r.store.MarkUserInvitationAccepted(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.UserInvitation{}, domain.ErrInvitationInvalid
		}
		return domain.UserInvitation{}, err
	}
	return toDomainInvitation(row), nil
}

func (r *invitationRepoImpl) Revoke(ctx context.Context, id uuid.UUID) error {
	return r.store.RevokeUserInvitationByID(ctx, id)
}

func (r *invitationRepoImpl) RevokeOpenForUser(ctx context.Context, userID uuid.UUID) error {
	return r.store.RevokeOpenUserInvitationsByUserID(ctx, userID)
}

func toDomainInvitation(i db.UserInvitation) domain.UserInvitation {
	return domain.UserInvitation{
		ID:         i.ID,
		UserID:     i.UserID,
		TenantID:   i.TenantID,
		TokenHash:  i.TokenHash,
		ExpiresAt:  i.ExpiresAt,
		AcceptedAt: i.AcceptedAt,
		RevokedAt:  i.RevokedAt,
		CreatedBy:  i.CreatedBy,
		CreatedAt:  i.CreatedAt,
	}
}
