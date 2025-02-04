import express from 'express';

import awsResourceRouter from './awsResource.routes';
import ec2Router from './ec2.routes';

const awsRouter = express.Router();

awsRouter.use('/ec2', ec2Router);
awsRouter.use('/resource', awsResourceRouter);

export default awsRouter;
