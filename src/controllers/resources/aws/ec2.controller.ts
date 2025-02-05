import EC2Service from '../../../services/resources/aws/ec2.service';

import type { CustomRequest } from '../../../interfaces/auth.interface';
import type { NextFunction, Response } from 'express';

const createEC2Instance = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const ec2 = await EC2Service.createEC2Instance(req.user, req.body);
    res.status(201).json({
      success: true,
      message: 'EC2 instance created successfully',
      ec2: ec2,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEC2InstanceWithSameResourceId = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { resourceId } = req.params;
  try {
    await EC2Service.deleteEC2WithSameResourceId(resourceId);
    res.status(200).json({
      success: true,
      message: 'EC2 instances deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const deleteSpecificEC2Instance = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { instanceId } = req.params;
  try {
    const response = await EC2Service.deleteSpecificEC2Instance(instanceId);
    res.status(200).json({
      success: true,
      message: 'EC2 instance deleted successfully',
      response,
    });
  } catch (error) {
    next(error);
  }
};

const getEC2IpAddress = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { resourceId } = req.params;
  try {
    const response = await EC2Service.getEC2IpAddress(resourceId);
    res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    next(error);
  }
};

const generateEc2InstanceTerraformConfigFile = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const ec2 = await EC2Service.generateEc2InstanceTerraformConfigFile(req.body);
    res.status(201).json({
      success: true,
      message: 'EC2 instance terraform config generated successfully',
      ec2: ec2,
    });
  } catch (error) {
    next(error);
  }
};

const EC2Controller = {
  createEC2Instance,
  deleteEC2InstanceWithSameResourceId,
  deleteSpecificEC2Instance,
  getEC2IpAddress,
  generateEc2InstanceTerraformConfigFile,
};

export default EC2Controller;
