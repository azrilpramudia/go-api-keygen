package ratelimit_test

import (
	"context"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/redis/go-redis/v9"

	"github.com/azrilpramudia/go-api-keygen/internal/infrastructure/ratelimit"
)

func TestRedisLimiter(t *testing.T) {
	mr := miniredis.RunT(t)
	rdb := redis.NewClient(&redis.Options{Addr: mr.Addr()})
	l := ratelimit.NewRedisLimiter(rdb, 3, time.Minute)
	ctx := context.Background()

	for i := 0; i < 3; i++ {
		res, err := l.Allow(ctx, "1.2.3.4")
		if err != nil || !res.Allowed {
			t.Fatalf("request %d should be allowed: res=%+v err=%v", i+1, res, err)
		}
	}

	res, _ := l.Allow(ctx, "1.2.3.4")
	if res.Allowed || res.RetryAfter <= 0 {
		t.Fatalf("4th request should be blocked with RetryAfter, got %+v", res)
	}

	if res, _ := l.Allow(ctx, "5.6.7.8"); !res.Allowed {
		t.Fatal("another IP should not be affected")
	}

	mr.FastForward(time.Minute + time.Second)
	if res, _ := l.Allow(ctx, "1.2.3.4"); !res.Allowed {
		t.Fatal("request should be allowed again after the window expires")
	}
}
