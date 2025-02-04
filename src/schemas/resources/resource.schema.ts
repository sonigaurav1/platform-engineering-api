import type { CommonDbField } from '../shared/shared.schema';
import type { Schema, Document } from 'mongoose';

export interface ResourceDetails {
  userId: Schema.Types.ObjectId;
  resourceId: string;
  resourceExecutionPath: string;
  terraformResourceId: string;
  terraformStateFileS3Key: string;
  resourceType: string;
  terraformConfig: string;
  resourceConfig: string;
  metaData: string;
  status: string;
}

export interface ResourceDBDoc extends ResourceDetails, Document, CommonDbField {}
