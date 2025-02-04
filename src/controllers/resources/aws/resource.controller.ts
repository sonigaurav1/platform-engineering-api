import AWSResourceService from '../../../services/resources/aws/resource.service';

import type { CustomRequest } from '../../../interfaces/auth.interface';
import type { NextFunction, Response } from 'express';

const saveAWSAmi = async (_req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const response = await AWSResourceService.saveAWSAmi();
    res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    next(error);
  }
};

const getAMIsList = async (_req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const response = await AWSResourceService.getAMIsList();
    res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    next(error);
  }
};

const AWSResourceController = {
  getAMIsList,
  saveAWSAmi,
};

export default AWSResourceController;
