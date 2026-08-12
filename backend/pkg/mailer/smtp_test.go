package mailer

import (
	"context"
	"strings"
	"testing"
)

// These tests cover the pre-network validation branches of smtpMailer.Send.
// go-mail's From/To/ReplyTo parsers reject malformed addresses, and the
// smtpMailer returns before creating an SMTP client — so no connection is
// attempted and no server is required.
//
// The actual send path (DialAndSendWithContext) needs a live SMTP server and
// is intentionally not covered here.

func newTestSMTPMailer(from string) Mailer {
	// host/port/credentials are irrelevant: every test below fails before
	// any connection is attempted.
	return NewSMTPMailer("127.0.0.1", 1, "u", "p", from)
}

func TestSMTPMailer_SendRejectsInvalidFromAddress(t *testing.T) {
	m := newTestSMTPMailer("noatsign") // invalid From

	err := m.Send(context.Background(), Message{To: []string{"to@example.com"}, Subject: "x"})
	if err == nil {
		t.Fatal("expected an error for an invalid From address, got nil")
	}
	if !strings.Contains(err.Error(), "invalid from address") {
		t.Errorf("expected an 'invalid from address' error, got %q", err.Error())
	}
}

func TestSMTPMailer_SendRejectsInvalidToAddress(t *testing.T) {
	m := newTestSMTPMailer("from@example.com") // valid From

	err := m.Send(context.Background(), Message{To: []string{"noatsign"}, Subject: "x"})
	if err == nil {
		t.Fatal("expected an error for an invalid To address, got nil")
	}
	if !strings.Contains(err.Error(), "invalid to address") {
		t.Errorf("expected an 'invalid to address' error, got %q", err.Error())
	}
}

func TestSMTPMailer_SendRejectsInvalidReplyTo(t *testing.T) {
	m := newTestSMTPMailer("from@example.com")

	err := m.Send(context.Background(), Message{
		To:      []string{"to@example.com"},
		ReplyTo: "noatsign",
		Subject: "x",
	})
	if err == nil {
		t.Fatal("expected an error for an invalid Reply-To address, got nil")
	}
	if !strings.Contains(err.Error(), "invalid reply-to address") {
		t.Errorf("expected an 'invalid reply-to address' error, got %q", err.Error())
	}
}
