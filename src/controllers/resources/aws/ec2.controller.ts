import type { CustomRequest } from '../../../interfaces/auth.interface';
import type { NextFunction, Response } from 'express';

const createEC2Instance = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const ec2 = { user: req.user };
    res.status(201).json({
      success: true,
      message: 'EC2 instance created successfully',
      ec2: ec2,
    });
  } catch (error) {
    next(error);
  }
};

const EC2Controller = {
  createEC2Instance,
};

export default EC2Controller;
