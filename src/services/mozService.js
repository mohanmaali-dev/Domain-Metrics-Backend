import { env } from '../config/env.js';

const getStaticDomainMetrics = (domain) => {
  void domain;

  return {
    domainAuthority: 90,
    pageAuthority: 98,
    spamScore: 2,
    linkingDomains: 250000,
    inboundLinks: 1800000,
    domainAge: 20,
  };
};

const mapMozResponse = (payload) => {
  const metrics = payload?.site_metrics ?? {};

  return {
    domainAuthority: metrics.domain_authority ?? metrics.domainAuthority ?? null,
    pageAuthority: metrics.page_authority ?? metrics.pageAuthority ?? null,
    spamScore: metrics.spam_score ?? metrics.spamScore ?? null,
    linkingDomains: metrics.root_domains_to_root_domain ?? metrics.linking_domains ?? null,
    inboundLinks: metrics.pages_to_root_domain ?? metrics.inbound_links ?? null,
    domainAge: metrics.last_crawled ?? null,
    title: metrics.title ?? null,
    // raw: payload,
  };
};

const getMOZDomainMetrics = async (domain) => {
  const response = await fetch('https://api.moz.com/jsonrpc', {
    method: 'POST',
    headers: {
      'x-moz-token': env.moz_api_token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: '07a506a9-7e53-4dec-8ed9-0d9297ba7d35',
      method: 'data.site.metrics.fetch',
      params: {
        data: {
          site_query: {
            query: domain,
            scope: 'domain',
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Moz API request failed');
  }

  const data = await response.json();
  const payload = data?.result ?? data;

  return mapMozResponse(payload);
};

export const getDomainMetrics = async (domain) => {
  if (!env.moz_api_token) {
    return getStaticDomainMetrics(domain);
  }

  try {
    return await getMOZDomainMetrics(domain);
  } catch {
    throw new Error('Failed to fetch domain metrics from Moz API');
  }
};