// Package invitetoken generates single-use, high-entropy invitation tokens
// and the matching sha256 hashes that get persisted in the user_invitations
// table. The raw token is the secret that travels in the email link; the
// hash is the only thing the server keeps on record.
package invitetoken

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"errors"
)

// rawBytes is the entropy size of a generated raw token. 32 bytes (256 bits)
// is well beyond brute-force range for a single-use, short-lived link.
const rawBytes = 32

// Generate returns a fresh (raw, hash) pair. raw is the secret that should
// be embedded in the invitation URL and emailed to the invitee; hash is what
// must be persisted in the database. raw must never be logged or stored.
func Generate() (raw string, hash string, err error) {
	buf := make([]byte, rawBytes)
	if _, err := rand.Read(buf); err != nil {
		return "", "", err
	}

	raw = base64.RawURLEncoding.EncodeToString(buf)
	sum := sha256.Sum256([]byte(raw))
	hash = hex.EncodeToString(sum[:])
	return raw, hash, nil
}

// Hash returns the sha256 hex of a raw token. Use this when looking up an
// invitation by the token the user presents (e.g. clicking the email link).
func Hash(raw string) (string, error) {
	if raw == "" {
		return "", errors.New("invitetoken: empty raw token")
	}
	sum := sha256.Sum256([]byte(raw))
	return hex.EncodeToString(sum[:]), nil
}
