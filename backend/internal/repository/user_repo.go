package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

type UserRepo interface {
	GetUserByEmailID(ctx context.Context, emailID string) (db.User, error)
	GetUserByID(ctx context.Context, id uuid.UUID) (db.User, error)
	GetUserProfileDetails(ctx context.Context, id uuid.UUID) (db.GetUserProfileDetailsRow, error)
	UpdateUserProfile(ctx context.Context, params db.UpdateUserProfileParams) (db.User, error)
	CreateMember(ctx context.Context, params domain.CreateMemberTxParams) (db.CreateMemberTxResult, error)
	UpdateUserStatus(ctx context.Context, id uuid.UUID, status string) (db.User, error)
	ListMembers(ctx context.Context, tenantID uuid.UUID, excludeID uuid.UUID) ([]db.User, error)
	TouchUserLastActive(ctx context.Context, id uuid.UUID) error
	UpdateMember(ctx context.Context, params db.UpdateMemberParams) (db.User, error)
	DeleteMember(ctx context.Context, id uuid.UUID) error
}

type UserRepoImpl struct {
	store db.Store
}

func NewUserRepo(store db.Store) UserRepo {
	return &UserRepoImpl{store: store}
}

func (r *UserRepoImpl) GetUserByEmailID(ctx context.Context, emailID string) (db.User, error) {
	result, err := r.store.GetUserByEmailID(ctx, emailID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.User{}, domain.ErrUserNotFound
		}
		return db.User{}, err
	}
	return result, nil
}

func (r *UserRepoImpl) GetUserByID(ctx context.Context, id uuid.UUID) (db.User, error) {
	result, err := r.store.GetUserByID(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.User{}, domain.ErrUserNotFound
		}
		return db.User{}, err
	}
	return result, nil
}

func (r *UserRepoImpl) GetUserProfileDetails(ctx context.Context, id uuid.UUID) (db.GetUserProfileDetailsRow, error) {
	result, err := r.store.GetUserProfileDetails(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.GetUserProfileDetailsRow{}, domain.ErrUserNotFound
		}
		return db.GetUserProfileDetailsRow{}, err
	}
	return result, nil
}

func (r *UserRepoImpl) UpdateUserProfile(ctx context.Context, arg db.UpdateUserProfileParams) (db.User, error) {
	result, err := r.store.UpdateUserProfile(ctx, arg)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.User{}, domain.ErrUserNotFound
		}
		return db.User{}, err
	}
	return result, nil
}

func (r *UserRepoImpl) CreateMember(ctx context.Context, params domain.CreateMemberTxParams) (db.CreateMemberTxResult, error) {
	result, err := r.store.CreateMemberTx(ctx, params)
	if err != nil {
		return db.CreateMemberTxResult{}, err
	}
	return result, nil
}

func (r *UserRepoImpl) UpdateUserStatus(ctx context.Context, id uuid.UUID, status string) (db.User, error) {
	result, err := r.store.UpdateUserStatus(ctx, db.UpdateUserStatusParams{
		ID:     id,
		Status: status,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.User{}, domain.ErrUserNotFound
		}
		return db.User{}, err
	}
	return result, nil
}

func (r *UserRepoImpl) ListMembers(ctx context.Context, tenantID uuid.UUID, excludeID uuid.UUID) ([]db.User, error) {
	result, err := r.store.ListMembers(ctx, db.ListMembersParams{
		TenantID: tenantID,
		ID:       excludeID,
		Role:     domain.UserRoleOwner,
	})
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (r *UserRepoImpl) TouchUserLastActive(ctx context.Context, id uuid.UUID) error {
	return r.store.TouchUserLastActive(ctx, id)
}

func (r *UserRepoImpl) UpdateMember(ctx context.Context, params db.UpdateMemberParams) (db.User, error) {
	result, err := r.store.UpdateMember(ctx, params)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.User{}, domain.ErrUserNotFound
		}
		return db.User{}, err
	}
	return result, nil
}

func (r *UserRepoImpl) DeleteMember(ctx context.Context, id uuid.UUID) error {
	return r.store.DeleteMemberTx(ctx, id)
}
