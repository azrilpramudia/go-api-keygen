package middleware_test

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/azrilpramudia/go-api-keygen/internal/delivery/rest/middleware"
	"github.com/azrilpramudia/go-api-keygen/internal/domain"
)

type fakeLimiter struct {
	res domain.RateLimitResult
	err error
}

func (f fakeLimiter) Allow(context.Context, string) (domain.RateLimitResult, error) {
	return f.res, f.err
}

func run(l domain.RateLimiter) *httptest.ResponseRecorder {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(middleware.RateLimit(l))
	r.GET("/", func(c *gin.Context) { c.Status(http.StatusOK) })
	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/", nil))
	return w
}

func TestRateLimitBlocks(t *testing.T) {
	w := run(fakeLimiter{res: domain.RateLimitResult{Allowed: false, RetryAfter: 30 * time.Second}})
	if w.Code != http.StatusTooManyRequests {
		t.Fatalf("status = %d, want 429", w.Code)
	}
	if w.Header().Get("Retry-After") != "30" {
		t.Fatalf("Retry-After = %q, want 30", w.Header().Get("Retry-After"))
	}
}

func TestRateLimitFailOpen(t *testing.T) {
	w := run(fakeLimiter{err: errors.New("redis down")})
	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200 (fail-open)", w.Code)
	}
}
