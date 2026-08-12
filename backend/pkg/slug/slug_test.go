package slug

import (
	"strings"
	"testing"

	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

func TestGenerateTenantDomain(t *testing.T) {
	suffix := "." + domain.SlugDomain

	cases := []struct {
		name string
		in   string
		want string
	}{
		{"simple name", "Dave's Farm", "dave-s-farm" + suffix},
		{"lowercases input", "FARMDECK", "farmdeck" + suffix},
		{"collapses multiple invalid runs into one hyphen", "a   b!!!c", "a-b-c" + suffix},
		{"collapses consecutive hyphens", "a--b", "a-b" + suffix},
		{"trims leading/trailing hyphens", "---Dave's Farm---", "dave-s-farm" + suffix},
		{"keeps digits", "Farm 2.0", "farm-2-0" + suffix},
		{"all-invalid input yields empty", "!!!@@@###", ""},
		{"whitespace-only yields empty", "    ", ""},
		{"unicode letters get stripped to hyphens then trimmed", "Café Münster", "caf-m-nster" + suffix},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			got := GenerateTenantDomain(tc.in)
			if got != tc.want {
				t.Errorf("got %q want %q", got, tc.want)
			}
		})
	}
}

func TestGenerateTenantDomain_AlwaysAppendsSuffixWhenNonEmpty(t *testing.T) {
	got := GenerateTenantDomain("Acme")
	if !strings.HasSuffix(got, "."+domain.SlugDomain) {
		t.Errorf("expected result to end with the slug domain suffix, got %q", got)
	}
}
