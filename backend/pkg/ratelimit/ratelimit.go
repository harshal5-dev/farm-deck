// Package ratelimit provides a concurrency-safe, in-memory token bucket
// rate limiter keyed by an arbitrary string (client IP, user ID, ...).
//
// Each key gets its own bucket that starts full (Burst tokens) and refills
// steadily at Rate tokens per second, so short bursts are tolerated while
// the sustained rate is capped. Buckets for keys that go idle are evicted
// by a background janitor so memory stays bounded.
//
// A limiter with a non-positive Rate or Burst is disabled and allows
// everything ("0 = off"), so zero-value configs never take the API down.
package ratelimit

import (
	"sync"
	"time"

	"golang.org/x/time/rate"
)

// Config controls one keyed limiter.
type Config struct {
	// Rate is the sustained number of requests per second per key.
	Rate rate.Limit
	// Burst is the bucket capacity: the maximum number of requests a key
	// may make back-to-back before throttling kicks in.
	Burst int
	// TTL is how long an idle key's bucket is kept before the janitor
	// evicts it. Defaults to 5 minutes.
	TTL time.Duration
	// CleanupInterval is how often the janitor sweeps stale entries.
	// Defaults to 1 minute. Negative disables background cleanup.
	CleanupInterval time.Duration
}

type entry struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

// Limiter hands out one token bucket per key. It is safe for concurrent use.
type Limiter struct {
	cfg      Config
	disabled bool
	mu       sync.Mutex
	entries  map[string]*entry
	stop     chan struct{}
	stopOne  sync.Once
}

func NewLimiter(cfg Config) *Limiter {
	if cfg.TTL <= 0 {
		cfg.TTL = 5 * time.Minute
	}
	if cfg.CleanupInterval == 0 {
		cfg.CleanupInterval = time.Minute
	}

	l := &Limiter{
		cfg:      cfg,
		disabled: cfg.Rate <= 0 || cfg.Burst <= 0,
		entries:  make(map[string]*entry),
		stop:     make(chan struct{}),
	}

	if !l.disabled && cfg.CleanupInterval > 0 {
		go l.janitor()
	}

	return l
}

// Allow consumes one token for key. It reports whether the request may
// proceed and, when denied, how long the caller should wait before
// retrying.
func (l *Limiter) Allow(key string) (ok bool, retryAfter time.Duration) {
	if l.disabled {
		return true, 0
	}

	l.mu.Lock()
	defer l.mu.Unlock()

	e, exists := l.entries[key]
	if !exists {
		e = &entry{limiter: rate.NewLimiter(l.cfg.Rate, l.cfg.Burst)}
		l.entries[key] = e
	}
	e.lastSeen = time.Now()

	r := e.limiter.Reserve()
	delay := r.Delay()
	if delay > 0 {
		// No token available right now: give it back so a denied request
		// doesn't also drain the bucket for future ones.
		r.Cancel()
		return false, delay
	}

	return true, 0
}

// janitor periodically evicts buckets whose key has been idle longer than
// the configured TTL.
func (l *Limiter) janitor() {
	ticker := time.NewTicker(l.cfg.CleanupInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			l.evictIdle()
		case <-l.stop:
			return
		}
	}
}

func (l *Limiter) evictIdle() {
	now := time.Now()

	l.mu.Lock()
	defer l.mu.Unlock()

	for key, e := range l.entries {
		if now.Sub(e.lastSeen) > l.cfg.TTL {
			delete(l.entries, key)
		}
	}
}

// Stop halts the janitor goroutine. It is safe to call multiple times and
// on limiters created with cleanup disabled.
func (l *Limiter) Stop() {
	l.stopOne.Do(func() { close(l.stop) })
}
