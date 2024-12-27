import express from 'express';

import ec2Router from './ec2.routes';

const awsRouter = express.Router();

awsRouter.use('/ec2', ec2Router);

export default awsRouter;
