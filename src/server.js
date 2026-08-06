import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const start = () => {
  app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  });
};
start();
