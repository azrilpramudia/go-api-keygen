package domain

import "context"

type Encoder interface {
	Generate(bits int) (string, error)
}

type RateLimiter interface {
	Allow(ctx context.Context, key string) (allowed bool, err error)
}
