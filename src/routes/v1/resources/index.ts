import express from 'express';

import { attachUserInfo, authenticationMiddleware } from '../../../middleware/auth.middleware';

import awsRouter from './aws';

const resourceRouter = express.Router();

resourceRouter.use('/aws', authenticationMiddleware, attachUserInfo, awsRouter);

export default resourceRouter;
