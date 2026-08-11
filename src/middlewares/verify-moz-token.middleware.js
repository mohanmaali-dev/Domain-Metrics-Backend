import { timingSafeEqual } from 'node:crypto';

import { env } from '../config/env.js';

const sendError = (request, response, status, code, message) =>
  response.status(status).json({
    jsonrpc: '2.0',
    id: request.body?.id ?? null,
    error: { code, message },
  });

const tokensMatch = (providedToken, expectedToken) => {
  const provided = Buffer.from(providedToken);
  const expected = Buffer.from(expectedToken);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
};

export const verifyMozToken = (request, response, next) => {
  const expectedToken = env.mozApiToken;
  const providedToken = request.get('x-moz-token')?.trim();

  if (!expectedToken) {
    return sendError(request, response, 500, -32603, 'MOZ_API_TOKEN is not configured');
  }

  if (!providedToken || !tokensMatch(providedToken, expectedToken)) {
    return sendError(request, response, 401, -32001, 'Invalid x-moz-token');
  }

  return next();
};
