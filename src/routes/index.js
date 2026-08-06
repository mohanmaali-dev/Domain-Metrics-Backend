import { Router } from 'express';

import { domainMetricsRouter } from './domainMetricsRoutes.js';

export const apiRouter = Router();

apiRouter.get('/health', (_request, response) => {
  response.status(200).json({
    success: true,
    message: 'Service is healthy',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    meta: {},
  });
});

apiRouter.use('/domain-metrics', domainMetricsRouter);
