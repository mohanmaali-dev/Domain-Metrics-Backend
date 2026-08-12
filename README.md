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
the JSON-RPC version, request ID, method, site URL, and selected scope before returning
the dummy response.

The single-site query accepts both `https://moz.com/blog` and `moz.com/blog`, with
`domain`, `subdomain`, `subfolder`, or `url` scope.

For multiple sites, use method `data.site.metrics.fetch.multiple` and provide a
non-empty `params.data.site_queries` array. Each item accepts `domain`, `subdomain`,
`subfolder`, or `url` scope.

Because this is a dummy API, every submitted site receives the same static metric
values. The response count, URL, scope, page, subdomain, and root domain are generated
from the submitted queries.

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

### Single-site metrics

#### Endpoint

```http
POST /api
```

#### Headers

```http
Content-Type: application/json
x-moz-token: YOUR_MOZ_TOKEN
```

#### Request

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

#### Response

The endpoint returns dummy metrics with every field included.

```json
{
  "site_query": {
    "query": "https://moz.com",
    "scope": "domain",
    "original_site_query": {
      "query": "https://moz.com/blog",
      "scope": "domain"
    },
    "site_query_suggestion": null
  },
  "site_metrics": {
    "page": "moz.com",
    "subdomain": "moz.com",
    "root_domain": "moz.com",
    "title": "Dummy metrics for moz.com",
    "last_crawled": "2024-11-04",
    "http_code": 200,
    "pages_to_page": 710698,
    "nofollow_pages_to_page": 7073,
    "redirect_pages_to_page": 812,
    "external_pages_to_page": 461992,
    "external_nofollow_pages_to_page": 7073,
    "external_redirect_pages_to_page": 273,
    "deleted_pages_to_page": 198443,
    "root_domains_to_page": 10409,
    "indirect_root_domains_to_page": 2107,
    "deleted_root_domains_to_page": 1564,
    "nofollow_root_domains_to_page": 1903,
    "pages_to_subdomain": 91619477,
    "nofollow_pages_to_subdomain": 13403603,
    "redirect_pages_to_subdomain": 47747395,
    "external_pages_to_subdomain": 67812167,
    "external_nofollow_pages_to_subdomain": 13383578,
    "external_redirect_pages_to_subdomain": 41154251,
    "deleted_pages_to_subdomain": 19706071,
    "root_domains_to_subdomain": 186553,
    "deleted_root_domains_to_subdomain": 29562,
    "nofollow_root_domains_to_subdomain": 38718,
    "pages_to_root_domain": 93088010,
    "nofollow_pages_to_root_domain": 13513706,
    "redirect_pages_to_root_domain": 47753026,
    "external_pages_to_root_domain": 68942297,
    "external_indirect_pages_to_root_domain": 44373352,
    "external_nofollow_pages_to_root_domain": 13492593,
    "external_redirect_pages_to_root_domain": 41157669,
    "deleted_pages_to_root_domain": 20137876,
    "root_domains_to_root_domain": 188816,
    "indirect_root_domains_to_root_domain": 27597,
    "deleted_root_domains_to_root_domain": 30393,
    "nofollow_root_domains_to_root_domain": 38829,
    "page_authority": 70,
    "domain_authority": 90,
    "link_propensity": 0.01030706428,
    "spam_score": 3,
    "root_domains_from_page": 6,
    "nofollow_root_domains_from_page": 0,
    "pages_from_page": 8,
    "nofollow_pages_from_page": 0,
    "root_domains_from_root_domain": 83316,
    "nofollow_root_domains_from_root_domain": 69184,
    "pages_from_root_domain": 398300,
    "nofollow_pages_from_root_domain": 261292,
    "pages_crawled_from_root_domain": 8083388
  }
}
```

### Multiple-site metrics

#### Endpoint

```http
POST /api
```

#### Headers

```http
Content-Type: application/json
x-moz-token: YOUR_MOZ_TOKEN
```

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "b2aa846d-a77f-4468-9a4e-811ce6e0a5b2",
  "method": "data.site.metrics.fetch.multiple",
  "params": {
    "data": {
      "site_queries": [
        {
          "query": "https://moz.com/",
          "scope": "domain"
        },
        {
          "query": "moz.com/blog",
          "scope": "url"
        }
      ]
    }
  }
}
```

#### Response

```json
{
  "results_by_site": [
    {
      "site_query": {
        "query": "https://moz.com",
        "scope": "domain",
        "original_site_query": {
          "query": "https://moz.com/",
          "scope": "domain"
        },
        "site_query_suggestion": null
      },
      "site_metrics": {
        "page": "moz.com",
        "subdomain": "moz.com",
        "root_domain": "moz.com",
        "title": "Dummy metrics for moz.com",
        "last_crawled": "2024-11-04",
        "http_code": 200,
        "pages_to_page": 710698,
        "nofollow_pages_to_page": 7073,
        "redirect_pages_to_page": 812,
        "external_pages_to_page": 461992,
        "external_nofollow_pages_to_page": 7073,
        "external_redirect_pages_to_page": 273,
        "deleted_pages_to_page": 198443,
        "root_domains_to_page": 10409,
        "indirect_root_domains_to_page": 2107,
        "deleted_root_domains_to_page": 1564,
        "nofollow_root_domains_to_page": 1903,
        "pages_to_subdomain": 91619477,
        "nofollow_pages_to_subdomain": 13403603,
        "redirect_pages_to_subdomain": 47747395,
        "external_pages_to_subdomain": 67812167,
        "external_nofollow_pages_to_subdomain": 13383578,
        "external_redirect_pages_to_subdomain": 41154251,
        "deleted_pages_to_subdomain": 19706071,
        "root_domains_to_subdomain": 186553,
        "deleted_root_domains_to_subdomain": 29562,
        "nofollow_root_domains_to_subdomain": 38718,
        "pages_to_root_domain": 93088010,
        "nofollow_pages_to_root_domain": 13513706,
        "redirect_pages_to_root_domain": 47753026,
        "external_pages_to_root_domain": 68942297,
        "external_indirect_pages_to_root_domain": 44373352,
        "external_nofollow_pages_to_root_domain": 13492593,
        "external_redirect_pages_to_root_domain": 41157669,
        "deleted_pages_to_root_domain": 20137876,
        "root_domains_to_root_domain": 188816,
        "indirect_root_domains_to_root_domain": 27597,
        "deleted_root_domains_to_root_domain": 30393,
        "nofollow_root_domains_to_root_domain": 38829,
        "page_authority": 70,
        "domain_authority": 90,
        "link_propensity": 0.01030706428,
        "spam_score": 3,
        "root_domains_from_page": 6,
        "nofollow_root_domains_from_page": 0,
        "pages_from_page": 8,
        "nofollow_pages_from_page": 0,
        "root_domains_from_root_domain": 83316,
        "nofollow_root_domains_from_root_domain": 69184,
        "pages_from_root_domain": 398300,
        "nofollow_pages_from_root_domain": 261292,
        "pages_crawled_from_root_domain": 8083388
      }
    },
    {
      "site_query": {
        "query": "https://moz.com/blog",
        "scope": "url",
        "original_site_query": {
          "query": "moz.com/blog",
          "scope": "url"
        },
        "site_query_suggestion": null
      },
      "site_metrics": {
        "page": "moz.com/blog",
        "subdomain": "moz.com",
        "root_domain": "moz.com",
        "title": "Dummy metrics for moz.com",
        "last_crawled": "2024-11-04",
        "http_code": 200,
        "pages_to_page": 710698,
        "nofollow_pages_to_page": 7073,
        "redirect_pages_to_page": 812,
        "external_pages_to_page": 461992,
        "external_nofollow_pages_to_page": 7073,
        "external_redirect_pages_to_page": 273,
        "deleted_pages_to_page": 198443,
        "root_domains_to_page": 10409,
        "indirect_root_domains_to_page": 2107,
        "deleted_root_domains_to_page": 1564,
        "nofollow_root_domains_to_page": 1903,
        "pages_to_subdomain": 91619477,
        "nofollow_pages_to_subdomain": 13403603,
        "redirect_pages_to_subdomain": 47747395,
        "external_pages_to_subdomain": 67812167,
        "external_nofollow_pages_to_subdomain": 13383578,
        "external_redirect_pages_to_subdomain": 41154251,
        "deleted_pages_to_subdomain": 19706071,
        "root_domains_to_subdomain": 186553,
        "deleted_root_domains_to_subdomain": 29562,
        "nofollow_root_domains_to_subdomain": 38718,
        "pages_to_root_domain": 93088010,
        "nofollow_pages_to_root_domain": 13513706,
        "redirect_pages_to_root_domain": 47753026,
        "external_pages_to_root_domain": 68942297,
        "external_indirect_pages_to_root_domain": 44373352,
        "external_nofollow_pages_to_root_domain": 13492593,
        "external_redirect_pages_to_root_domain": 41157669,
        "deleted_pages_to_root_domain": 20137876,
        "root_domains_to_root_domain": 188816,
        "indirect_root_domains_to_root_domain": 27597,
        "deleted_root_domains_to_root_domain": 30393,
        "nofollow_root_domains_to_root_domain": 38829,
        "page_authority": 70,
        "domain_authority": 90,
        "link_propensity": 0.01030706428,
        "spam_score": 3,
        "root_domains_from_page": 6,
        "nofollow_root_domains_from_page": 0,
        "pages_from_page": 8,
        "nofollow_pages_from_page": 0,
        "root_domains_from_root_domain": 83316,
        "nofollow_root_domains_from_root_domain": 69184,
        "pages_from_root_domain": 398300,
        "nofollow_pages_from_root_domain": 261292,
        "pages_crawled_from_root_domain": 8083388
      }
    }
  ],
  "errors_by_site": []
}
```
