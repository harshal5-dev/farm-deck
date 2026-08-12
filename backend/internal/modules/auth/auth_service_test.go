package auth

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/pkg/jwt"
	"github.com/harshal5-dev/farm-deck/backend/pkg/password"
)

func TestAuthService_RegisterUser_Success(t *testing.T) {
	ctx := context.Background()

	var gotParams domain.RegisterUserTxParams
	credRepo := &fakeCredentialRepo{
		registerUser: func(_ context.Context, p domain.RegisterUserTxParams) (db.RegisterUserTxResult, error) {
			gotParams = p
			return db.RegisterUserTxResult{}, nil
		},
	}
	var emailTo, emailName string
	emailSvc := &fakeEmailService{sendWelcome: func(to, name string) error {
		emailTo, emailName = to, name
		return nil
	}}

	svc := NewAuthService(credRepo, &fakeRefreshRepo{}, testServiceCfg(), emailSvc)

	err := svc.RegisterUser(ctx, RegisterUserRequest{
		FullName:   "Alice",
		EmailID:    "  Alice@FarmDeck.App  ", // normalizes to lowercase, trimmed
		Password:   "supersecret",
		TenantName: "Alice's Farm",
	})
	if err != nil {
		t.Fatalf("RegisterUser: %v", err)
	}

	// Email is normalized before being used for the credential and the email.
	if gotParams.UserInfo.EmailID != "alice@farmdeck.app" {
		t.Errorf("UserInfo.EmailID = %q, want normalized", gotParams.UserInfo.EmailID)
	}
	if gotParams.Credential.EmailID != "alice@farmdeck.app" {
		t.Errorf("Credential.EmailID = %q", gotParams.Credential.EmailID)
	}
	if gotParams.Credential.PasswordHash == "supersecret" {
		t.Error("password should be hashed, not stored as plaintext")
	}
	if err := password.VerifyPassword(gotParams.Credential.PasswordHash, "supersecret"); err != nil {
		t.Errorf("hashed password did not verify against plaintext: %v", err)
	}
	if emailTo != "alice@farmdeck.app" || emailName != "Alice" {
		t.Errorf("welcome email sent to=%q name=%q", emailTo, emailName)
	}
}

func TestAuthService_RegisterUser_RepoErrorSuppressesEmail(t *testing.T) {
	emailCalled := false
	credRepo := &fakeCredentialRepo{
		registerUser: func(context.Context, domain.RegisterUserTxParams) (db.RegisterUserTxResult, error) {
			return db.RegisterUserTxResult{}, domain.ErrUserExists
		},
	}
	emailSvc := &fakeEmailService{sendWelcome: func(string, string) error {
		emailCalled = true
		return nil
	}}
	svc := NewAuthService(credRepo, &fakeRefreshRepo{}, testServiceCfg(), emailSvc)

	err := svc.RegisterUser(context.Background(), RegisterUserRequest{
		FullName: "Alice", EmailID: "a@b.com", Password: "supersecret", TenantName: "Acme",
	})
	if !errors.Is(err, domain.ErrUserExists) {
		t.Fatalf("expected ErrUserExists to propagate, got %v", err)
	}
	if emailCalled {
		t.Error("welcome email must not be sent when registration fails")
	}
}

func TestAuthService_RegisterUser_EmailErrorPropagates(t *testing.T) {
	credRepo := &fakeCredentialRepo{
		registerUser: func(context.Context, domain.RegisterUserTxParams) (db.RegisterUserTxResult, error) {
			return db.RegisterUserTxResult{}, nil
		},
	}
	emailSvc := &fakeEmailService{sendWelcome: func(string, string) error {
		return errors.New("smtp down")
	}}
	svc := NewAuthService(credRepo, &fakeRefreshRepo{}, testServiceCfg(), emailSvc)

	if err := svc.RegisterUser(context.Background(), RegisterUserRequest{
		FullName: "Alice", EmailID: "a@b.com", Password: "supersecret", TenantName: "Acme",
	}); err == nil {
		t.Fatal("expected the email error to propagate, got nil")
	}
}

func TestAuthService_LoginUser_Success(t *testing.T) {
	ctx := context.Background()
	uid := uuid.MustParse("11111111-1111-1111-1111-111111111111")
	tid := uuid.MustParse("22222222-2222-2222-2222-222222222222")
	hash := mustHash(t, "secret123")

	var createParams db.CreateRefreshTokenParams
	credRepo := &fakeCredentialRepo{
		getCredentialByEmail: func(_ context.Context, email string) (db.GetCredentialByEmailRow, error) {
			if email != "alice@farmdeck.app" {
				t.Errorf("GetCredentialByEmail called with %q (not normalized)", email)
			}
			return db.GetCredentialByEmailRow{
				UserID: uid, TenantID: tid, Role: domain.UserRoleOwner,
				PasswordHash: hash, FullName: "Alice", EmailID: "alice@farmdeck.app",
			}, nil
		},
	}
	refreshRepo := &fakeRefreshRepo{
		createRefreshToken: func(_ context.Context, p db.CreateRefreshTokenParams) (db.RefreshToken, error) {
			createParams = p
			return db.RefreshToken{}, nil
		},
	}
	svc := NewAuthService(credRepo, refreshRepo, testServiceCfg(), &fakeEmailService{})

	pair, err := svc.LoginUser(ctx, LoginRequest{
		EmailID:  "ALICE@FarmDeck.App", // normalized internally
		Password: "secret123",
	}, SessionMeta{UserAgent: "Mozilla", IP: "1.2.3.4"})
	if err != nil {
		t.Fatalf("LoginUser: %v", err)
	}
	if pair.AccessToken == "" || pair.RefreshToken == "" {
		t.Fatalf("expected both tokens, got %+v", pair)
	}

	// The access token must verify under the configured secret and carry the
	// logged-in user's claims.
	claims, err := jwt.VerifyToken(pair.AccessToken, "test-secret")
	if err != nil {
		t.Fatalf("access token did not verify: %v", err)
	}
	if claims.UserId != uid || claims.TenantId != tid || claims.Role != domain.UserRoleOwner {
		t.Errorf("access token claims = %+v", claims)
	}

	// The refresh token must be persisted against the user.
	if createParams.UserID != uid {
		t.Errorf("CreateRefreshToken UserID = %v, want %v", createParams.UserID, uid)
	}
}

func TestAuthService_LoginUser_WrongPasswordReturnsInvalidCredentials(t *testing.T) {
	credRepo := &fakeCredentialRepo{
		getCredentialByEmail: func(context.Context, string) (db.GetCredentialByEmailRow, error) {
			return db.GetCredentialByEmailRow{PasswordHash: mustHash(t, "correct-password")}, nil
		},
	}
	createCalled := false
	refreshRepo := &fakeRefreshRepo{
		createRefreshToken: func(context.Context, db.CreateRefreshTokenParams) (db.RefreshToken, error) {
			createCalled = true
			return db.RefreshToken{}, nil
		},
	}
	svc := NewAuthService(credRepo, refreshRepo, testServiceCfg(), &fakeEmailService{})

	_, err := svc.LoginUser(context.Background(), LoginRequest{EmailID: "a@b.com", Password: "wrong"}, SessionMeta{})
	if !errors.Is(err, domain.ErrInvalidCredentials) {
		t.Fatalf("expected ErrInvalidCredentials, got %v", err)
	}
	if createCalled {
		t.Error("no refresh token should be issued on a failed login")
	}
}

func TestAuthService_LoginUser_CredentialLookupErrorPropagates(t *testing.T) {
	credRepo := &fakeCredentialRepo{
		getCredentialByEmail: func(context.Context, string) (db.GetCredentialByEmailRow, error) {
			return db.GetCredentialByEmailRow{}, domain.ErrCredentialNotFound
		},
	}
	svc := NewAuthService(credRepo, &fakeRefreshRepo{}, testServiceCfg(), &fakeEmailService{})

	_, err := svc.LoginUser(context.Background(), LoginRequest{EmailID: "x@y.com", Password: "whatever"}, SessionMeta{})
	if !errors.Is(err, domain.ErrCredentialNotFound) {
		t.Fatalf("expected ErrCredentialNotFound, got %v", err)
	}
}

func TestAuthService_RefreshTokens_EmptyTokenRejected(t *testing.T) {
	rotateCalled := false
	refreshRepo := &fakeRefreshRepo{
		rotate: func(context.Context, domain.RotateRefreshTokenTxParams) (db.RotateRefreshTokenTxResult, error) {
			rotateCalled = true
			return db.RotateRefreshTokenTxResult{}, nil
		},
	}
	svc := NewAuthService(&fakeCredentialRepo{}, refreshRepo, testServiceCfg(), &fakeEmailService{})

	_, err := svc.RefreshTokens(context.Background(), "", SessionMeta{})
	if !errors.Is(err, domain.ErrRefreshTokenInvalid) {
		t.Fatalf("expected ErrRefreshTokenInvalid, got %v", err)
	}
	if rotateCalled {
		t.Error("Rotate must not be called for an empty refresh token")
	}
}

func TestAuthService_RefreshTokens_Success(t *testing.T) {
	uid := uuid.MustParse("33333333-3333-3333-3333-333333333333")
	tid := uuid.MustParse("44444444-4444-4444-4444-444444444444")

	var rotateParams domain.RotateRefreshTokenTxParams
	refreshRepo := &fakeRefreshRepo{
		rotate: func(_ context.Context, p domain.RotateRefreshTokenTxParams) (db.RotateRefreshTokenTxResult, error) {
			rotateParams = p
			return db.RotateRefreshTokenTxResult{
				GetCredentialByUserIDRow: db.GetCredentialByUserIDRow{
					UserID: uid, TenantID: tid, Role: domain.UserRoleManager,
				},
			}, nil
		},
	}
	svc := NewAuthService(&fakeCredentialRepo{}, refreshRepo, testServiceCfg(), &fakeEmailService{})

	pair, err := svc.RefreshTokens(context.Background(), "raw-old-token", SessionMeta{UserAgent: "curl"})
	if err != nil {
		t.Fatalf("RefreshTokens: %v", err)
	}
	if pair.AccessToken == "" || pair.RefreshToken == "" {
		t.Fatalf("expected both tokens, got %+v", pair)
	}
	// The old token is hashed before being passed to Rotate.
	if rotateParams.OldTokenHash != hashRefreshToken("raw-old-token") {
		t.Errorf("OldTokenHash = %q", rotateParams.OldTokenHash)
	}
	// The returned access token carries the rotated user's identity.
	claims, err := jwt.VerifyToken(pair.AccessToken, "test-secret")
	if err != nil {
		t.Fatalf("access token did not verify: %v", err)
	}
	if claims.UserId != uid || claims.TenantId != tid || claims.Role != domain.UserRoleManager {
		t.Errorf("claims = %+v", claims)
	}
}

func TestAuthService_RefreshTokens_RotateErrorPropagates(t *testing.T) {
	refreshRepo := &fakeRefreshRepo{
		rotate: func(context.Context, domain.RotateRefreshTokenTxParams) (db.RotateRefreshTokenTxResult, error) {
			return db.RotateRefreshTokenTxResult{}, domain.ErrRefreshTokenInvalid
		},
	}
	svc := NewAuthService(&fakeCredentialRepo{}, refreshRepo, testServiceCfg(), &fakeEmailService{})

	_, err := svc.RefreshTokens(context.Background(), "raw-old-token", SessionMeta{})
	if !errors.Is(err, domain.ErrRefreshTokenInvalid) {
		t.Fatalf("expected ErrRefreshTokenInvalid, got %v", err)
	}
}

func TestAuthService_Logout_EmptyTokenIsNoop(t *testing.T) {
	revokeCalled := false
	refreshRepo := &fakeRefreshRepo{
		revokeByHash: func(context.Context, string) error {
			revokeCalled = true
			return nil
		},
	}
	svc := NewAuthService(&fakeCredentialRepo{}, refreshRepo, testServiceCfg(), &fakeEmailService{})

	if err := svc.Logout(context.Background(), ""); err != nil {
		t.Fatalf("Logout empty: %v", err)
	}
	if revokeCalled {
		t.Error("RevokeByHash must not be called for an empty token")
	}
}

func TestAuthService_Logout_SuccessHashesAndRevokes(t *testing.T) {
	var revokedHash string
	refreshRepo := &fakeRefreshRepo{
		revokeByHash: func(_ context.Context, hash string) error {
			revokedHash = hash
			return nil
		},
	}
	svc := NewAuthService(&fakeCredentialRepo{}, refreshRepo, testServiceCfg(), &fakeEmailService{})

	if err := svc.Logout(context.Background(), "raw-logout-token"); err != nil {
		t.Fatalf("Logout: %v", err)
	}
	if revokedHash != hashRefreshToken("raw-logout-token") {
		t.Errorf("revoked hash = %q, want hash of the raw token", revokedHash)
	}
}

func TestAuthService_Logout_RevokeErrorPropagates(t *testing.T) {
	refreshRepo := &fakeRefreshRepo{
		revokeByHash: func(context.Context, string) error { return errors.New("db down") },
	}
	svc := NewAuthService(&fakeCredentialRepo{}, refreshRepo, testServiceCfg(), &fakeEmailService{})

	if err := svc.Logout(context.Background(), "raw"); err == nil {
		t.Fatal("expected the revoke error to propagate, got nil")
	}
}
