package invitetoken

import (
	"strings"
	"testing"
)

func TestGenerate_ReturnsValidPair(t *testing.T) {
	raw, hash, err := Generate()
	if err != nil {
		t.Fatalf("Generate: %v", err)
	}
	if raw == "" {
		t.Fatal("raw token must not be empty")
	}
	if hash == "" {
		t.Fatal("hash must not be empty")
	}
	if len(hash) != 64 {
		t.Errorf("hash should be 64 hex chars (sha256), got %d (%q)", len(hash), hash)
	}
	for _, r := range hash {
		if !((r >= '0' && r <= '9') || (r >= 'a' && r <= 'f')) {
			t.Errorf("hash contains non-hex char %q in %q", r, hash)
			break
		}
	}
	if strings.ContainsAny(raw, "+/=") {
		t.Errorf("raw token should be URL-safe (base64 RawURL), got %q", raw)
	}
}

func TestGenerate_ProducesUniqueTokens(t *testing.T) {
	seen := make(map[string]struct{})
	for i := 0; i < 50; i++ {
		raw, _, err := Generate()
		if err != nil {
			t.Fatalf("Generate: %v", err)
		}
		if _, dup := seen[raw]; dup {
			t.Fatalf("duplicate raw token: %q", raw)
		}
		seen[raw] = struct{}{}
	}
}

func TestHash_MatchesGenerate(t *testing.T) {
	raw, hash, err := Generate()
	if err != nil {
		t.Fatalf("Generate: %v", err)
	}
	got, err := Hash(raw)
	if err != nil {
		t.Fatalf("Hash: %v", err)
	}
	if got != hash {
		t.Errorf("Hash(raw) = %q, want %q", got, hash)
	}
}

func TestHash_RejectsEmpty(t *testing.T) {
	if _, err := Hash(""); err == nil {
		t.Fatal("expected error for empty raw token")
	}
}
