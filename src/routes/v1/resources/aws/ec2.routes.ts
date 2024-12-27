import express from 'express';

import EC2Controller from '../../../../controllers/resources/aws/ec2.controller';

const ec2Router = express.Router();

ec2Router.post('/create-instance', EC2Controller.createEC2Instance);

export default ec2Router;
