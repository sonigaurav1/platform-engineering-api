import dotenv from 'dotenv';
import express from 'express';

import type { Express, Request, Response } from 'express';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (_req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.debug(`[server]: Server is running at http://localhost:${port}`);
});
