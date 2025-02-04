import { model, Schema } from 'mongoose';

import type { ResourceDBDoc } from '../../schemas/resources/resource.schema';
import type { Model } from 'mongoose';

const resourceSchema = new Schema<ResourceDBDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    resourceId: {
      type: String,
      required: true,
    },
    resourceExecutionPath: {
      type: String,
      required: true,
    },
    terraformResourceId: {
      type: String,
    },
    terraformStateFileS3Key: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      required: true,
    },
    terraformConfig: {
      type: String,
      required: true,
    },
    resourceConfig: {
      type: String,
      required: true,
    },
    metaData: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const ResourceModel: Model<ResourceDBDoc> = model('resource', resourceSchema);
