BACKEND  := backend
FRONTEND := frontend

.PHONY: help run dev build test cover fmt vet tidy redis-up redis-down clean

help: 
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-12s %s\n", $$1, $$2}'

run: 
	cd $(BACKEND) && go run ./cmd/api

dev: 
	cd $(BACKEND) && air

build: 
	cd $(BACKEND) && go build -o bin/api ./cmd/api

test: 
	cd $(BACKEND) && go test ./internal/... -v -race

cover: 
	cd $(BACKEND) && go test ./internal/... -coverprofile=coverage.out && go tool cover -func=coverage.out

fmt: 
	cd $(BACKEND) && gofmt -s -w .

vet: 
	cd $(BACKEND) && go vet ./...

tidy: 
	cd $(BACKEND) && go mod tidy

redis-up: 
	docker compose up -d redis

redis-down: 
	docker compose down

clean: 
	rm -rf $(BACKEND)/bin $(BACKEND)/tmp $(BACKEND)/coverage.out