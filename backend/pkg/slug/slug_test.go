package slug

import (
	"strings"
	"testing"
)

func TestGenerateTenantSlug(t *testing.T) {
	cases := []struct {
		name string
		in   string
		want string
	}{
		{"simple name", "Dave's Farm", "dave-s-farm"},
		{"lowercases input", "FARMDECK", "farmdeck"},
		{"collapses multiple invalid runs into one hyphen", "a   b!!!c", "a-b-c"},
		{"collapses consecutive hyphens", "a--b", "a-b"},
		{"trims leading/trailing hyphens", "---Dave's Farm---", "dave-s-farm"},
		{"keeps digits", "Farm 2.0", "farm-2-0"},
		{"all-invalid input yields empty", "!!!@@@###", ""},
		{"whitespace-only yields empty", "    ", ""},
		{"unicode letters get stripped to hyphens then trimmed", "Café Münster", "caf-m-nster"},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			got := GenerateTenantSlug(tc.in)
			if got != tc.want {
				t.Errorf("got %q want %q", got, tc.want)
			}
		})
	}
}

// The subdomain column stores the bare slug; the root domain is appended
// at display time, so a slug must never contain a dot.
func TestGenerateTenantSlug_NeverContainsDots(t *testing.T) {
	got := GenerateTenantSlug("Acme Farms 2.0")
	if strings.Contains(got, ".") {
		t.Errorf("slug must not contain dots, got %q", got)
	}
}
