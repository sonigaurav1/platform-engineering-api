import express from 'express';

import EC2Controller from '../../../../controllers/resources/aws/ec2.controller';
import { validateRequestBody, validateRequestParams } from '../../../../middleware/validation.middleware';
import { createEC2InstanceSchema, deleteEC2InstanceSchema } from '../../../../schemas/resources/aws/ec2.schema';

const ec2Router = express.Router();

ec2Router.post('/create-instance', validateRequestBody(createEC2InstanceSchema), EC2Controller.createEC2Instance);
ec2Router.delete('/delete-instance/:resourceId', validateRequestParams(deleteEC2InstanceSchema), EC2Controller.deleteEC2Instance);

export default ec2Router;
