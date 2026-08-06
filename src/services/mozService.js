import { env } from '../config/env.js';

const getStaticDomainMetrics = (domain) => {
    void domain;

    return {
        domain_authority: 94,
        page_authority: 98,
        spam_score: 2,
        linking_domains: 250000,
        inbound_links: 1800000,
        domainAge: 20,
    };
};

const getDomainMetricsFromOpenPage = async (domain) => {
    void domain;
    const resp = await fetch("https://openpagerank.keywordseverywhere.com/v1/domains/bulk", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${env.open_page_rank_api_token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            domains: [domain],
            include_history: true,
        }),
    });
    const data = await resp.json();
    data.results.forEach((r) => console.log(r.domain, r.open_page_rank));
    console.log("data.results[0].open_page_rank", data.results[0]);
    const result = data.results[0];
    return {
        domain_authority: result.open_page_rank,
        page_authority: null,
        spam_score: null,
        linking_domains: null,
        inbound_links: null,
        domainAge: null,
    };
}

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
    const result = data?.result || {};

    return {
        domain_authority: result?.domain_authority,
        page_authority: result?.page_authority,
        spam_score: result?.spam_score ?? 2,
        linking_domains: result?.linking_domains,
        inbound_links: result?.inbound_links,
        domainAge: result?.domainAge,
    };
}






export const getDomainMetrics = async (domain) => {
    if (!env.moz_api_token) {
        return getStaticDomainMetrics(domain);
    }
    try {
        // const mozMetrics = await getMOZDomainMetrics(domain);
        //   return mozMetrics
        const openPageMetrics = await getDomainMetricsFromOpenPage(domain);
        return openPageMetrics;

    } catch {
        throw new Error('Failed to fetch domain metrics from Moz API');
    }
};