package repository

import (
	"context"
	"errors"

	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

type CredentialRepo interface {
	RegisterUser(ctx context.Context, params domain.RegisterUserTxParams) (db.RegisterUserTxResult, error)
	GetCredentialByEmail(ctx context.Context, emailID string) (db.GetCredentialByEmailRow, error)
}

type credentialRepoImpl struct {
	store db.Store
}

func NewCredentialRepo(store db.Store) CredentialRepo {
	return &credentialRepoImpl{store: store}
}

func (r *credentialRepoImpl) RegisterUser(ctx context.Context, params domain.RegisterUserTxParams) (db.RegisterUserTxResult, error) {
	result, err := r.store.RegisterUserTx(ctx, params)
	if err != nil {
		return db.RegisterUserTxResult{}, err
	}
	return result, nil
}

func (r *credentialRepoImpl) GetCredentialByEmail(ctx context.Context, emailID string) (db.GetCredentialByEmailRow, error) {
	result, err := r.store.GetCredentialByEmail(ctx, emailID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.GetCredentialByEmailRow{}, domain.ErrCredentialNotFound
		}
		return db.GetCredentialByEmailRow{}, err
	}
	return result, nil
}
