package mailer

import (
	"context"
	"errors"
	"sync"
	"testing"
	"time"
)

// fakeMailer records Send calls and can be programmed to fail the first failN
// calls (or every call when allFail). It closes done on whichever call completes
// the async retry loop, so tests can wait deterministically instead of sleeping
// for retryDelay.
type fakeMailer struct {
	mu      sync.Mutex
	calls   int
	sent    []Message
	failN   int // fail calls 1..failN, succeed thereafter
	allFail bool
	done    chan struct{}
}

func (f *fakeMailer) Send(_ context.Context, msg Message) error {
	f.mu.Lock()
	f.calls++
	n := f.calls
	f.sent = append(f.sent, msg)
	f.mu.Unlock()

	if f.allFail {
		if n == maxAttempts {
			close(f.done)
		}
		return errors.New("boom")
	}
	if n <= f.failN {
		return errors.New("boom")
	}
	close(f.done)
	return nil
}

func wait(t *testing.T, done <-chan struct{}) {
	t.Helper()
	select {
	case <-done:
	case <-time.After(3 * time.Second):
		t.Fatal("timed out waiting for the async mailer to finish")
	}
}

func TestAsyncMailer_SendDelegatesToInner(t *testing.T) {
	f := &fakeMailer{done: make(chan struct{})}
	a := NewAsyncMailer(f)

	if err := a.Send(context.Background(), Message{Subject: "sync"}); err != nil {
		t.Fatalf("Send returned unexpected error: %v", err)
	}
	if f.calls != 1 {
		t.Errorf("expected exactly one inner Send, got %d", f.calls)
	}
	if f.sent[0].Subject != "sync" {
		t.Errorf("message not forwarded: got %+v", f.sent[0])
	}
}

func TestAsyncMailer_SendPropagatesInnerError(t *testing.T) {
	f := &fakeMailer{allFail: true, done: make(chan struct{})}
	a := NewAsyncMailer(f)

	if err := a.Send(context.Background(), Message{}); err == nil {
		t.Fatal("expected Send to surface the inner error, got nil")
	}
}

func TestAsyncMailer_SendAsyncSucceedsOnFirstAttempt(t *testing.T) {
	f := &fakeMailer{done: make(chan struct{})}
	a := NewAsyncMailer(f)

	a.SendAsync(Message{Subject: "async"})

	wait(t, f.done)
	if f.calls != 1 {
		t.Errorf("expected 1 attempt on success, got %d", f.calls)
	}
	if f.sent[0].Subject != "async" {
		t.Errorf("unexpected message: %+v", f.sent[0])
	}
}

func TestAsyncMailer_SendAsyncRetriesThenSucceeds(t *testing.T) {
	f := &fakeMailer{failN: 1, done: make(chan struct{})} // fail once, then succeed
	a := NewAsyncMailer(f)

	a.SendAsync(Message{Subject: "eventually"})

	wait(t, f.done)
	if f.calls != 2 {
		t.Errorf("expected 2 attempts (1 fail + 1 success), got %d", f.calls)
	}
	if f.sent[len(f.sent)-1].Subject != "eventually" {
		t.Errorf("last message: %+v", f.sent[len(f.sent)-1])
	}
}

func TestAsyncMailer_SendAsyncGivesUpAfterMaxAttempts(t *testing.T) {
	f := &fakeMailer{allFail: true, done: make(chan struct{})}
	a := NewAsyncMailer(f)

	a.SendAsync(Message{Subject: "doomed"})

	wait(t, f.done)
	if f.calls != maxAttempts {
		t.Errorf("expected exactly %d attempts before giving up, got %d", maxAttempts, f.calls)
	}
}
