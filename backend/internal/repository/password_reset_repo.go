package repository

import db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"

type PasswordResetRepo interface {
}

type PasswordResetRepoImpl struct {
	store db.Store
}

func NewPasswordResetRepo(store db.Store) PasswordResetRepo {
	return &PasswordResetRepoImpl{store: store}
}
