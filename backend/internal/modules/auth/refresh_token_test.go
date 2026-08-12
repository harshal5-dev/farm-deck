package auth

import (
	"crypto/sha256"
	"encoding/hex"
	"testing"
)

func TestHashRefreshToken(t *testing.T) {
	raw := "some-refresh-token"
	sum := sha256.Sum256([]byte(raw))
	want := hex.EncodeToString(sum[:])

	if got := hashRefreshToken(raw); got != want {
		t.Errorf("hashRefreshToken = %q, want %q", got, want)
	}
}

func TestGenerateRefreshToken(t *testing.T) {
	raw, hash, err := generateRefreshToken()
	if err != nil {
		t.Fatalf("generateRefreshToken: %v", err)
	}
	if raw == "" {
		t.Error("expected a non-empty raw token")
	}
	if hash == "" {
		t.Error("expected a non-empty hash")
	}
	if raw == hash {
		t.Error("raw token must differ from its hash")
	}

	// The hash must be the sha256 hex digest of the raw token.
	sum := sha256.Sum256([]byte(raw))
	want := hex.EncodeToString(sum[:])
	if hash != want {
		t.Errorf("hash = %q, want sha256(raw) = %q", hash, want)
	}

	// Subsequent calls must produce distinct tokens (randomness).
	raw2, _, err := generateRefreshToken()
	if err != nil {
		t.Fatalf("second generateRefreshToken: %v", err)
	}
	if raw == raw2 {
		t.Error("expected two generated refresh tokens to differ")
	}
}
