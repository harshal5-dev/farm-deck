package user

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
)

type UserService interface {
	UpdateUserProfile(ctx context.Context, userID uuid.UUID, req UpdateUserProfileRequest) error
	GetMyProfile(ctx context.Context, userID uuid.UUID) (UserProfileResponse, error)
}

type UserServiceImpl struct {
	userRepo repository.UserRepo
}

func NewUserService(userRepo repository.UserRepo) UserService {
	return &UserServiceImpl{
		userRepo: userRepo,
	}
}

func (s *UserServiceImpl) GetMyProfile(ctx context.Context, userID uuid.UUID) (UserProfileResponse, error) {
	user, err := s.userRepo.GetUserProfileDetails(ctx, userID)
	if err != nil {
		return UserProfileResponse{}, fmt.Errorf("get profile: %w", err)
	}
	return toUserProfileResponse(user), nil
}

func (s *UserServiceImpl) UpdateUserProfile(ctx context.Context, userID uuid.UUID, req UpdateUserProfileRequest) error {
	_, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		return fmt.Errorf("update profile: get user: %w", err)
	}

	if _, err := s.userRepo.UpdateUserProfile(ctx, toUpdateUserProfileParams(userID, req)); err != nil {
		return fmt.Errorf("update profile: update user: %w", err)
	}
	return nil
}
