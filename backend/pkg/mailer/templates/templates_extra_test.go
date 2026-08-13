package templates

import "testing"

func TestLogoContentID(t *testing.T) {
	if got := LogoContentID(); got != "farmdeck-logo" {
		t.Errorf("LogoContentID = %q, want %q", got, "farmdeck-logo")
	}
	// It must match the CID referenced by the rendered HTML template.
	html, err := Render("welcome.html", Welcome{Name: "x"})
	if err != nil {
		t.Fatalf("render: %v", err)
	}
	if !contains(html, "cid:"+LogoContentID()) {
		t.Errorf("rendered HTML should reference cid:%s", LogoContentID())
	}
}

// LogoSVG must return an independent copy each call, so a caller mutating its
// result cannot corrupt the embedded asset for subsequent callers.
func TestLogoSVG_ReturnsIndependentCopy(t *testing.T) {
	a := LogoSVG()
	b := LogoSVG()
	if len(a) == 0 || len(b) == 0 {
		t.Fatal("expected non-empty SVG bytes")
	}

	// Corrupt the first copy.
	a[0] ^= 0xFF

	// The second copy must be unaffected.
	again := LogoSVG()
	if again[0] == a[0] {
		t.Errorf("mutating one LogoSVG() result affected a later call — copies are not independent")
	}
}

func contains(s, sub string) bool {
	for i := 0; i+len(sub) <= len(s); i++ {
		if s[i:i+len(sub)] == sub {
			return true
		}
	}
	return false
}
