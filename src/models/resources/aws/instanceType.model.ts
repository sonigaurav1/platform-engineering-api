import mongoose, { Schema } from 'mongoose';

import type { InstanceTypeDBDoc } from '../../../schemas/resources/aws/instanceType.schema';

const instanceTypeSchema: Schema = new Schema<InstanceTypeDBDoc>(
  {
    instanceType: { type: String, required: true },
    freeTierEligible: { type: Boolean, required: true },
    cpuInfo: { type: Schema.Types.Mixed, required: true },
    memoryInfo: { type: Schema.Types.Mixed, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const InstanceTypeModel = mongoose.model<InstanceTypeDBDoc>('instanceType', instanceTypeSchema);
export default InstanceTypeModel;
