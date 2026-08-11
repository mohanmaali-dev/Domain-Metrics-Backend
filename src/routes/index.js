import { Router } from 'express';

import { getDomainMetrics } from '../controllers/domainMetricsController.js';
import { verifyMozToken } from '../middlewares/verify-moz-token.middleware.js';

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

apiRouter.post('/', verifyMozToken, getDomainMetrics);
