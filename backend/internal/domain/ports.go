package domain

import (
	"context"
	"time"
)

type Encoder interface {
	Generate(bits int) (string, error)
}

type RateLimitResult struct {
	Allowed    bool
	Remaining  int
	RetryAfter time.Duration
}

type RateLimiter interface {
	Allow(ctx context.Context, key string) (RateLimitResult, error)
}
