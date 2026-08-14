package templates

import (
	"bytes"
	"embed"
	"fmt"
	htmlTemplate "html/template"
	textTemplate "text/template"

	"github.com/harshal5-dev/farm-deck/backend/pkg/mailer"
)

//go:embed welcome.html welcome.txt invitation.html invitation.txt logo.png
var files embed.FS

//go:embed logo.png
var logoPNG []byte

const logoContentID = "farmdeck-logo"

var parsedHTML = htmlTemplate.Must(htmlTemplate.New("").Funcs(htmlTemplate.FuncMap{
	"appURL": func(u string) string {
		if u == "" {
			return "https://farmdeck.app"
		}
		return u
	},
}).ParseFS(files, "welcome.html", "invitation.html"))
var parsedText = textTemplate.Must(textTemplate.New("").Funcs(textTemplate.FuncMap{
	"appURL": func(u string) string {
		if u == "" {
			return "https://farmdeck.app"
		}
		return u
	},
}).ParseFS(files, "welcome.txt", "invitation.txt"))

type Welcome struct {
	Name   string
	AppURL string
}

// Invitation is the data payload for the invite-a-member email. AcceptURL is
// the full URL the invitee clicks (frontend route + ?token=...). TenantName
// is optional — pass "" to render the generic copy.
type Invitation struct {
	Name       string
	TenantName string
	AcceptURL  string
	AppURL     string
}

// Render executes the named HTML template (e.g. "welcome.html") with data.
func Render(name string, data any) (string, error) {
	var buf bytes.Buffer
	if err := parsedHTML.ExecuteTemplate(&buf, name, data); err != nil {
		return "", fmt.Errorf("templates: render %s: %w", name, err)
	}
	return buf.String(), nil
}

// RenderText executes the named plain-text template (e.g. "welcome.txt") with data,
// for the text/plain part of a multipart email.
func RenderText(name string, data any) (string, error) {
	var buf bytes.Buffer
	if err := parsedText.ExecuteTemplate(&buf, name, data); err != nil {
		return "", fmt.Errorf("templates: render text %s: %w", name, err)
	}
	return buf.String(), nil
}

// LogoPNG returns the branded logo as transparent-background PNG bytes for
// use as an inline email attachment. The image is rendered from the same
// logo.svg the frontend serves, but PNG is used because most email clients
// (Outlook desktop in particular) won't render inline SVGs and instead show
// them as paperclip attachments.
func LogoPNG() []byte {
	// Return a copy so callers can't mutate the embedded asset.
	out := make([]byte, len(logoPNG))
	copy(out, logoPNG)
	return out
}

// LogoContentID is the CID used to reference the logo in HTML (cid:<LogoContentID>).
func LogoContentID() string { return logoContentID }

// WelcomeMessage renders the welcome email for a single recipient and returns a
// ready-to-send Message with the logo attached inline. data.AppURL is used for
// the call-to-action button; if empty it falls back to https://farmdeck.app.
func WelcomeMessage(to string, data Welcome) (mailer.Message, error) {
	html, err := Render("welcome.html", data)
	if err != nil {
		return mailer.Message{}, err
	}
	text, err := RenderText("welcome.txt", data)
	if err != nil {
		return mailer.Message{}, err
	}

	return mailer.Message{
		To:      []string{to},
		Subject: "Welcome to Farmdeck 🌱",
		HTML:    html,
		Text:    text,
		Attachments: []mailer.Attachment{
			{
				Content:     LogoPNG(),
				Filename:    "farmdeck-logo.png",
				ContentType: "image/png",
				ContentID:   logoContentID,
			},
		},
	}, nil
}

// InvitationMessage renders the invitation email for a single recipient and
// returns a ready-to-send Message with the logo attached inline. data.AcceptURL
// is the full URL the invitee clicks; data.AppURL is used in the footer and
// falls back to https://farmdeck.app when empty.
func InvitationMessage(to string, data Invitation) (mailer.Message, error) {
	html, err := Render("invitation.html", data)
	if err != nil {
		return mailer.Message{}, err
	}
	text, err := RenderText("invitation.txt", data)
	if err != nil {
		return mailer.Message{}, err
	}

	return mailer.Message{
		To:      []string{to},
		Subject: "You're invited to Farmdeck 🌱",
		HTML:    html,
		Text:    text,
		Attachments: []mailer.Attachment{
			{
				Content:     LogoPNG(),
				Filename:    "farmdeck-logo.png",
				ContentType: "image/png",
				ContentID:   logoContentID,
			},
		},
	}, nil
}
