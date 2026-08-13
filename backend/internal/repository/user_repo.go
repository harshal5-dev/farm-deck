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
	CreateMember(ctx context.Context, params domain.CreateMemberTxParams) (db.User, error)
}

type userRepo struct {
	store db.Store
}

func NewUserRepo(store db.Store) UserRepo {
	return &userRepo{store: store}
}

func (r *userRepo) GetUserByEmailID(ctx context.Context, emailID string) (db.User, error) {
	result, err := r.store.GetUserByEmailID(ctx, emailID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.User{}, domain.ErrUserNotFound
		}
		return db.User{}, err
	}
	return result, nil
}

func (r *userRepo) GetUserByID(ctx context.Context, id uuid.UUID) (db.User, error) {
	result, err := r.store.GetUserByID(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.User{}, domain.ErrUserNotFound
		}
		return db.User{}, err
	}
	return result, nil
}

func (r *userRepo) GetUserProfileDetails(ctx context.Context, id uuid.UUID) (db.GetUserProfileDetailsRow, error) {
	result, err := r.store.GetUserProfileDetails(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.GetUserProfileDetailsRow{}, domain.ErrUserNotFound
		}
		return db.GetUserProfileDetailsRow{}, err
	}
	return result, nil
}

func (r *userRepo) UpdateUserProfile(ctx context.Context, arg db.UpdateUserProfileParams) (db.User, error) {
	result, err := r.store.UpdateUserProfile(ctx, arg)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.User{}, domain.ErrUserNotFound
		}
		return db.User{}, err
	}
	return result, nil
}

func (r *userRepo) CreateMember(ctx context.Context, params domain.CreateMemberTxParams) (db.User, error) {
	result, err := r.store.CreateMemberTx(ctx, params)
	if err != nil {
		return db.User{}, err
	}
	return result, nil
}
