ARG GO_VERSION=1.27

# ---------- Stage 1: build ----------
FROM golang:${GO_VERSION}-alpine AS build
WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux \
    go build -trimpath -ldflags="-s -w" -o /out/api ./cmd/api

# ---------- Stage 2: runtime ----------
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/api /api

EXPOSE 3000
USER nonroot:nonroot
ENTRYPOINT ["/api"]