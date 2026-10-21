# API Key Generator Backend

Go REST API for generating cryptographically secure API keys. The service uses
Redis for IP-based rate limiting and exposes a small JSON API.

## Requirements

- Go 1.27.1 or newer
- Redis

The API checks its Redis connection during startup and exits if Redis is
unavailable.

## Run locally

Run the following command from the `backend` directory. Set `REDIS_ADDR` if
Redis is not available at the default `localhost:6379` address:

```sh
REDIS_ADDR=localhost:6379 go run ./cmd/api
```

The service listens on `http://localhost:3000` by default. Run the backend test
suite with:

```sh
go test ./...
```

## Configuration

Configuration is read from environment variables. Use `.env.example` as a
reference when configuring your environment; the application does not load a
`.env` file itself.

| Variable          | Default                 | Description                                                                                        |
| ----------------- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| `PORT`            | `3000`                  | HTTP port to listen on. Set this to the port assigned by your hosting provider.                    |
| `CORS_ORIGIN`     | `http://localhost:5173` | The single allowed frontend origin, including its scheme (for example, `https://app.example.com`). |
| `REDIS_ADDR`      | `localhost:6379`        | Redis address in `host:port` format. Redis must be reachable at startup.                           |
| `REDIS_PASSWORD`  | Empty                   | Redis password, if authentication is enabled.                                                      |
| `RATE_LIMIT`      | `10`                    | Maximum requests per IP address in each rate-limit window. Must be a positive integer.             |
| `RATE_WINDOW`     | `1m`                    | Rate-limit window. Uses Go duration syntax, such as `30s` or `1m`; must be positive.               |
| `TRUSTED_PROXIES` | Empty                   | Comma-separated trusted proxy IP addresses or CIDRs. Configure only proxies under your control.    |

The CORS middleware matches the request `Origin` against `CORS_ORIGIN` exactly.
It allows `POST` and `OPTIONS`, and exposes the `Retry-After` and
`X-RateLimit-Remaining` response headers.

## API

### `GET /health`

Returns `200 OK` when the HTTP server is running:

```json
{ "status": "ok" }
```

This endpoint reports HTTP server health; it does not check Redis after startup.

### `POST /api/v1/keys`

Generates one or more keys. Send a JSON request with the following fields:

| Field    | Type    | Required | Description                                                                               |
| -------- | ------- | -------- | ----------------------------------------------------------------------------------------- |
| `bits`   | Integer | Yes      | Entropy size: `16`, `32`, `48`, `64`, `128`, or `256`.                                    |
| `format` | String  | Yes      | Output format: `hex`, `base64`, `base62`, or `uuid`.                                      |
| `prefix` | String  | No       | Optional prefix of up to 32 ASCII letters, digits, underscores, or hyphens.               |
| `count`  | Integer | No       | Number of keys to generate, from `1` to `10`. Defaults to `1` when omitted or set to `0`. |

UUID format requires `bits` to be `128`.

Example request:

```sh
curl -X POST http://localhost:3000/api/v1/keys \
  -H 'Content-Type: application/json' \
  -d '{"bits":128,"format":"hex","prefix":"sk_live_","count":2}'
```

Successful response (`200 OK`):

```json
{
  "keys": [
    {
      "value": "sk_live_<generated-key>",
      "bits": 128,
      "format": "hex",
      "level": "high"
    }
  ]
}
```

Key values are returned to the caller and are not stored by this service. Treat
them as secrets. Responses from the API are marked `Cache-Control: no-store`.

#### Errors and rate limits

| Status                      | Meaning                                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| `400 Bad Request`           | Invalid JSON or unsupported field values. The response contains an `error` message.                      |
| `429 Too Many Requests`     | The client IP exceeded the configured limit. Includes `Retry-After` and `X-RateLimit-Remaining` headers. |
| `500 Internal Server Error` | An unexpected key-generation error occurred.                                                             |

Rate limiting uses a Redis-backed fixed window and is applied per client IP.
If Redis becomes unavailable after startup, the rate-limit middleware logs the
error and allows the request to continue.

## Docker

Build and run the image from the `backend` directory:

```sh
docker build -t api-key-generator-backend .
docker run --rm \
  -p 3000:3000 \
  -e REDIS_ADDR=host.docker.internal:6379 \
  -e CORS_ORIGIN=http://localhost:5173 \
  api-key-generator-backend
```

The example Redis address works in Docker Desktop when Redis is running on the
host. Otherwise, set `REDIS_ADDR` to an address reachable from the container.
The container listens on port `3000` by default. Supply any required Redis
credentials and rate-limit settings through environment variables.

## Deploy to Render

1. Create a **Web Service** from this repository and select **Docker** as the
   runtime.
2. Set the service's **Root Directory** to `backend`, so Render builds using
   `backend/Dockerfile`.
3. Create or select a Redis instance reachable from the web service. Set
   `REDIS_ADDR` to its `host:port` address and `REDIS_PASSWORD` if required.
4. Set `CORS_ORIGIN` to the exact public frontend origin, including
   `https://` (for example, `https://app.example.com`).
5. Set the service health check path to `/healthz`.
6. Configure optional `RATE_LIMIT`, `RATE_WINDOW`, and `TRUSTED_PROXIES`
   variables as needed. Render supplies `PORT` to web services; the API reads
   that value automatically.

Keep Redis credentials private. The current Redis configuration supports an
address and password; confirm the Redis provider's network and TLS requirements
are compatible with the service configuration before selecting a provider.
