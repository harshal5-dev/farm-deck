package templates

import (
	"strings"
	"testing"
)

func TestWelcomeRendersName(t *testing.T) {
	html, err := Render("welcome.html", Welcome{Name: "Aarav", AppURL: "http://localhost:5173"})
	if err != nil {
		t.Fatalf("render html: %v", err)
	}
	if !strings.Contains(html, "Welcome, Aarav") {
		t.Errorf("html missing personalized name")
	}
	if !strings.Contains(html, "Farmdeck") {
		t.Errorf("html missing brand name")
	}

	txt, err := RenderText("welcome.txt", Welcome{Name: "Aarav", AppURL: "http://localhost:5173"})
	if err != nil {
		t.Fatalf("render text: %v", err)
	}
	if !strings.Contains(txt, "Welcome to Farmdeck, Aarav!") {
		t.Errorf("text missing personalized name")
	}
	t.Logf("OK html=%d bytes text=%d bytes", len(html), len(txt))
}

func TestWelcomeUsesAppURL(t *testing.T) {
	const url = "http://localhost:5173"
	html, err := Render("welcome.html", Welcome{Name: "Aarav", AppURL: url})
	if err != nil {
		t.Fatalf("render html: %v", err)
	}
	// Button link must point at the configured AppURL.
	wantHref := `href="` + url + `"`
	if !strings.Contains(html, wantHref) {
		t.Errorf("html CTA missing %q", wantHref)
	}

	txt, err := RenderText("welcome.txt", Welcome{Name: "Aarav", AppURL: url})
	if err != nil {
		t.Fatalf("render text: %v", err)
	}
	if !strings.Contains(txt, url) {
		t.Errorf("text missing AppURL %q", url)
	}
}

func TestWelcomeAppURLFallsBackWhenEmpty(t *testing.T) {
	html, err := Render("welcome.html", Welcome{Name: "Aarav"}) // AppURL empty
	if err != nil {
		t.Fatalf("render html: %v", err)
	}
	if !strings.Contains(html, `href="https://farmdeck.app"`) {
		t.Errorf("expected fallback to https://farmdeck.app when AppURL empty")
	}
}

func TestWelcomeHTMLReferencesCIDLogo(t *testing.T) {
	html, err := Render("welcome.html", Welcome{Name: "Aarav", AppURL: "http://localhost:5173"})
	if err != nil {
		t.Fatalf("render html: %v", err)
	}
	// The logo is an inline CID attachment so it renders in Gmail (which strips <svg>).
	if !strings.Contains(html, `src="cid:farmdeck-logo"`) {
		t.Errorf("html missing cid:farmdeck-logo image reference")
	}
	if strings.Contains(html, "<svg") {
		t.Errorf("html still contains an <svg> tag, which Gmail strips — use the CID <img> instead")
	}
}

func TestLogoSVGNonEmpty(t *testing.T) {
	if len(LogoSVG()) == 0 {
		t.Fatal("LogoSVG() returned empty bytes")
	}
	// SVG signature check: starts with an XML/SVG declaration.
	b := LogoSVG()
	if !strings.HasPrefix(string(b), "<svg") {
		t.Fatalf("LogoSVG() does not start with <svg, got prefix %q", string(b[:min(8, len(b))]))
	}
	t.Logf("LogoSVG OK: %d bytes", len(b))
}

func TestWelcomeMessageAttachesLogo(t *testing.T) {
	msg, err := WelcomeMessage("aarav@example.com", Welcome{Name: "Aarav", AppURL: "http://localhost:5173"})
	if err != nil {
		t.Fatalf("WelcomeMessage: %v", err)
	}
	if len(msg.To) != 1 || msg.To[0] != "aarav@example.com" {
		t.Errorf("unexpected To: %v", msg.To)
	}
	if len(msg.Attachments) != 1 {
		t.Fatalf("expected 1 attachment (the logo), got %d", len(msg.Attachments))
	}
	a := msg.Attachments[0]
	if a.ContentID != "farmdeck-logo" {
		t.Errorf("attachment ContentID = %q, want farmdeck-logo", a.ContentID)
	}
	if a.ContentType != "image/svg+xml" {
		t.Errorf("attachment ContentType = %q, want image/svg+xml", a.ContentType)
	}
	if !strings.HasPrefix(msg.HTML, "<!DOCTYPE html>") {
		t.Errorf("HTML body does not look like a full document")
	}
	if !strings.Contains(msg.HTML, "Welcome, Aarav") {
		t.Errorf("HTML body missing personalized name")
	}
}
