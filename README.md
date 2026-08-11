# Backend API for Domain Metrics

This backend accepts a Moz-style JSON-RPC request and returns fixed dummy domain metrics.

## Features

- Health check endpoint
- Dummy domain metrics endpoint

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
MOZ_API_TOKEN=replace-with-your-secret-token
```

No external Moz API request is made.

The endpoint compares the `x-moz-token` header with `MOZ_API_TOKEN`, then validates
the JSON-RPC version, request ID, method, site URL, and domain scope before returning
the dummy response.

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
POST /api
```

#### Request headers

```http
Content-Type: application/json
x-moz-token: YOUR_MOZ_TOKEN
```

#### Request body

```json
{
  "jsonrpc": "2.0",
  "id": "633c0095-a295-4dfc-a33b-101a3f769176",
  "method": "data.site.metrics.fetch",
  "params": {
    "data": {
      "site_query": {
        "query": "https://moz.com/blog",
        "scope": "domain"
      }
    }
  }
}
```

#### Success response

The endpoint always returns the same dummy response with every field included.

```json
{
  "site_query": {
    "query": "https://moz.com",
    "scope": "domain",
    "original_site_query": {
      "query": "moz.com",
      "scope": "domain"
    },
    "site_query_suggestion": null
  },
  "site_metrics": {
    "page": "moz.com",
    "subdomain": "moz.com",
    "root_domain": "moz.com",
    "title": "The Moz Blog",
    "last_crawled": "2023-06-01",
    "http_code": 200,
    "pages_to_page": 123,
    "nofollow_pages_to_page": 5,
    "redirect_pages_to_page": 10,
    "external_pages_to_page": 100,
    "external_nofollow_pages_to_page": 3,
    "external_redirect_pages_to_page": 8,
    "deleted_pages_to_page": 2,
    "root_domains_to_page": 50,
    "indirect_root_domains_to_page": 15,
    "deleted_root_domains_to_page": 1,
    "nofollow_root_domains_to_page": 2,
    "pages_to_subdomain": 500,
    "nofollow_pages_to_subdomain": 20,
    "redirect_pages_to_subdomain": 40,
    "external_pages_to_subdomain": 400,
    "external_nofollow_pages_to_subdomain": 15,
    "external_redirect_pages_to_subdomain": 30,
    "deleted_pages_to_subdomain": 10,
    "root_domains_to_subdomain": 100,
    "deleted_root_domains_to_subdomain": 5,
    "nofollow_root_domains_to_subdomain": 10,
    "pages_to_root_domain": 5000,
    "nofollow_pages_to_root_domain": 200,
    "redirect_pages_to_root_domain": 400,
    "external_pages_to_root_domain": 4000,
    "external_indirect_pages_to_root_domain": 1000,
    "external_nofollow_pages_to_root_domain": 150,
    "external_redirect_pages_to_root_domain": 300,
    "deleted_pages_to_root_domain": 100,
    "root_domains_to_root_domain": 500,
    "indirect_root_domains_to_root_domain": 200,
    "deleted_root_domains_to_root_domain": 50,
    "nofollow_root_domains_to_root_domain": 100,
    "page_authority": 45,
    "domain_authority": 55,
    "link_propensity": 0.8,
    "spam_score": 2,
    "root_domains_from_page": 10,
    "nofollow_root_domains_from_page": 1,
    "pages_from_page": 50,
    "nofollow_pages_from_page": 5,
    "root_domains_from_root_domain": 1000,
    "nofollow_root_domains_from_root_domain": 100,
    "pages_from_root_domain": 5000,
    "nofollow_pages_from_root_domain": 500,
    "pages_crawled_from_root_domain": 10000
  }
}
```
