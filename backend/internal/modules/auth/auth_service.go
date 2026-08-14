package auth

import (
	"context"
	"fmt"

	"strings"

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
}

type AuthServiceImpl struct {
	credentialRepo repository.CredentialRepo
	refreshRepo    repository.RefreshTokenRepo
	userRepo       repository.UserRepo
	cfg            config.Config
	emailService   email.EmailService
}

func NewAuthService(credentialRepo repository.CredentialRepo, refreshRepo repository.RefreshTokenRepo, userRepo repository.UserRepo, cfg config.Config, emailService email.EmailService) AuthService {
	return &AuthServiceImpl{
		credentialRepo: credentialRepo,
		refreshRepo:    refreshRepo,
		userRepo:       userRepo,
		cfg:            cfg,
		emailService:   emailService,
	}
}

func (s *AuthServiceImpl) RegisterUser(ctx context.Context, req RegisterUserRequest) error {
	req.EmailID = normalizeEmail(req.EmailID)

	hashedPassword, err := password.HashPassword(req.Password)
	if err != nil {
		return fmt.Errorf("register user: %w", err)
	}

	_, err = s.credentialRepo.RegisterUser(ctx, toRegisterUserTxParams(req, hashedPassword))
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
	credential, err := s.credentialRepo.GetCredentialByEmail(ctx, normalizeEmail(req.EmailID))
	if err != nil {
		return TokenPair{}, fmt.Errorf("login user: %w", err)
	}

	if err := password.VerifyPassword(credential.PasswordHash, req.Password); err != nil {
		return TokenPair{}, domain.ErrInvalidCredentials
	}

	return s.issueTokens(ctx, toJwtUserDetailsFromEmail(credential), meta)
}

func (s *AuthServiceImpl) RefreshTokens(ctx context.Context, rawRefreshToken string, meta SessionMeta) (TokenPair, error) {
	if rawRefreshToken == "" {
		return TokenPair{}, domain.ErrRefreshTokenInvalid
	}
	oldHash := hashRefreshToken(rawRefreshToken)

	newRaw, newHash, err := generateRefreshToken()
	if err != nil {
		return TokenPair{}, fmt.Errorf("refresh: generate: %w", err)
	}

	result, err := s.refreshRepo.Rotate(ctx, toRotateParams(oldHash, newHash, meta, s.cfg.RefreshTokenDuration))

	if err != nil {
		return TokenPair{}, fmt.Errorf("refresh: rotate: %w", err)
	}

	// A successful refresh means the user is active; stamp their last-active time.
	if err := s.userRepo.TouchUserLastActive(ctx, result.GetCredentialByUserIDRow.UserID); err != nil {
		return TokenPair{}, fmt.Errorf("refresh: touch last active: %w", err)
	}

	accessToken, err := s.generateAccessToken(toJwtUserDetailsFromUserID(result.GetCredentialByUserIDRow))
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
func normalizeEmail(emailID string) string {
	return strings.ToLower(strings.TrimSpace(emailID))
}

func (s *AuthServiceImpl) issueTokens(ctx context.Context, userDetails jwt.UserDetails, meta SessionMeta) (TokenPair, error) {
	accessToken, err := s.generateAccessToken(userDetails)
	if err != nil {
		return TokenPair{}, err
	}

	raw, hash, err := generateRefreshToken()
	if err != nil {
		return TokenPair{}, err
	}

	ua, ip := stringPtr(meta.UserAgent), stringPtr(meta.IP)
	if _, err := s.refreshRepo.CreateRefreshToken(ctx, toCreateRefreshTokenParams(userDetails.UserId, hash, s.cfg.RefreshTokenDuration, ua, ip)); err != nil {
		return TokenPair{}, fmt.Errorf("issue refresh: %w", err)
	}

	// A fresh login means the user is active; stamp their last-active time.
	if err := s.userRepo.TouchUserLastActive(ctx, userDetails.UserId); err != nil {
		return TokenPair{}, fmt.Errorf("issue: touch last active: %w", err)
	}

	return TokenPair{AccessToken: accessToken, RefreshToken: raw}, nil
}

func (s *AuthServiceImpl) generateAccessToken(userDetails jwt.UserDetails) (string, error) {
	return jwt.GenerateToken(
		userDetails,
		jwt.JwtConfig{
			JWTSecret:           s.cfg.JWTSecret,
			AccessTokenDuration: s.cfg.AccessTokenDuration,
			Issuer:              s.cfg.JWTIssuer,
		},
	)
}
