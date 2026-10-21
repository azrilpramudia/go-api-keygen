# API Key Generator Frontend

React and TypeScript frontend for the API Key Generator. It provides a
responsive interface for configuring key generation, viewing and copying
results, and downloading keys as `.txt` or `.env` files.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- The API Key Generator backend for key generation

## Run locally

Run these commands from the `frontend` directory:

```sh
npm install
npm run dev
```

Open `http://localhost:5173`. During development, Vite proxies `/api` requests
to `http://localhost:3000`. Start the backend on that address, or update the
proxy in `vite.config.ts` if your backend uses another local address.

## Configuration

| Variable       | Description                                                                                                                                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_URL` | Optional base URL for the backend API. Leave unset to use the current origin. Set it to the backend's public origin when frontend and backend are hosted separately, for example `https://api.example.com`. Do not include a trailing slash. |

Create a `.env.local` file in the `frontend` directory for local overrides:

```dotenv
VITE_API_URL=http://localhost:3000
```

Vite only exposes variables prefixed with `VITE_` to frontend code. Never put
secrets or private credentials in frontend environment variables.

## Available scripts

| Command           | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `npm run dev`     | Start the Vite development server on port `5173`.                |
| `npm run build`   | Type-check the project and create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally for review.                   |
| `npm run lint`    | Run ESLint on the frontend.                                      |

## Features

- Configure entropy (`16`, `32`, `48`, `64`, `128`, or `256` bits), output
  format (`hex`, `base64`, `base62`, or `UUID v4`), optional prefix, and key
  count.
- Generate up to 10 keys per request. Prefixes may contain ASCII letters,
  numbers, underscores, and hyphens, up to 32 characters.
- View, mask, copy, and download generated keys.
- Toggle between light and dark themes. The theme preference is saved in the
  browser's local storage.
- Use a responsive layout with a single-viewport design.

Generated keys are shown only once and are not saved by the frontend. Treat
them as secrets and avoid generating production credentials on a public or
untrusted deployment.

## Deploy to Vercel

1. Import the repository into Vercel.
2. Set the **Root Directory** to `frontend`.
3. Use the following build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Add `VITE_API_URL` as a project environment variable and set it to the
   backend's public origin, such as `https://api.example.com`.
5. Deploy the project.
6. Configure the backend's `CORS_ORIGIN` to match the deployed frontend origin
   exactly, including `https://` and any custom domain.

The Vite development proxy is for local development only. Production requests
use `VITE_API_URL`; ensure the backend is reachable from users' browsers and
allows the deployed frontend origin through CORS.
