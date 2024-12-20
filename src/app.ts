import express from 'express';

import { startApp } from './server';

import type { Express } from 'express';

const initialize = async (): Promise<void> => {
  const app: Express = express();

  // start the notification server
  startApp(app);
};

initialize();
