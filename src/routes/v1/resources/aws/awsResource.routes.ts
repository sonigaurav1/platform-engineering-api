import express from 'express';

import AWSResourceController from '../../../../controllers/resources/aws/awsResource.controller';

const awsResourceRouter = express.Router();

awsResourceRouter.post('/save-ami', AWSResourceController.saveAWSAmi);
awsResourceRouter.post('/save-instance-type', AWSResourceController.saveAWSInstanceType);
awsResourceRouter.get('/list-ami', AWSResourceController.getAMIsList);
awsResourceRouter.get('/list-instance-type', AWSResourceController.getInstanceTypeList);

export default awsResourceRouter;
