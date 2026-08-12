const DUMMY_METRICS = {
  last_crawled: '2024-11-04',
  http_code: 200,
  pages_to_page: 710698,
  nofollow_pages_to_page: 7073,
  redirect_pages_to_page: 812,
  external_pages_to_page: 461992,
  external_nofollow_pages_to_page: 7073,
  external_redirect_pages_to_page: 273,
  deleted_pages_to_page: 198443,
  root_domains_to_page: 10409,
  indirect_root_domains_to_page: 2107,
  deleted_root_domains_to_page: 1564,
  nofollow_root_domains_to_page: 1903,
  pages_to_subdomain: 91619477,
  nofollow_pages_to_subdomain: 13403603,
  redirect_pages_to_subdomain: 47747395,
  external_pages_to_subdomain: 67812167,
  external_nofollow_pages_to_subdomain: 13383578,
  external_redirect_pages_to_subdomain: 41154251,
  deleted_pages_to_subdomain: 19706071,
  root_domains_to_subdomain: 186553,
  deleted_root_domains_to_subdomain: 29562,
  nofollow_root_domains_to_subdomain: 38718,
  pages_to_root_domain: 93088010,
  nofollow_pages_to_root_domain: 13513706,
  redirect_pages_to_root_domain: 47753026,
  external_pages_to_root_domain: 68942297,
  external_indirect_pages_to_root_domain: 44373352,
  external_nofollow_pages_to_root_domain: 13492593,
  external_redirect_pages_to_root_domain: 41157669,
  deleted_pages_to_root_domain: 20137876,
  root_domains_to_root_domain: 188816,
  indirect_root_domains_to_root_domain: 27597,
  deleted_root_domains_to_root_domain: 30393,
  nofollow_root_domains_to_root_domain: 38829,
  page_authority: 70,
  domain_authority: 80,
  link_propensity: 0.01030706428,
  spam_score: 3,
  root_domains_from_page: 6,
  nofollow_root_domains_from_page: 0,
  pages_from_page: 8,
  nofollow_pages_from_page: 0,
  root_domains_from_root_domain: 83316,
  nofollow_root_domains_from_root_domain: 69184,
  pages_from_root_domain: 398300,
  nofollow_pages_from_root_domain: 261292,
  pages_crawled_from_root_domain: 8083388,
};

const parseQuery = ({ query, scope }) => {
  const inputUrl = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(query) ? query : `https://${query}`);
  const hostname = inputUrl.hostname.replace(/^www\./, '');
  const parts = hostname.split('.');
  const rootDomain = parts.slice(-2).join('.');

  let parsedUrl = inputUrl;

  if (scope === 'domain') {
    parsedUrl = new URL(`https://${rootDomain}`);
  } else if (scope === 'subdomain') {
    parsedUrl = new URL(`https://${hostname}`);
  }

  const parsedQuery = parsedUrl.href.replace(/\/$/, '');
  const page = `${parsedUrl.hostname}${parsedUrl.pathname === '/' ? '' : parsedUrl.pathname}`;

  return {
    parsedQuery,
    page,
    hostname,
    rootDomain,
  };
};

const createDummyResult = (siteQuery) => {
  const { parsedQuery, page, hostname, rootDomain } = parseQuery(siteQuery);

  return {
    site_query: {
      query: parsedQuery,
      scope: siteQuery.scope,
      original_site_query: {
        query: siteQuery.query,
        scope: siteQuery.scope,
      },
      site_query_suggestion: null,
    },
    site_metrics: {
      page,
      subdomain: hostname,
      root_domain: rootDomain,
      title: `Dummy metrics for ${hostname}`,
      ...DUMMY_METRICS,
    },
  };
};

export const getDummyDomainMetrics = (siteQuery) => createDummyResult(siteQuery);

export const getDummyMultipleDomainMetrics = (siteQueries) => ({
  results_by_site: siteQueries.map(createDummyResult),
  errors_by_site: [],
});
