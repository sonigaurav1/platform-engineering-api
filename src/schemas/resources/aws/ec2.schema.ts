import { z } from 'zod';

import type { CommonDbField } from '../../shared/shared.schema';
import type { Schema, Document } from 'mongoose';

enum InstanceType {
  T2_MICRO = 't2.micro',
  T2_SMALL = 't2.small',
  T2_MEDIUM = 't2.medium',
  T2_LARGE = 't2.large',
}

export const createEC2InstanceSchema = z.object({
  instanceName: z.string({ required_error: 'Instance name is required' }),
  instanceType: z.nativeEnum(InstanceType, { required_error: 'Instance type is required' }),
  amiId: z.string({ required_error: 'AMI ID is required' }),
  tags: z.array(z.record(z.string()), { required_error: 'Tags are required' }),
  numberOfInstance: z.number({ required_error: 'Number of instances is required' }).lte(3, `Number of instances should be less than or equal to 3`),
});

export const deleteResource = z.object({
  resourceId: z.string({ required_error: 'Resource ID is required' }).min(20, 'Resource ID should be of 20 characters'),
});

export const deleteEC2InstanceSchema = z.object({
  instanceId: z.string({ required_error: 'Resource ID is required' }).min(20, 'Resource ID should be of 20 characters'),
  // instanceId: z.string({ required_error: 'Instance ID is required' }),
  // terraformResourceId: z.string({ required_error: 'Terraform resource ID is required' }),
});

export type EC2Instance = z.infer<typeof createEC2InstanceSchema>;

export interface EC2DBDoc extends EC2Instance, Document, CommonDbField {
  userId: Schema.Types.ObjectId;
  resourceId: string;
  sshKey: {
    privateKey: string;
    publicKey: string;
  };
  status: string;
  instanceId: string;
  terraformResourceName: string;
}
