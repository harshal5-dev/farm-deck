package repository

import (
	"context"

	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
)

type RefreshTokenRepo interface {
	CreateRefreshToken(ctx context.Context, arg db.CreateRefreshTokenParams) (db.RefreshToken, error)
	GetByHash(ctx context.Context, tokenHash string) (db.RefreshToken, error)
	RevokeByHash(ctx context.Context, tokenHash string) error
	Rotate(ctx context.Context, arg db.RotateRefreshTokenTxParams) (db.RefreshToken, error)
}

type RefreshTokenRepoImpl struct {
	store db.Store
}

func NewRefreshTokenRepo(store db.Store) RefreshTokenRepo {
	return &RefreshTokenRepoImpl{store: store}
}

func (r *RefreshTokenRepoImpl) CreateRefreshToken(ctx context.Context, arg db.CreateRefreshTokenParams) (db.RefreshToken, error) {
	return r.store.CreateRefreshToken(ctx, arg)
}

func (r *RefreshTokenRepoImpl) GetByHash(ctx context.Context, tokenHash string) (db.RefreshToken, error) {
	return r.store.GetRefreshTokenByHash(ctx, tokenHash)
}

func (r *RefreshTokenRepoImpl) RevokeByHash(ctx context.Context, tokenHash string) error {
	return r.store.RevokeRefreshTokenByHash(ctx, tokenHash)
}

func (r *RefreshTokenRepoImpl) Rotate(ctx context.Context, arg db.RotateRefreshTokenTxParams) (db.RefreshToken, error) {
	return r.store.RotateRefreshTokenTx(ctx, arg)
}
