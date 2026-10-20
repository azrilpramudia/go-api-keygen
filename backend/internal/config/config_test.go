package config_test

import (
	"testing"
	"time"

	"github.com/azrilpramudia/go-api-keygen/internal/config"
)

func TestLoadDefaults(t *testing.T) {
	for _, k := range []string{"PORT", "CORS_ORIGIN", "REDIS_ADDR", "RATE_LIMIT", "RATE_WINDOW", "TRUSTED_PROXIES"} {
		t.Setenv(k, "")
	}
	cfg, err := config.Load()
	if err != nil {
		t.Fatal(err)
	}
	if cfg.Port != "3000" || cfg.RateLimit != 10 || cfg.RateWindow != time.Minute || len(cfg.TrustedProxies) != 0 {
		t.Fatalf("unexpected defaults: %+v", cfg)
	}
}

func TestLoadInvalid(t *testing.T) {
	t.Setenv("RATE_LIMIT", "abc")
	if _, err := config.Load(); err == nil {
		t.Fatal("expected error for invalid RATE_LIMIT")
	}
}

func TestTrustedProxiesParsing(t *testing.T) {
	t.Setenv("RATE_LIMIT", "")
	t.Setenv("TRUSTED_PROXIES", " 10.0.0.0/8, 172.16.0.0/12 ,,")
	cfg, err := config.Load()
	if err != nil {
		t.Fatal(err)
	}
	if len(cfg.TrustedProxies) != 2 || cfg.TrustedProxies[0] != "10.0.0.0/8" {
		t.Fatalf("got %v", cfg.TrustedProxies)
	}
}
