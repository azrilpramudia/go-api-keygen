package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	Port           string
	CORSOrigin     string
	RedisAddr      string
	RedisPassword  string
	RateLimit      int
	RateWindow     time.Duration
	TrustedProxies []string
}

func Load() (Config, error) {
	cfg := Config{
		Port:           getEnv("PORT", "3000"),
		CORSOrigin:     getEnv("CORS_ORIGIN", "http://localhost:5173"),
		RedisAddr:      getEnv("REDIS_ADDR", "localhost:6379"),
		RedisPassword:  os.Getenv("REDIS_PASSWORD"),
		TrustedProxies: splitCSV(os.Getenv("TRUSTED_PROXIES")),
	}

	limit, err := strconv.Atoi(getEnv("RATE_LIMIT", "10"))
	if err != nil || limit < 1 {
		return Config{}, fmt.Errorf("RATE_LIMIT must be a positive integer")
	}
	cfg.RateLimit = limit

	window, err := time.ParseDuration(getEnv("RATE_WINDOW", "1m"))
	if err != nil || window <= 0 {
		return Config{}, fmt.Errorf("RATE_WINDOW must be a positive duration, e.g. 30s or 1m")
	}
	cfg.RateWindow = window

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func splitCSV(s string) []string {
	var out []string
	for _, p := range strings.Split(s, ",") {
		if p = strings.TrimSpace(p); p != "" {
			out = append(out, p)
		}
	}
	return out
}
