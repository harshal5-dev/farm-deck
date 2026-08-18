package auth

import (
	"context"
	"testing"
	"time"

	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/pkg/password"
)

// ---- repository.EmailService / credential / refresh fakes ----

type fakeCredentialRepo struct {
	registerUser         func(context.Context, domain.RegisterUserTxParams) (db.RegisterUserTxResult, error)
	getCredentialByEmail func(context.Context, string) (db.GetCredentialByEmailRow, error)
}

func (f *fakeCredentialRepo) RegisterUser(ctx context.Context, p domain.RegisterUserTxParams) (db.RegisterUserTxResult, error) {
	return f.registerUser(ctx, p)
}

func (f *fakeCredentialRepo) GetCredentialByEmail(ctx context.Context, email string) (db.GetCredentialByEmailRow, error) {
	return f.getCredentialByEmail(ctx, email)
}

type fakeRefreshRepo struct {
	createRefreshToken func(context.Context, db.CreateRefreshTokenParams) (db.RefreshToken, error)
	getByHash          func(context.Context, string) (db.RefreshToken, error)
	revokeByHash       func(context.Context, string) error
	rotate             func(context.Context, domain.RotateRefreshTokenTxParams) (db.RotateRefreshTokenTxResult, error)
}

func (f *fakeRefreshRepo) CreateRefreshToken(ctx context.Context, p db.CreateRefreshTokenParams) (db.RefreshToken, error) {
	return f.createRefreshToken(ctx, p)
}
func (f *fakeRefreshRepo) GetByHash(ctx context.Context, hash string) (db.RefreshToken, error) {
	return f.getByHash(ctx, hash)
}
func (f *fakeRefreshRepo) RevokeByHash(ctx context.Context, hash string) error {
	return f.revokeByHash(ctx, hash)
}
func (f *fakeRefreshRepo) Rotate(ctx context.Context, p domain.RotateRefreshTokenTxParams) (db.RotateRefreshTokenTxResult, error) {
	return f.rotate(ctx, p)
}

type fakeEmailService struct {
	sendWelcome    func(to, name string) error
	sendInvitation func(to, name, tenantName, acceptURL string) error
}

func (f *fakeEmailService) SendWelcomeEmail(to, name string) error { return f.sendWelcome(to, name) }
func (f *fakeEmailService) SendInvitationEmail(to, name, tenantName, acceptURL string) error {
	if f.sendInvitation == nil {
		return nil
	}
	return f.sendInvitation(to, name, tenantName, acceptURL)
}

type fakeInvitationRepo struct {
	verifyInvitation func(context.Context, string) (db.GetInvitationDetailsByTokenHashRow, error)
	acceptInvitation func(context.Context, domain.AcceptInvitationTxParams) (db.AcceptInvitationTxResult, error)
}

func (f *fakeInvitationRepo) VerifyInvitation(ctx context.Context, tokenHash string) (db.GetInvitationDetailsByTokenHashRow, error) {
	return f.verifyInvitation(ctx, tokenHash)
}

func (f *fakeInvitationRepo) AcceptInvitation(ctx context.Context, p domain.AcceptInvitationTxParams) (db.AcceptInvitationTxResult, error) {
	return f.acceptInvitation(ctx, p)
}

// noopInvitationRepo returns a fakeInvitationRepo whose methods always succeed
// with zero values; tests override the func they exercise.
func noopInvitationRepo() *fakeInvitationRepo {
	return &fakeInvitationRepo{
		verifyInvitation: func(context.Context, string) (db.GetInvitationDetailsByTokenHashRow, error) {
			return db.GetInvitationDetailsByTokenHashRow{}, nil
		},
		acceptInvitation: func(context.Context, domain.AcceptInvitationTxParams) (db.AcceptInvitationTxResult, error) {
			return db.AcceptInvitationTxResult{}, nil
		},
	}
}

// ---- handler-level fake (mocks AuthService) ----

type fakeAuthService struct {
	registerUser      func(context.Context, RegisterUserRequest) error
	loginUser         func(context.Context, LoginRequest, SessionMeta) (TokenPair, error)
	refreshTokens     func(context.Context, string, SessionMeta) (TokenPair, error)
	isAuthenticated   func(context.Context, string) (bool, error)
	verifyInvitation  func(context.Context, string) (VerifyInvitationResponse, error)
	acceptInvitation  func(context.Context, AcceptInvitationRequest, SessionMeta) (TokenPair, error)
	logout            func(context.Context, string) error
	registerCalls     int
	loginCalls        int
	refreshCalls      int
	logoutCalls       int
	verifyInviteCalls int
	acceptInviteCalls int
}

func (f *fakeAuthService) RegisterUser(ctx context.Context, r RegisterUserRequest) error {
	f.registerCalls++
	return f.registerUser(ctx, r)
}
func (f *fakeAuthService) LoginUser(ctx context.Context, r LoginRequest, m SessionMeta) (TokenPair, error) {
	f.loginCalls++
	return f.loginUser(ctx, r, m)
}
func (f *fakeAuthService) RefreshTokens(ctx context.Context, raw string, m SessionMeta) (TokenPair, error) {
	f.refreshCalls++
	return f.refreshTokens(ctx, raw, m)
}
func (f *fakeAuthService) IsAuthenticated(ctx context.Context, token string) (bool, error) {
	return f.isAuthenticated(ctx, token)
}
func (f *fakeAuthService) VerifyInvitation(ctx context.Context, rawToken string) (VerifyInvitationResponse, error) {
	f.verifyInviteCalls++
	return f.verifyInvitation(ctx, rawToken)
}
func (f *fakeAuthService) AcceptInvitation(ctx context.Context, r AcceptInvitationRequest, m SessionMeta) (TokenPair, error) {
	f.acceptInviteCalls++
	return f.acceptInvitation(ctx, r, m)
}
func (f *fakeAuthService) Logout(ctx context.Context, raw string) error {
	f.logoutCalls++
	return f.logout(ctx, raw)
}

// ---- shared helpers ----

func testServiceCfg() config.Config {
	return config.Config{
		JWTSecret:            "test-secret",
		JWTIssuer:            "test-issuer",
		AccessTokenDuration:  time.Hour,
		RefreshTokenDuration: 720 * time.Hour,
	}
}

// mustHash hashes a password for test fixtures using the real bcrypt helper.
func mustHash(t testing.TB, plain string) string {
	t.Helper()
	h, err := password.HashPassword(plain)
	if err != nil {
		t.Fatalf("hash password: %v", err)
	}
	return h
}
