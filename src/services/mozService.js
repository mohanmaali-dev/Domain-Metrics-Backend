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

export const getDomainMetrics = async (domain) => {
    if (!env.moz_api_token) {
        return getStaticDomainMetrics(domain);
    }
    try {
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
    } catch {
        throw new Error('Failed to fetch domain metrics from Moz API');
    }
};