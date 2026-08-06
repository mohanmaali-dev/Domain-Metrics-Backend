import { env } from '../config/env.js';

export const authenticateApiToken = (request, response, next) => {
  const expectedToken = env.domainMetricsApiToken;
  const providedToken = request.headers['x-api-token'] || request.headers['x-api-key'];

  if (!expectedToken) {
    return response.status(500).json({
      success: false,
      message: 'API token not configured',
    });
  }

  if (!providedToken || providedToken !== expectedToken) {
    return response.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  return next();
};
