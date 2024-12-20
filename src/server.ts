import http from 'http';

import 'dotenv/config';

import { SERVER_DETAILS } from './config/server.config';
import errorMiddleware from './middleware/error.middleware';
import healthCheckMiddleware from './middleware/health.middleware';
import routesMiddleware from './middleware/routes.middleware';
import securityMiddleware from './middleware/security.middleware';
import standardMiddleware from './middleware/standard.middleware';
import log from './utils/logger';

import type { Application } from 'express';

const appName = 'Platform Engineering API';

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);

    // Logging server information
    log.info(`${appName} server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_DETAILS.PORT, () => {
      log.info(`${appName} server running on port ${SERVER_DETAILS.PORT}`);
      log.info(`${appName} server url: http://localhost:${SERVER_DETAILS.PORT}`);
    });

    // Handling graceful Shutdown
    process.on('SIGTERM', () => {
      log.info('SIGTERM received. Closing server...');
      httpServer.close(() => log.info('Server closed.'));
    });

    process.on('SIGINT', () => {
      log.info('SIGINT received. Closing server...');
      httpServer.close(() => log.info('Server closed.'));
    });
  } catch (error) {
    log.error(`${appName} startServer() method error:`, error);
  }
};

export function startApp(app: Application): void {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  healthCheckMiddleware(app);
  startServer(app);
  errorMiddleware(app);
}
