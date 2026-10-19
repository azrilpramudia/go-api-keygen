package main

import (
	"time"

	"github.com/redis/go-redis/v9"

	"github.com/azrilpramudia/go-api-keygen/internal/delivery/rest"
	"github.com/azrilpramudia/go-api-keygen/internal/delivery/rest/middleware"
	"github.com/azrilpramudia/go-api-keygen/internal/domain"
	"github.com/azrilpramudia/go-api-keygen/internal/infrastructure/encoder"
	"github.com/azrilpramudia/go-api-keygen/internal/infrastructure/ratelimit"
	"github.com/azrilpramudia/go-api-keygen/internal/usecase"
)

func main() {
	uc := usecase.NewGenerateUseCase(map[domain.Format]domain.Encoder{
		domain.FormatHex:    encoder.Hex{},
		domain.FormatBase64: encoder.Base64{},
		domain.FormatBase62: encoder.Base62{},
		domain.FormatUUID:   encoder.UUIDv4{},
	})

	rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
	limiter := ratelimit.NewRedisLimiter(rdb, 10, time.Minute)

	r := rest.NewRouter(
		rest.NewKeyHandler(uc),
		"http://localhost:5173",
		middleware.RateLimit(limiter),
	)
	_ = r.Run(":3000")
}
