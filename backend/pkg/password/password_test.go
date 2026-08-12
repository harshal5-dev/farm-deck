package password

import (
	"testing"

	"golang.org/x/crypto/bcrypt"
)

func TestHashPassword_RoundTrips(t *testing.T) {
	hash, err := HashPassword("super-secret-123")
	if err != nil {
		t.Fatalf("HashPassword: unexpected error: %v", err)
	}
	if hash == "" || hash == "super-secret-123" {
		t.Fatal("expected a non-empty hash distinct from the plaintext")
	}

	if err := VerifyPassword(hash, "super-secret-123"); err != nil {
		t.Fatalf("VerifyPassword (correct): got %v", err)
	}
}

func TestVerifyPassword_RejectsWrongPassword(t *testing.T) {
	hash, err := HashPassword("correct horse battery staple")
	if err != nil {
		t.Fatalf("HashPassword: %v", err)
	}

	if err := VerifyPassword(hash, "wrong-password"); err == nil {
		t.Fatal("expected a mismatch error, got nil")
	}
}

func TestHashPassword_DifferentHashesForSameInput(t *testing.T) {
	a, err := HashPassword("same-password")
	if err != nil {
		t.Fatalf("HashPassword a: %v", err)
	}
	b, err := HashPassword("same-password")
	if err != nil {
		t.Fatalf("HashPassword b: %v", err)
	}
	if a == b {
		t.Error("expected bcrypt to salt hashes so identical inputs differ")
	}
	// both must still verify against the plaintext
	if err := VerifyPassword(a, "same-password"); err != nil {
		t.Errorf("verify a: %v", err)
	}
	if err := VerifyPassword(b, "same-password"); err != nil {
		t.Errorf("verify b: %v", err)
	}
}

func TestVerifyPassword_RejectsMalformedHash(t *testing.T) {
	if err := VerifyPassword("not-a-real-bcrypt-hash", "anything"); err == nil {
		t.Fatal("expected an error for a malformed hash, got nil")
	}
}

func TestHashPassword_EmptyStringStillHashes(t *testing.T) {
	// bcrypt accepts empty input; we only assert we get a usable hash back.
	hash, err := HashPassword("")
	if err != nil {
		t.Fatalf("HashPassword empty: %v", err)
	}
	if err := VerifyPassword(hash, ""); err != nil {
		t.Errorf("VerifyPassword empty: %v", err)
	}
}

// sanity: VerifyPassword surfaces bcrypt's mismatch sentinel so callers can map it.
func TestVerifyPassword_WrongPasswordIsBcryptMismatch(t *testing.T) {
	hash, _ := HashPassword("right")
	if err := VerifyPassword(hash, "wrong"); err != bcrypt.ErrMismatchedHashAndPassword {
		t.Errorf("expected bcrypt.ErrMismatchedHashAndPassword, got %v", err)
	}
}
