package repository

import (
	"context"

	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

type UserRepo interface {
	RegisterUser(context.Context, domain.RegisterUserTxParams) (db.RegisterUserTxResult, error)
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
