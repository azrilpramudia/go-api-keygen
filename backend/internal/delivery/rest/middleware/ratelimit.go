package middleware

import (
	"log/slog"
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/azrilpramudia/go-api-keygen/internal/domain"
)

func RateLimit(l domain.RateLimiter) gin.HandlerFunc {
	return func(c *gin.Context) {
		res, err := l.Allow(c.Request.Context(), c.ClientIP())
		if err != nil {
			slog.Error("rate limiter unavailable", "err", err)
			c.Next()
			return
		}

		c.Header("X-RateLimit-Remaining", strconv.Itoa(res.Remaining))
		if !res.Allowed {
			c.Header("Retry-After", strconv.Itoa(int(math.Ceil(res.RetryAfter.Seconds()))))
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{"error": "too many requests"})
			return
		}
		c.Next()
	}
}
