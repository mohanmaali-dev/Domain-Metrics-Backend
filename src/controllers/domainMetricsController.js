import { getDummyDomainMetrics } from '../services/domainMetricsService.js';

const METHOD = 'data.site.metrics.fetch';

const sendError = (response, id, status, code, message) =>
  response.status(status).json({
    jsonrpc: '2.0',
    id,
    error: { code, message },
  });

const isValidId = (id) =>
  id === null ||
  (typeof id === 'string' && id.trim() !== '') ||
  (typeof id === 'number' && Number.isFinite(id));

const isValidUrl = (value) => {
  if (typeof value !== 'string' || value.trim() === '') return false;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const getDomainMetrics = (request, response) => {
  const body = request.body;
  const id = isValidId(body?.id) ? body.id : null;

  if (!body || Array.isArray(body) || body.jsonrpc !== '2.0' || !isValidId(body.id)) {
    return sendError(response, id, 400, -32600, 'Invalid JSON-RPC request');
  }

  if (body.method !== METHOD) {
    return sendError(response, id, 404, -32601, 'Method not found');
  }

  const siteQuery = body.params?.data?.site_query;

  if (!isValidUrl(siteQuery?.query) || siteQuery?.scope !== 'domain') {
    return sendError(response, id, 400, -32602, 'A valid site query and domain scope are required');
  }

  return response.status(200).json(getDummyDomainMetrics());
};
