import cors from 'cors';
import helmet from 'helmet';

import corsConfig from '../configs/cors.config';

import type { Application } from 'express';

const securityMiddleware = (app: Application): void => {
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors(corsConfig));
  app.options('*', (_req, res) => {
    res.set({
      'Access-Control-Allow-Origin': 'http://localhost:5173', // CORS policy only allows a single origin or a wildcard (*, which is not allowed when credentials: true).
      'Access-Control-Allow-Methods': `${corsConfig.methods}`,
      'Access-Control-Allow-Headers': `${corsConfig.allowedHeaders}`,
      'Access-Control-Allow-Credentials': `${corsConfig.credentials}`,
    });
    res.sendStatus(200);
  });
};

export default securityMiddleware;
