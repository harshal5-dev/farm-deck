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
