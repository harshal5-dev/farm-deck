package auth

import (
	"context"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/email"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
	"github.com/harshal5-dev/farm-deck/backend/pkg/jwt"
	"github.com/harshal5-dev/farm-deck/backend/pkg/password"
)

type AuthService interface {
	RegisterUser(context.Context, RegisterUserRequest) error
	LoginUser(context.Context, LoginRequest) (LoginResponse, error)
	GetMyProfile(context.Context, uuid.UUID) (UserProfileResponse, error)
}

type AuthServiceImpl struct {
	userRepo     repository.UserRepo
	cfg          config.Config
	emailService email.EmailService
}

func NewAuthService(userRepo repository.UserRepo, cfg config.Config, emailService email.EmailService) AuthService {
	return &AuthServiceImpl{
		userRepo:     userRepo,
		cfg:          cfg,
		emailService: emailService,
	}
}

func (s *AuthServiceImpl) RegisterUser(ctx context.Context, req RegisterUserRequest) error {
	hashedPassword, err := password.HashPassword(req.Password)
	if err != nil {
		return err
	}
	req.Password = hashedPassword
	_, err = s.userRepo.RegisterUser(ctx, toRegisterUserTxParams(req))
	if err != nil {
		return err
	}

	err = s.emailService.SendWelcomeEmail(req.EmailID, req.FullName)
	if err != nil {
		return err
	}
	return nil
}

func (s *AuthServiceImpl) LoginUser(ctx context.Context, req LoginRequest) (LoginResponse, error) {
	user, err := s.userRepo.GetUserByEmailID(ctx, req.EmailID)
	if err != nil {
		return LoginResponse{}, err
	}
	if err := password.VerifyPassword(user.PasswordHash, req.Password); err != nil {
		return LoginResponse{}, err
	}
	userDetails := jwt.UserDetails{UserId: user.ID, TenantId: user.TenantID}
	jwtCfg := jwt.JwtConfig{
		JWTSecret:           s.cfg.JWTSecret,
		AccessTokenDuration: s.cfg.AccessTokenDuration,
		Issuer:              s.cfg.JWTIssuer,
	}
	token, err := jwt.GenerateToken(userDetails, jwtCfg)
	if err != nil {
		return LoginResponse{}, err
	}
	return LoginResponse{Token: token}, nil
}

func (s *AuthServiceImpl) GetMyProfile(ctx context.Context, userID uuid.UUID) (UserProfileResponse, error) {
	user, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		return UserProfileResponse{}, err
	}
	return toUserProfileResponse(user), nil
}
