import express from 'express';

import AWSResourceController from '../../../../controllers/resources/aws/resource.controller';

const awsResourceRouter = express.Router();

awsResourceRouter.get('/list-ami', AWSResourceController.getAMIsList);
awsResourceRouter.post('/save-ami', AWSResourceController.saveAWSAmi);

export default awsResourceRouter;
