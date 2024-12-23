import { type Model, Schema, type Document, model } from 'mongoose';

export interface OtpDoc extends Document {
  user: Schema.Types.ObjectId;
  otp: number;
  createdAt: Date;
}

const otpSchema = new Schema<OtpDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    otp: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      expires: 3600,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const OtpModel: Model<OtpDoc> = model('otp', otpSchema);
