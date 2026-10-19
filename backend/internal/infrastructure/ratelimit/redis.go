package ratelimit

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"

	"github.com/azrilpramudia/go-api-keygen/internal/domain"
)

var fixedWindow = redis.NewScript(`
local current = redis.call("INCR", KEYS[1])
if current == 1 then
  redis.call("PEXPIRE", KEYS[1], ARGV[1])
end
local ttl = redis.call("PTTL", KEYS[1])
return {current, ttl}
`)

type RedisLimiter struct {
	rdb    *redis.Client
	limit  int
	window time.Duration
	prefix string
}

func NewRedisLimiter(rdb *redis.Client, limit int, window time.Duration) *RedisLimiter {
	return &RedisLimiter{rdb: rdb, limit: limit, window: window, prefix: "rl:keygen:"}
}

func (l *RedisLimiter) Allow(ctx context.Context, key string) (domain.RateLimitResult, error) {
	raw, err := fixedWindow.Run(ctx, l.rdb, []string{l.prefix + key}, l.window.Milliseconds()).Slice()
	if err != nil {
		return domain.RateLimitResult{}, err
	}
	count, ok1 := raw[0].(int64)
	ttl, ok2 := raw[1].(int64)
	if !ok1 || !ok2 {
		return domain.RateLimitResult{}, fmt.Errorf("unexpected script result: %v", raw)
	}

	res := domain.RateLimitResult{
		Allowed:   count <= int64(l.limit),
		Remaining: max(l.limit-int(count), 0),
	}
	if !res.Allowed && ttl > 0 {
		res.RetryAfter = time.Duration(ttl) * time.Millisecond
	}
	return res, nil
}
