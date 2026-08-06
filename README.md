# Backend API for Domain Metrics

This backend provides a simple API to fetch domain metrics for a given website.

## Features

- Health check endpoint
- Domain metrics endpoint protected by an API token

## Prerequisites

- Node.js 24
- npm

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

## Environment Variables

Add the following values to your `.env` file:

```env
PORT=5000
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000
API_PREFIX=/api
JSON_BODY_LIMIT=10kb
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
DOMAIN_METRICS_API_TOKEN=YOUR_SECRET_TOKEN
MOZ_API_TOKEN=
```

### What to provide

- `DOMAIN_METRICS_API_TOKEN`: a secret token used to protect the metrics API.
- `MOZ_API_TOKEN`: token for real Moz-style API integration. If empty, the service will fall back to safe demo data.

## Run the server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on the port defined by `PORT`.

## API Endpoints

### Health check
```http
GET /api/health
```

### Domain metrics
```http
POST /api/domain-metrics
```

#### Request headers
```http
Content-Type: application/json
X-API-Token: YOUR_SECRET_TOKEN
```

#### Request body
```json
{
  "domain": "example.com"
}
```

#### Success response
```json
{
  "success": true,
  "data": {
    "domain": "example.com",
    "authority": 0,
    "domainAuthority": 0,
    "pageAuthority": 0,
    "mozRank": 0,
    "spamScore": 0,
    "externalLinks": 0,
    "internalLinks": 0,
    "title": "Example Domain"
  }
}
```

## Notes

- The metrics endpoint requires a valid `X-API-Token` header.
- If `MOZ_API_TOKEN` is not configured, the service returns safe fallback data instead of failing.
