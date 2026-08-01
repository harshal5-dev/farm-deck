package mailer

import (
	"context"
	"log"
	"time"
)

const (
	sendTimeout = 10 * time.Second
	maxAttempts = 2
	retryDelay  = 500 * time.Millisecond
)

type AsyncMailer struct {
	inner Mailer
}

func NewAsyncMailer(inner Mailer) *AsyncMailer {
	return &AsyncMailer{inner: inner}
}

func (a *AsyncMailer) Send(ctx context.Context, msg Message) error {
	return a.inner.Send(ctx, msg)
}

func (a *AsyncMailer) SendAsync(msg Message) {
	go func() {
		var err error
		for attempt := 1; attempt <= maxAttempts; attempt++ {
			ctx, cancel := context.WithTimeout(context.Background(), sendTimeout)
			err = a.inner.Send(ctx, msg)
			cancel()

			if err == nil {
				return
			}

			if attempt < maxAttempts {
				time.Sleep(retryDelay)
			}
		}
		log.Printf("mailer: async send failed after %d attempts (to=%v subject=%q): %v",
			maxAttempts, msg.To, msg.Subject, err)
	}()
}
