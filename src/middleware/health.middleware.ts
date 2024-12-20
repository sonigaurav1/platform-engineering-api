import type { Application, Response, Request } from 'express';

const healthCheckMiddleware = (app: Application): void => {
  app.use('/health', (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Avendi Notification server is healthy' });
  });
};

export default healthCheckMiddleware;
