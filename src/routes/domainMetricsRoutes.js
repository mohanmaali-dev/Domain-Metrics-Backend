import { Router } from 'express';

import { getDomainMetrics } from '../controllers/domainMetricsController.js';
import { authenticateApiToken } from '../middlewares/authenticate-api.middleware.js';

export const domainMetricsRouter = Router();


// Remove the authentication middleware if you want to allow public access to this endpoint. Otherwise, keep it to restrict access to authorized users only.
domainMetricsRouter.post('/', authenticateApiToken, getDomainMetrics);
