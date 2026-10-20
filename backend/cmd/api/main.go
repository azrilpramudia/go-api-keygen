package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/redis/go-redis/v9"

	"github.com/azrilpramudia/go-api-keygen/internal/config"
	"github.com/azrilpramudia/go-api-keygen/internal/delivery/rest"
	"github.com/azrilpramudia/go-api-keygen/internal/delivery/rest/middleware"
	"github.com/azrilpramudia/go-api-keygen/internal/domain"
	"github.com/azrilpramudia/go-api-keygen/internal/infrastructure/encoder"
	"github.com/azrilpramudia/go-api-keygen/internal/infrastructure/ratelimit"
	"github.com/azrilpramudia/go-api-keygen/internal/usecase"
)

func main() {
	if err := run(); err != nil {
		slog.Error("fatal", "err", err)
		os.Exit(1)
	}
}

func run() error {
	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("load config: %w", err)
	}

	// Infrastructure
	rdb := redis.NewClient(&redis.Options{Addr: cfg.RedisAddr, Password: cfg.RedisPassword})
	defer rdb.Close()

	pingCtx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	err = rdb.Ping(pingCtx).Err()
	cancel()
	if err != nil {
		return fmt.Errorf("redis ping %s: %w", cfg.RedisAddr, err)
	}

	limiter := ratelimit.NewRedisLimiter(rdb, cfg.RateLimit, cfg.RateWindow)

	// Usecase
	uc := usecase.NewGenerateUseCase(map[domain.Format]domain.Encoder{
		domain.FormatHex:    encoder.Hex{},
		domain.FormatBase64: encoder.Base64{},
		domain.FormatBase62: encoder.Base62{},
		domain.FormatUUID:   encoder.UUIDv4{},
	})

	// Delivery
	r := rest.NewRouter(rest.NewKeyHandler(uc), cfg.CORSOrigin, middleware.RateLimit(limiter))
	if len(cfg.TrustedProxies) > 0 {
		if err := r.SetTrustedProxies(cfg.TrustedProxies); err != nil {
			return fmt.Errorf("trusted proxies: %w", err)
		}
	}

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           r,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	// Graceful shutdown
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	errCh := make(chan error, 1)
	go func() {
		slog.Info("server listening", "addr", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
		}
	}()

	select {
	case err := <-errCh:
		return err
	case <-ctx.Done():
		slog.Info("shutting down")
	}

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	return srv.Shutdown(shutdownCtx)
}
