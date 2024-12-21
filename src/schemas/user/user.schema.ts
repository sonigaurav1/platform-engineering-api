import { type Document, type Schema } from 'mongoose';
import { z } from 'zod';

import { type CommonDbField } from '../shared/shared.schema';

// User schema start here
export const userCreationSchema = z.object({
  firstName: z.string({ required_error: 'First name is required' }).min(3, { message: 'First name must be 3 characters long' }),
  lastName: z.string({ required_error: 'Last name is required' }).min(3, { message: 'Last name must be 3 characters long' }),
  email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(5, { message: 'Password must be at least 5 characters long' })
    .max(15, { message: 'Password must be no more than 15 characters long' }),
});

export type UserType = z.infer<typeof userCreationSchema>;

export interface UserDbDoc extends UserType, Document, CommonDbField {
  role: Schema.Types.ObjectId;
}

// Role Schema start here
export const userRoleCreationSchema = z.object({
  label: z.string({ required_error: 'Label is required' }).min(3, { message: 'Label must be 3 characters long' }),
  adminAccess: z.boolean(),
  scopes: z.array(z.string()),
});

export type RoleType = z.infer<typeof userRoleCreationSchema>;

export interface RoleDbDoc extends RoleType, Document, CommonDbField {}
