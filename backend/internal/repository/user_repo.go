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
	RegisterUser(context.Context, domain.RegisterUserTxParams) (db.RegisterUserTxResult, error)
	GetUserByEmailID(context.Context, string) (db.User, error)
	GetUserByID(context.Context, uuid.UUID) (db.User, error)
	GetUserProfileDetails(context.Context, uuid.UUID) (db.GetUserProfileDetailsRow, error)
}

type userRepo struct {
	store db.Store
}

func NewUserRepo(store db.Store) UserRepo {
	return &userRepo{store: store}
}

func (r *userRepo) RegisterUser(ctx context.Context, arg domain.RegisterUserTxParams) (db.RegisterUserTxResult, error) {
	result, err := r.store.RegisterUserTx(ctx, arg)
	if err != nil {
		return db.RegisterUserTxResult{}, err
	}
	return result, nil
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
