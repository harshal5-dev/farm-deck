package auth

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/pkg/invitetoken"
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

	svc := NewAuthService(credRepo, &fakeRefreshRepo{}, noopInvitationRepo(), testServiceCfg(), emailSvc)

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
	svc := NewAuthService(credRepo, &fakeRefreshRepo{}, noopInvitationRepo(), testServiceCfg(), emailSvc)

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
	svc := NewAuthService(credRepo, &fakeRefreshRepo{}, noopInvitationRepo(), testServiceCfg(), emailSvc)

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
	svc := NewAuthService(credRepo, refreshRepo, noopInvitationRepo(), testServiceCfg(), &fakeEmailService{})

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
	svc := NewAuthService(credRepo, refreshRepo, noopInvitationRepo(), testServiceCfg(), &fakeEmailService{})

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
	svc := NewAuthService(credRepo, &fakeRefreshRepo{}, noopInvitationRepo(), testServiceCfg(), &fakeEmailService{})

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
	svc := NewAuthService(&fakeCredentialRepo{}, refreshRepo, noopInvitationRepo(), testServiceCfg(), &fakeEmailService{})

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
	svc := NewAuthService(&fakeCredentialRepo{}, refreshRepo, noopInvitationRepo(), testServiceCfg(), &fakeEmailService{})

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
	svc := NewAuthService(&fakeCredentialRepo{}, refreshRepo, noopInvitationRepo(), testServiceCfg(), &fakeEmailService{})

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
	svc := NewAuthService(&fakeCredentialRepo{}, refreshRepo, noopInvitationRepo(), testServiceCfg(), &fakeEmailService{})

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
	svc := NewAuthService(&fakeCredentialRepo{}, refreshRepo, noopInvitationRepo(), testServiceCfg(), &fakeEmailService{})

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
	svc := NewAuthService(&fakeCredentialRepo{}, refreshRepo, noopInvitationRepo(), testServiceCfg(), &fakeEmailService{})

	if err := svc.Logout(context.Background(), "raw"); err == nil {
		t.Fatal("expected the revoke error to propagate, got nil")
	}
}

func TestAuthService_VerifyInvitation_Success(t *testing.T) {
	ctx := context.Background()
	now := time.Now()

	var gotTokenHash string
	invitationRepo := &fakeInvitationRepo{
		verifyInvitation: func(_ context.Context, tokenHash string) (db.GetInvitationDetailsByTokenHashRow, error) {
			gotTokenHash = tokenHash
			return db.GetInvitationDetailsByTokenHashRow{
				ExpiresAt:  now.Add(24 * time.Hour),
				FullName:   "Bob",
				EmailID:    "bob@farmdeck.app",
				Role:       domain.UserRoleGrower,
				TenantName: "Green Acres",
			}, nil
		},
	}
	svc := NewAuthService(&fakeCredentialRepo{}, &fakeRefreshRepo{}, invitationRepo, testServiceCfg(), &fakeEmailService{})

	res, err := svc.VerifyInvitation(ctx, "raw-invite-token")
	if err != nil {
		t.Fatalf("VerifyInvitation: %v", err)
	}

	// The repo must be queried with the sha256 of the raw token, never the raw token itself.
	wantHash, err := invitetoken.Hash("raw-invite-token")
	if err != nil {
		t.Fatalf("hash: %v", err)
	}
	if gotTokenHash != wantHash {
		t.Errorf("repo lookup hash = %q, want sha256 of raw token", gotTokenHash)
	}

	if res.FullName != "Bob" || res.EmailID != "bob@farmdeck.app" || res.Role != domain.UserRoleGrower || res.TenantName != "Green Acres" {
		t.Errorf("response mapping = %+v", res)
	}
}

func TestAuthService_VerifyInvitation_InvalidTokenPropagates(t *testing.T) {
	invitationRepo := &fakeInvitationRepo{
		verifyInvitation: func(context.Context, string) (db.GetInvitationDetailsByTokenHashRow, error) {
			return db.GetInvitationDetailsByTokenHashRow{}, domain.ErrInvitationInvalid
		},
	}
	svc := NewAuthService(&fakeCredentialRepo{}, &fakeRefreshRepo{}, invitationRepo, testServiceCfg(), &fakeEmailService{})

	if _, err := svc.VerifyInvitation(context.Background(), "no-such-token"); !errors.Is(err, domain.ErrInvitationInvalid) {
		t.Fatalf("expected ErrInvitationInvalid, got %v", err)
	}
}

func TestAuthService_VerifyInvitation_AlreadyAccepted(t *testing.T) {
	accepted := time.Now().Add(-time.Hour)
	invitationRepo := &fakeInvitationRepo{
		verifyInvitation: func(context.Context, string) (db.GetInvitationDetailsByTokenHashRow, error) {
			return db.GetInvitationDetailsByTokenHashRow{AcceptedAt: &accepted, ExpiresAt: time.Now().Add(24 * time.Hour)}, nil
		},
	}
	svc := NewAuthService(&fakeCredentialRepo{}, &fakeRefreshRepo{}, invitationRepo, testServiceCfg(), &fakeEmailService{})

	if _, err := svc.VerifyInvitation(context.Background(), "raw"); !errors.Is(err, domain.ErrInvitationAccepted) {
		t.Fatalf("expected ErrInvitationAccepted, got %v", err)
	}
}

func TestAuthService_VerifyInvitation_Revoked(t *testing.T) {
	revoked := time.Now().Add(-time.Hour)
	invitationRepo := &fakeInvitationRepo{
		verifyInvitation: func(context.Context, string) (db.GetInvitationDetailsByTokenHashRow, error) {
			return db.GetInvitationDetailsByTokenHashRow{RevokedAt: &revoked, ExpiresAt: time.Now().Add(24 * time.Hour)}, nil
		},
	}
	svc := NewAuthService(&fakeCredentialRepo{}, &fakeRefreshRepo{}, invitationRepo, testServiceCfg(), &fakeEmailService{})

	if _, err := svc.VerifyInvitation(context.Background(), "raw"); !errors.Is(err, domain.ErrInvitationRevoked) {
		t.Fatalf("expected ErrInvitationRevoked, got %v", err)
	}
}

func TestAuthService_VerifyInvitation_Expired(t *testing.T) {
	invitationRepo := &fakeInvitationRepo{
		verifyInvitation: func(context.Context, string) (db.GetInvitationDetailsByTokenHashRow, error) {
			return db.GetInvitationDetailsByTokenHashRow{ExpiresAt: time.Now().Add(-time.Minute)}, nil
		},
	}
	svc := NewAuthService(&fakeCredentialRepo{}, &fakeRefreshRepo{}, invitationRepo, testServiceCfg(), &fakeEmailService{})

	if _, err := svc.VerifyInvitation(context.Background(), "raw"); !errors.Is(err, domain.ErrInvitationExpired) {
		t.Fatalf("expected ErrInvitationExpired, got %v", err)
	}
}

func TestAuthService_AcceptInvitation_Success(t *testing.T) {
	ctx := context.Background()
	uid := uuid.MustParse("18181818-1818-1818-1818-181818181818")
	tid := uuid.MustParse("19191919-1919-1919-1919-191919191919")

	var gotParams domain.AcceptInvitationTxParams
	invitationRepo := &fakeInvitationRepo{
		acceptInvitation: func(_ context.Context, p domain.AcceptInvitationTxParams) (db.AcceptInvitationTxResult, error) {
			gotParams = p
			return db.AcceptInvitationTxResult{
				User: db.User{ID: uid, TenantID: tid, Role: domain.UserRoleGrower, Status: domain.UserStatusActive},
			}, nil
		},
	}
	refreshRepo := &fakeRefreshRepo{
		createRefreshToken: func(context.Context, db.CreateRefreshTokenParams) (db.RefreshToken, error) {
			return db.RefreshToken{}, nil
		},
	}
	svc := NewAuthService(&fakeCredentialRepo{}, refreshRepo, invitationRepo, testServiceCfg(), &fakeEmailService{})

	pair, err := svc.AcceptInvitation(ctx, AcceptInvitationRequest{Token: "raw-invite-token", Password: "chosenpassword1"}, SessionMeta{UserAgent: "Mozilla", IP: "1.2.3.4"})
	if err != nil {
		t.Fatalf("AcceptInvitation: %v", err)
	}

	// The tx receives the token hash, not the raw token.
	wantHash, err := invitetoken.Hash("raw-invite-token")
	if err != nil {
		t.Fatalf("hash: %v", err)
	}
	if gotParams.TokenHash != wantHash {
		t.Errorf("TokenHash = %q, want sha256 of raw token", gotParams.TokenHash)
	}
	// The tx receives a bcrypt hash that verifies against the chosen password.
	if gotParams.PasswordHash == "chosenpassword1" {
		t.Error("password must be hashed, not stored as plaintext")
	}
	if err := password.VerifyPassword(gotParams.PasswordHash, "chosenpassword1"); err != nil {
		t.Errorf("hashed password did not verify: %v", err)
	}

	// Accepting logs the invitee in with their own identity.
	if pair.AccessToken == "" || pair.RefreshToken == "" {
		t.Fatalf("expected both tokens, got %+v", pair)
	}
	claims, err := jwt.VerifyToken(pair.AccessToken, "test-secret")
	if err != nil {
		t.Fatalf("access token did not verify: %v", err)
	}
	if claims.UserId != uid || claims.TenantId != tid || claims.Role != domain.UserRoleGrower {
		t.Errorf("claims = %+v", claims)
	}
}

func TestAuthService_AcceptInvitation_RepoErrorSuppressesTokens(t *testing.T) {
	createCalled := false
	invitationRepo := &fakeInvitationRepo{
		acceptInvitation: func(context.Context, domain.AcceptInvitationTxParams) (db.AcceptInvitationTxResult, error) {
			return db.AcceptInvitationTxResult{}, domain.ErrInvitationAccepted
		},
	}
	refreshRepo := &fakeRefreshRepo{
		createRefreshToken: func(context.Context, db.CreateRefreshTokenParams) (db.RefreshToken, error) {
			createCalled = true
			return db.RefreshToken{}, nil
		},
	}
	svc := NewAuthService(&fakeCredentialRepo{}, refreshRepo, invitationRepo, testServiceCfg(), &fakeEmailService{})

	_, err := svc.AcceptInvitation(context.Background(), AcceptInvitationRequest{Token: "raw", Password: "chosenpassword1"}, SessionMeta{})
	if !errors.Is(err, domain.ErrInvitationAccepted) {
		t.Fatalf("expected ErrInvitationAccepted, got %v", err)
	}
	if createCalled {
		t.Error("no refresh token should be issued when accepting fails")
	}
}
