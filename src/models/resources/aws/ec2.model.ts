import { Schema, model } from 'mongoose';

import { RESOURCE_STATUS, RESOURCE_STATUS_DB_ENUM } from '../../../constants/enum';

import type { EC2DBDoc } from '../../../schemas/resources/aws/ec2.schema';
import type { Model } from 'mongoose';

const ec2Schema = new Schema<EC2DBDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    resourceId: {
      type: String,
      required: true,
    },
    instanceType: {
      type: String,
      required: true,
    },
    amiId: {
      type: String,
      required: true,
    },
    tags: {
      type: [],
      required: true,
    },
    numberOfInstance: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: RESOURCE_STATUS.ACTIVE,
      enum: RESOURCE_STATUS_DB_ENUM,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const EC2Model: Model<EC2DBDoc> = model('ec2', ec2Schema);
