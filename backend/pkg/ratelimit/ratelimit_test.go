package ratelimit

import (
	"sync"
	"testing"
	"time"
)

func TestLimiter_AllowsBurstThenDenies(t *testing.T) {
	l := NewLimiter(Config{Rate: 1, Burst: 3, CleanupInterval: -1})
	defer l.Stop()

	for i := 1; i <= 3; i++ {
		ok, retryAfter := l.Allow("client-a")
		if !ok || retryAfter != 0 {
			t.Fatalf("request %d within burst: got ok=%v retryAfter=%v", i, ok, retryAfter)
		}
	}

	ok, retryAfter := l.Allow("client-a")
	if ok {
		t.Fatal("request beyond burst should be denied")
	}
	if retryAfter <= 0 {
		t.Fatalf("denied request should report a positive retryAfter, got %v", retryAfter)
	}
}

func TestLimiter_KeysAreIndependent(t *testing.T) {
	l := NewLimiter(Config{Rate: 1, Burst: 1, CleanupInterval: -1})
	defer l.Stop()

	if ok, _ := l.Allow("client-a"); !ok {
		t.Fatal("first request for client-a should pass")
	}
	if ok, _ := l.Allow("client-a"); ok {
		t.Fatal("second request for client-a should be denied")
	}

	// A different key has its own full bucket.
	ok, retryAfter := l.Allow("client-b")
	if !ok || retryAfter != 0 {
		t.Fatalf("client-b has an independent bucket: got ok=%v retryAfter=%v", ok, retryAfter)
	}
}

func TestLimiter_RefillsOverTime(t *testing.T) {
	// 200 tokens/sec => a new token every ~5ms.
	l := NewLimiter(Config{Rate: 200, Burst: 1, CleanupInterval: -1})
	defer l.Stop()

	if ok, _ := l.Allow("k"); !ok {
		t.Fatal("initial request should pass")
	}
	if ok, _ := l.Allow("k"); ok {
		t.Fatal("second immediate request should be denied")
	}

	time.Sleep(30 * time.Millisecond)

	ok, retryAfter := l.Allow("k")
	if !ok {
		t.Fatalf("request after refill window should pass, retryAfter=%v", retryAfter)
	}
}

func TestLimiter_ConcurrentAccessIsSafe(t *testing.T) {
	l := NewLimiter(Config{Rate: 1000, Burst: 100, CleanupInterval: -1})
	defer l.Stop()

	var wg sync.WaitGroup
	allowed := make([]int, 8)
	for worker := range 8 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for range 100 {
				if ok, _ := l.Allow("shared-key"); ok {
					allowed[worker]++
				}
			}
		}()
	}
	wg.Wait()

	total := 0
	for _, n := range allowed {
		total += n
	}
	// Burst caps immediate concurrency at 100 (refill may add a few).
	if total < 100 || total > 110 {
		t.Fatalf("concurrent allows: got %d, want ~100 (burst cap)", total)
	}
}

func TestLimiter_JanitorEvictsIdleKeys(t *testing.T) {
	l := NewLimiter(Config{Rate: 1, Burst: 1, TTL: 10 * time.Millisecond, CleanupInterval: 5 * time.Millisecond})
	defer l.Stop()

	l.Allow("idle-key")
	time.Sleep(30 * time.Millisecond)

	l.mu.Lock()
	count := len(l.entries)
	l.mu.Unlock()

	if count != 0 {
		t.Fatalf("idle key should have been evicted, %d entries remain", count)
	}
}

func TestLimiter_DisabledWhenRateOrBurstNotPositive(t *testing.T) {
	// Zero-value config (e.g. from a Config literal in tests, or an env
	// override of 0) must allow traffic instead of blocking the API.
	for _, cfg := range []Config{
		{Rate: 0, Burst: 10},
		{Rate: 10, Burst: 0},
		{},
	} {
		l := NewLimiter(cfg)
		for range 100 {
			if ok, retryAfter := l.Allow("k"); !ok || retryAfter != 0 {
				t.Fatalf("cfg %+v: disabled limiter must allow everything, got ok=%v", cfg, ok)
			}
		}
	}
}

func TestStop_IsIdempotent(t *testing.T) {
	l := NewLimiter(Config{Rate: 1, Burst: 1, CleanupInterval: time.Millisecond})
	l.Stop()
	l.Stop() // must not panic on the second call
}
