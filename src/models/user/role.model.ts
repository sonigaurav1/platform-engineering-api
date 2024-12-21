import { Schema, model, type Model } from 'mongoose';

import type { RoleDbDoc } from '../../schemas/user/user.schema';

const roleSchema = new Schema<RoleDbDoc>(
  {
    label: {
      type: String,
      required: true,
    },
    adminAccess: {
      type: Boolean,
      default: false,
    },
    scopes: {
      type: [String],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const RoleModel: Model<RoleDbDoc> = model('role', roleSchema);
