import { Router } from 'express';

import { getDomainMetrics } from '../controllers/domainMetricsController.js';
import { authenticateApiToken } from '../middlewares/authenticate-api.middleware.js';

export const domainMetricsRouter = Router();

domainMetricsRouter.post('/', authenticateApiToken, getDomainMetrics);
