package jwt

import (
	"testing"
	"time"

	"github.com/google/uuid"
)

func cfg(duration time.Duration, secret string) JwtConfig {
	return JwtConfig{AccessTokenDuration: duration, Issuer: "farmdeck-test", JWTSecret: secret}
}

func userDetails() UserDetails {
	return UserDetails{
		UserId:   uuid.MustParse("11111111-1111-1111-1111-111111111111"),
		TenantId: uuid.MustParse("22222222-2222-2222-2222-222222222222"),
		Role:     "owner",
	}
}

func TestGenerateAndVerify_RoundTripPreservesClaims(t *testing.T) {
	secret := "round-trip-secret"
	tok, err := GenerateToken(userDetails(), cfg(time.Hour, secret))
	if err != nil {
		t.Fatalf("GenerateToken: %v", err)
	}
	if tok == "" {
		t.Fatal("expected a non-empty token")
	}

	claims, err := VerifyToken(tok, secret)
	if err != nil {
		t.Fatalf("VerifyToken: %v", err)
	}
	ud := userDetails()
	if claims.UserId != ud.UserId {
		t.Errorf("UserId: got %v", claims.UserId)
	}
	if claims.TenantId != ud.TenantId {
		t.Errorf("TenantId: got %v", claims.TenantId)
	}
	if claims.Role != "owner" {
		t.Errorf("Role: got %q", claims.Role)
	}
	if claims.Issuer != "farmdeck-test" {
		t.Errorf("Issuer: got %q", claims.Issuer)
	}
}

func TestVerifyToken_RejectsWrongSecret(t *testing.T) {
	tok, err := GenerateToken(userDetails(), cfg(time.Hour, "secret-a"))
	if err != nil {
		t.Fatalf("GenerateToken: %v", err)
	}
	if _, err := VerifyToken(tok, "secret-b"); err == nil {
		t.Fatal("expected verification to fail with the wrong secret, got nil")
	}
}

func TestVerifyToken_RejectsExpiredToken(t *testing.T) {
	// A negative duration produces a token that already expired at generation time.
	tok, err := GenerateToken(userDetails(), cfg(-time.Hour, "expiry-secret"))
	if err != nil {
		t.Fatalf("GenerateToken: %v", err)
	}
	if _, err := VerifyToken(tok, "expiry-secret"); err == nil {
		t.Fatal("expected an expired token to fail verification, got nil")
	}
}

func TestVerifyToken_RejectsMalformedToken(t *testing.T) {
	cases := map[string]string{
		"garbage":  "not.a.real.jwt",
		"empty":    "",
		"two-dots": "..",
	}
	for name, tok := range cases {
		t.Run(name, func(t *testing.T) {
			if _, err := VerifyToken(tok, "any-secret"); err == nil {
				t.Fatalf("expected verification of %q to fail, got nil", tok)
			}
		})
	}
}

func TestGenerateToken_DifferentTokensForDifferentSecrets(t *testing.T) {
	a, err := GenerateToken(userDetails(), cfg(time.Hour, "secret-a"))
	if err != nil {
		t.Fatalf("GenerateToken a: %v", err)
	}
	b, err := GenerateToken(userDetails(), cfg(time.Hour, "secret-b"))
	if err != nil {
		t.Fatalf("GenerateToken b: %v", err)
	}
	if a == b {
		t.Error("tokens signed with different secrets should differ")
	}
}
