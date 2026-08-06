import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT) || 5000,
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5174').split(','),
  apiPrefix: process.env.API_PREFIX || '/api',
  jsonBodyLimit: process.env.JSON_BODY_LIMIT || '10kb',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,
  domainMetricsApiToken: process.env.DOMAIN_METRICS_API_TOKEN || '',
  moz_api_token: process.env.MOZ_API_TOKEN || '',
};
