# API Key Generator

A full-stack application for generating cryptographically secure API keys.
Choose the entropy size and output format, add an optional prefix, and generate
up to 10 keys per request. The frontend supports copying, masking, and
downloading generated keys, as well as light and dark themes.

Generated keys are returned once and are not stored by the backend. Treat them
as secrets; use a trusted deployment for production credentials.

## Project structure

```text
backend/   Go REST API and Redis-backed rate limiting
frontend/  React, TypeScript, and Vite web application
```

See the component-specific documentation for setup, configuration, API details,
and deployment:

- [Backend documentation](./backend/README.md)
- [Frontend documentation](./frontend/README.md)

## Requirements

- Go 1.27.1 or newer
- Node.js 20.19+ or 22.12+ and npm
- Docker Compose (for running Redis locally), or another Redis instance

## Run locally

Start Redis from the repository root:

```sh
docker compose up -d redis
```

In a terminal, start the API from the `backend` directory:

```sh
REDIS_ADDR=localhost:6379 go run ./cmd/api
```

The API listens on `http://localhost:3000` by default. In a second terminal,
start the frontend from the `frontend` directory:

```sh
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite development server proxies API requests
to the local backend.

To stop the local Redis service, run `docker compose down` from the repository
root.

## API overview

| Method | Endpoint       | Description                    |
| ------ | -------------- | ------------------------------ |
| `GET`  | `/health`      | Basic HTTP health check.       |
| `POST` | `/api/v1/keys` | Generate one or more API keys. |

Example request:

```sh
curl -X POST http://localhost:3000/api/v1/keys \
  -H 'Content-Type: application/json' \
  -d '{"bits":128,"format":"hex","prefix":"sk_live_","count":2}'
```

Supported formats are `hex`, `base64`, `base62`, and `uuid`. Entropy sizes are
`16`, `32`, `48`, `64`, `128`, or `256` bits. UUID format requires `128` bits.
For full request and response details, validation rules, and configuration, see
the [backend documentation](./backend/README.md).

## Tests and checks

Run backend tests:

```sh
cd backend
go test ./...
```

Build and lint the frontend:

```sh
cd frontend
npm run build
npm run lint
```

## Deployment

The frontend and backend can be deployed separately. A common setup is Vercel
for the frontend and Render for the backend. Configure the frontend's
`VITE_API_URL` with the public backend origin, and set the backend's
`CORS_ORIGIN` to the exact public frontend origin. The backend also requires a
reachable Redis instance.

See the [frontend deployment guide](./frontend/README.md#deploy-to-vercel) and
[backend deployment guide](./backend/README.md#deploy-to-render) for details.
