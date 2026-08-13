package email

import (
	"context"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	"github.com/harshal5-dev/farm-deck/backend/pkg/mailer"
)

// recordingMailer captures the message dispatched by the async mailer and
// signals via received so the test can wait deterministically for the
// fire-and-forget SendAsync goroutine.
type recordingMailer struct {
	mu       sync.Mutex
	got      mailer.Message
	received chan struct{}
}

func (r *recordingMailer) Send(_ context.Context, m mailer.Message) error {
	r.mu.Lock()
	r.got = m
	r.mu.Unlock()
	close(r.received)
	return nil
}

func TestSendWelcomeEmail_DispatchesRenderedMessage(t *testing.T) {
	rm := &recordingMailer{received: make(chan struct{})}
	svc := NewEmailService(config.Config{AppURL: "http://localhost:5173"}, mailer.NewAsyncMailer(rm))

	if err := svc.SendWelcomeEmail("alice@farmdeck.app", "Alice"); err != nil {
		t.Fatalf("SendWelcomeEmail: %v", err)
	}

	select {
	case <-rm.received:
	case <-time.After(3 * time.Second):
		t.Fatal("timed out waiting for the welcome email to be dispatched")
	}

	rm.mu.Lock()
	got := rm.got
	rm.mu.Unlock()

	if len(got.To) != 1 || got.To[0] != "alice@farmdeck.app" {
		t.Errorf("To: got %v, want [alice@farmdeck.app]", got.To)
	}
	if got.Subject == "" {
		t.Error("expected a non-empty Subject")
	}
	if !strings.Contains(got.HTML, "Alice") {
		t.Errorf("expected rendered HTML to contain the recipient name, got %q", got.HTML)
	}
	if !strings.Contains(got.HTML, "http://localhost:5173") {
		t.Errorf("expected HTML to reference AppURL, got %q", got.HTML)
	}
}

func TestSendWelcomeEmail_UsesConfiguredAppURL(t *testing.T) {
	rm := &recordingMailer{received: make(chan struct{})}
	svc := NewEmailService(config.Config{AppURL: "https://staging.farmdeck.app"}, mailer.NewAsyncMailer(rm))

	if err := svc.SendWelcomeEmail("bob@farmdeck.app", "Bob"); err != nil {
		t.Fatalf("SendWelcomeEmail: %v", err)
	}

	<-rm.received
	rm.mu.Lock()
	got := rm.got
	rm.mu.Unlock()

	if !strings.Contains(got.HTML, "https://staging.farmdeck.app") {
		t.Errorf("expected the configured AppURL in the rendered email, got %q", got.HTML)
	}
}

func TestSendInvitationEmail_DispatchesAcceptURL(t *testing.T) {
	rm := &recordingMailer{received: make(chan struct{})}
	svc := NewEmailService(
		config.Config{AppURL: "http://localhost:5173"},
		mailer.NewAsyncMailer(rm),
	)

	acceptURL := "http://localhost:5173/accept-invite?token=abc123"
	if err := svc.SendInvitationEmail("bob@farmdeck.app", "Bob", "Alice's Farm", acceptURL); err != nil {
		t.Fatalf("SendInvitationEmail: %v", err)
	}

	select {
	case <-rm.received:
	case <-time.After(3 * time.Second):
		t.Fatal("timed out waiting for the invitation email to be dispatched")
	}

	rm.mu.Lock()
	got := rm.got
	rm.mu.Unlock()

	if len(got.To) != 1 || got.To[0] != "bob@farmdeck.app" {
		t.Errorf("To: got %v, want [bob@farmdeck.app]", got.To)
	}
	if got.Subject == "" {
		t.Error("expected a non-empty Subject")
	}
	if !strings.Contains(got.HTML, "Bob") {
		t.Errorf("expected rendered HTML to contain recipient name, got %q", got.HTML)
	}
	if !strings.Contains(got.HTML, acceptURL) {
		t.Errorf("expected HTML to embed the accept URL %q, got %q", acceptURL, got.HTML)
	}
	if !strings.Contains(got.Text, acceptURL) {
		t.Errorf("expected text part to embed the accept URL %q, got %q", acceptURL, got.Text)
	}
}

func TestSendInvitationEmail_OmitsTenantWhenEmpty(t *testing.T) {
	rm := &recordingMailer{received: make(chan struct{})}
	svc := NewEmailService(
		config.Config{AppURL: "http://localhost:5173"},
		mailer.NewAsyncMailer(rm),
	)

	if err := svc.SendInvitationEmail("bob@farmdeck.app", "Bob", "", "http://localhost:5173/accept-invite?token=x"); err != nil {
		t.Fatalf("SendInvitationEmail: %v", err)
	}

	<-rm.received
	rm.mu.Lock()
	got := rm.got
	rm.mu.Unlock()

	if strings.Contains(got.HTML, "has invited you to join their team") {
		t.Errorf("HTML should not include the tenant-specific copy when TenantName is empty, got %q", got.HTML)
	}
	if !strings.Contains(got.HTML, "invited to join a team") {
		t.Errorf("expected generic invitation copy, got %q", got.HTML)
	}
}
