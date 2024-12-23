import express from 'express';

import UserController from '../../../controllers/user/user.controller';
import { authenticationMiddleware } from '../../../middleware/auth.middleware';
import { validateRequestBody } from '../../../middleware/validation.middleware';
import {
  userAccountVerificationSchema,
  userCreationSchema,
  userLoginSchema,
  userPasswordChangeSchema,
  userPasswordResetRequestSchema,
  userPasswordResetSchema,
} from '../../../schemas/user/user.schema';
// import { authenticationMiddleware, mobileAuthenticationMiddleware } from '../../middleware/auth.middleware';

const userRouter = express.Router();

userRouter.post('/register', validateRequestBody(userCreationSchema), UserController.createNewUser);
userRouter.post('/verify', validateRequestBody(userAccountVerificationSchema), UserController.verifyUserAccount);
userRouter.post('/login', validateRequestBody(userLoginSchema), UserController.loginUser);
userRouter.post('/change-password', authenticationMiddleware, validateRequestBody(userPasswordChangeSchema), UserController.changePassword);
userRouter.post('/password-reset-request', validateRequestBody(userPasswordResetRequestSchema), UserController.passwordResetRequest);
userRouter.post('/reset-password', validateRequestBody(userPasswordResetSchema), UserController.resetPassword);

// userRouter.post(
//   '/employee-change-password',
//   mobileAuthenticationMiddleware,
//   AuthValidator.validateChangePasswordPayload,
//   UserController.changePassword,
// );
// userRouter.post('/change-password', authenticationMiddleware, AuthValidator.validateChangePasswordPayload, UserController.changePassword);
// userRouter.post('/password-reset-request', AuthValidator.validatePasswordResetRequestPayload, UserController.passwordResetRequest);
// userRouter.post('/password-reset', AuthValidator.validatePasswordResetPayload, UserController.resetPassword);
// userRouter.get('/profile', authenticationMiddleware, UserController.getUserProfile);
// userRouter.get('/:id', authenticationMiddleware, UserController.getUser);

export default userRouter;
