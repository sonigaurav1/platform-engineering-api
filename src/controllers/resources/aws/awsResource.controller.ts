import { DynamicMessages } from '../../../constants/error';
import AWSResourceService from '../../../services/resources/aws/awsResource.service';

import type { CustomRequest } from '../../../interfaces/auth.interface';
import type { NextFunction, Response } from 'express';

const saveAWSAmi = async (_req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const response = await AWSResourceService.saveAWSAmi();
    res.status(200).json({
      success: true,
      response,
      message: DynamicMessages.createMessage('Aws ami'),
    });
  } catch (error) {
    next(error);
  }
};

const saveAWSInstanceType = async (_req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const response = await AWSResourceService.saveAWSInstanceType();
    res.status(200).json({
      success: true,
      response,
      message: DynamicMessages.createMessage('Aws instance type'),
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

const getInstanceTypeList = async (_req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const response = await AWSResourceService.getInstanceTypeList();
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
  getInstanceTypeList,
  saveAWSInstanceType,
};

export default AWSResourceController;
