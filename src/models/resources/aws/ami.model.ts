import mongoose, { Schema } from 'mongoose';

import type { AMIDbDoc } from '../../../schemas/resources/aws/ami.schema';

const amiSchema: Schema = new Schema<AMIDbDoc>(
  {
    name: { type: String, required: true },
    ami: { type: String, required: true },
    description: { type: String, required: true },
    architecture: { type: String, required: true },
    os: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const AmiModel = mongoose.model<AMIDbDoc>('ami', amiSchema);
export default AmiModel;
