package user

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
	"github.com/harshal5-dev/farm-deck/backend/pkg/password"
)

type UserService interface {
	UpdateUserProfile(ctx context.Context, userID uuid.UUID, req UpdateUserProfileRequest) error
	GetMyProfile(ctx context.Context, userID uuid.UUID) (UserProfileResponse, error)
	CreateMember(ctx context.Context, tenantID uuid.UUID, req CreateMemberRequest) error
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

func (s *UserServiceImpl) CreateMember(ctx context.Context, tenantID uuid.UUID, req CreateMemberRequest) error {
	if err := checkRole(req.Role); err != nil {
		return fmt.Errorf("create member: %w", err)
	}
	passwordHash, err := getPasswordHash()
	if err != nil {
		return fmt.Errorf("create member: %w", err)
	}

	_, err = s.userRepo.CreateMember(ctx, toCreateMemberTxParams(tenantID, passwordHash, req))
	if err != nil {
		return fmt.Errorf("create member: %w", err)
	}
	return nil
}

// ---------------- Private Functions ------------------

func checkRole(role string) error {
	if role != domain.UserRoleGrower && role != domain.UserRoleManager && role != domain.UserRoleViewer {
		return fmt.Errorf("invalid role: %s", role)
	}
	return nil
}

func getPasswordHash() (string, error) {
	pass, err := password.GeneratePIN(8)
	if err != nil {
		return "", fmt.Errorf("create member: generate pin: %w", err)
	}
	passwordHash, err := password.HashPassword(pass)
	if err != nil {
		return "", fmt.Errorf("create member: hash password: %w", err)
	}
	return passwordHash, nil
}
