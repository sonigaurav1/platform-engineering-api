import express from 'express';

import ec2Router from './ec2.routes';
import awsResourceRouter from './resource.routes';

const awsRouter = express.Router();

awsRouter.use('/ec2', ec2Router);
awsRouter.use('/resource', awsResourceRouter);

export default awsRouter;
