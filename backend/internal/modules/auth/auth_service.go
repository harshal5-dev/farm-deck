package auth

import (
	"context"

	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
)

type AuthService interface {
	RegisterUser(context.Context, RegisterUserRequest) error
}

type AuthServiceImpl struct {
	userRepo repository.UserRepo
}

func NewAuthService(userRepo repository.UserRepo) AuthService {
	return &AuthServiceImpl{
		userRepo: userRepo,
	}
}

func (s *AuthServiceImpl) RegisterUser(ctx context.Context, req RegisterUserRequest) error {
	_, err := s.userRepo.RegisterUser(ctx, toRegisterUserTxParams(req))
	return err
}
