import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { corsOptions } from './config/cors.js';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFoundHandler } from './middlewares/not-found.middleware.js';
import { globalRateLimiter } from './middlewares/rate-limit.middleware.js';
import { apiRouter } from './routes/index.js';

const app = express();
// app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors(corsOptions));
app.use(compression());

app.use(globalRateLimiter);
app.use(express.json({ limit: env.jsonBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: env.jsonBodyLimit }));

app.use(morgan('dev'));

app.use(env.apiPrefix, apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
