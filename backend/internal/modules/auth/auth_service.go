package auth

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/email"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
	"github.com/harshal5-dev/farm-deck/backend/pkg/jwt"
	"github.com/harshal5-dev/farm-deck/backend/pkg/password"
)

type AuthService interface {
	RegisterUser(ctx context.Context, req RegisterUserRequest) error
	LoginUser(ctx context.Context, req LoginRequest, meta SessionMeta) (TokenPair, error)
	RefreshTokens(ctx context.Context, rawRefreshToken string, meta SessionMeta) (TokenPair, error)
	Logout(ctx context.Context, rawRefreshToken string) error
	GetMyProfile(ctx context.Context, userID uuid.UUID) (UserProfileResponse, error)
}

type AuthServiceImpl struct {
	userRepo     repository.UserRepo
	refreshRepo  repository.RefreshTokenRepo
	cfg          config.Config
	emailService email.EmailService
}

func NewAuthService(userRepo repository.UserRepo, refreshRepo repository.RefreshTokenRepo, cfg config.Config, emailService email.EmailService) AuthService {
	return &AuthServiceImpl{
		userRepo:     userRepo,
		refreshRepo:  refreshRepo,
		cfg:          cfg,
		emailService: emailService,
	}
}

func (s *AuthServiceImpl) RegisterUser(ctx context.Context, req RegisterUserRequest) error {
	req.EmailID = normalizeEmail(req.EmailID)

	hashedPassword, err := password.HashPassword(req.Password)
	if err != nil {
		return fmt.Errorf("register user: %w", err)
	}
	req.Password = hashedPassword
	_, err = s.userRepo.RegisterUser(ctx, toRegisterUserTxParams(req))
	if err != nil {
		return fmt.Errorf("register user: %w", err)
	}

	err = s.emailService.SendWelcomeEmail(req.EmailID, req.FullName)
	if err != nil {
		return fmt.Errorf("register user: %w", err)
	}
	return nil
}

func (s *AuthServiceImpl) LoginUser(ctx context.Context, req LoginRequest, meta SessionMeta) (TokenPair, error) {
	user, err := s.userRepo.GetUserByEmailID(ctx, normalizeEmail(req.EmailID))
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			return TokenPair{}, domain.ErrInvalidCredentials
		}
		return TokenPair{}, fmt.Errorf("login user: %w", err)
	}

	if err := password.VerifyPassword(user.PasswordHash, req.Password); err != nil {
		return TokenPair{}, domain.ErrInvalidCredentials
	}

	return s.issueTokens(ctx, user, meta)
}

func (s *AuthServiceImpl) GetMyProfile(ctx context.Context, userID uuid.UUID) (UserProfileResponse, error) {
	user, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		return UserProfileResponse{}, fmt.Errorf("get profile: %w", err)
	}
	return toUserProfileResponse(user), nil
}

func normalizeEmail(emailID string) string {
	return strings.ToLower(strings.TrimSpace(emailID))
}

func (s *AuthServiceImpl) RefreshTokens(ctx context.Context, rawRefreshToken string, meta SessionMeta) (TokenPair, error) {
	if rawRefreshToken == "" {
		return TokenPair{}, domain.ErrRefreshTokenInvalid
	}
	oldHash := hashRefreshToken(rawRefreshToken)

	old, err := s.refreshRepo.GetByHash(ctx, oldHash)
	if err != nil {
		if errors.Is(err, pgxNoRows(err)) {
			return TokenPair{}, domain.ErrRefreshTokenInvalid
		}
		return TokenPair{}, fmt.Errorf("refresh: lookup: %w", err)
	}
	if old.RevokedAt != nil {
		return TokenPair{}, domain.ErrRefreshTokenInvalid
	}
	if old.ExpiresAt.Before(time.Now()) {
		return TokenPair{}, domain.ErrRefreshTokenExpired
	}

	newRaw, newHash, err := generateRefreshToken()
	if err != nil {
		return TokenPair{}, fmt.Errorf("refresh: generate: %w", err)
	}

	if _, err := s.refreshRepo.Rotate(ctx, toRotateParams(old, newHash, meta, s.cfg.RefreshTokenDuration)); err != nil {
		return TokenPair{}, fmt.Errorf("refresh: rotate: %w", err)
	}

	accessToken, err := s.generateAccessToken(userFromRefresh(old))
	if err != nil {
		return TokenPair{}, fmt.Errorf("refresh: access token: %w", err)
	}
	return TokenPair{AccessToken: accessToken, RefreshToken: newRaw}, nil
}

func (s *AuthServiceImpl) Logout(ctx context.Context, rawRefreshToken string) error {
	if rawRefreshToken == "" {
		return nil
	}
	hash := hashRefreshToken(rawRefreshToken)
	if err := s.refreshRepo.RevokeByHash(ctx, hash); err != nil {
		return fmt.Errorf("logout: revoke: %w", err)
	}
	return nil
}

// ---- internal helpers ----

func (s *AuthServiceImpl) issueTokens(ctx context.Context, user dbUser, meta SessionMeta) (TokenPair, error) {
	accessToken, err := s.generateAccessToken(user)
	if err != nil {
		return TokenPair{}, err
	}

	raw, hash, err := generateRefreshToken()
	if err != nil {
		return TokenPair{}, err
	}

	ua, ip := stringPtr(meta.UserAgent), stringPtr(meta.IP)
	if _, err := s.refreshRepo.CreateRefreshToken(ctx, dbCreateRefreshTokenParams(user.ID, hash, s.cfg.RefreshTokenDuration, ua, ip)); err != nil {
		return TokenPair{}, fmt.Errorf("issue refresh: %w", err)
	}

	return TokenPair{AccessToken: accessToken, RefreshToken: raw}, nil
}

func (s *AuthServiceImpl) generateAccessToken(user dbUser) (string, error) {
	return jwt.GenerateToken(
		jwt.UserDetails{UserId: user.ID, TenantId: user.TenantID},
		jwt.JwtConfig{
			JWTSecret:           s.cfg.JWTSecret,
			AccessTokenDuration: s.cfg.AccessTokenDuration,
			Issuer:              s.cfg.JWTIssuer,
		},
	)
}

func stringPtr(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}
