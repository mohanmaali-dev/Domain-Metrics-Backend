import {
  getDummyDomainMetrics,
  getDummyMultipleDomainMetrics,
} from '../services/domainMetricsService.js';

const SINGLE_METHOD = 'data.site.metrics.fetch';
const MULTIPLE_METHOD = 'data.site.metrics.fetch.multiple';
const METHODS = [SINGLE_METHOD, MULTIPLE_METHOD];
const SCOPES = ['domain', 'subdomain', 'subfolder', 'url'];

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

const isValidSiteQuery = (value) => {
  if (typeof value !== 'string' || value.trim() === '' || /\s/.test(value)) return false;

  try {
    const query = /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(query);

    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.');
  } catch {
    return false;
  }
};

const isValidQuery = (siteQuery, allowedScopes) =>
  isValidSiteQuery(siteQuery?.query) && allowedScopes.includes(siteQuery.scope);

export const getDomainMetrics = (request, response) => {
  const body = request.body;
  const id = isValidId(body?.id) ? body.id : null;

  if (!body || Array.isArray(body) || body.jsonrpc !== '2.0' || !isValidId(body.id)) {
    return sendError(response, id, 400, -32600, 'Invalid JSON-RPC request');
  }

  if (!METHODS.includes(body.method)) {
    return sendError(response, id, 404, -32601, 'Method not found');
  }

  const data = body.params?.data;

  if (body.method === SINGLE_METHOD && !isValidQuery(data?.site_query, SCOPES)) {
    return sendError(
      response,
      id,
      400,
      -32602,
      'site_query must contain a valid query with domain, subdomain, subfolder, or url scope',
    );
  }

  if (body.method === MULTIPLE_METHOD) {
    const siteQueries = data?.site_queries;
    const allQueriesAreValid =
      Array.isArray(siteQueries) &&
      siteQueries.length > 0 &&
      siteQueries.every((siteQuery) => isValidQuery(siteQuery, SCOPES));

    if (!allQueriesAreValid) {
      return sendError(
        response,
        id,
        400,
        -32602,
        'site_queries must contain valid queries with domain, subdomain, subfolder, or url scope',
      );
    }

    return response.status(200).json(getDummyMultipleDomainMetrics(siteQueries));
  }

  return response.status(200).json(getDummyDomainMetrics(data.site_query));
};
