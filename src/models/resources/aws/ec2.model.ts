import { Schema, model } from 'mongoose';

import type { EC2DBDoc } from '../../../schemas/resources/aws/ec2.schema';
import type { Model } from 'mongoose';

const ec2Schema = new Schema<EC2DBDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
      type: [String],
      required: true,
    },
    numberOfInstance: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'inactive',
      enum: ['active', 'inactive'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const EC2Model: Model<EC2DBDoc> = model('ec2', ec2Schema);
