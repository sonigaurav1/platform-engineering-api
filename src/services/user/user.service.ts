/* eslint-disable @typescript-eslint/no-explicit-any */

import { JWT_SECRET_KEY } from '../../configs/server.config';
import { USER_STATUS } from '../../constants/enum';
import { DynamicMessages, PLAIN_RESPONSE_MSG } from '../../constants/error';
import UserRoleRepository from '../../repositories/user/role.repository';
import UserRepository from '../../repositories/user/user.repository';
import { compareHash, generateHash } from '../../utils/bcrypt';
import { generateOtp } from '../../utils/crypto';
import createError from '../../utils/http.error';
import jwtGenerator from '../../utils/jwt.generator';
import logger from '../../utils/logger';
import { removeKey } from '../../utils/object';
import { checkIfEmpty } from '../../utils/validation';
import EmailService from '../email/email.service';
import OtpService from '../email/otp.service';

import type { DbTransactionOptions } from '../../interfaces/query.interface';
import type {
  UserAccountVerificationType,
  UserDbDoc,
  UserLoginType,
  UserPasswordChangeType,
  UserPasswordResetRequestType,
  UserPasswordResetType,
  UserType,
} from '../../schemas/user/user.schema';

interface JWTGenerator {
  accessToken: string;
  refreshToken: string;
}

const saveUser = async (payload: UserType, options: DbTransactionOptions = {}): Promise<any> => {
  const user = await UserRepository.findOne({ email: payload.email }, options);
  if (!checkIfEmpty(user)) {
    throw createError(409, DynamicMessages.alreadyExistMessage('User with this email'));
  }

  const role = await UserRoleRepository.findOne({
    label: 'user',
  });

  if (!role) {
    logger.error(`No role with label user found in db.`);
    throw createError(404, PLAIN_RESPONSE_MSG.somethingWrong);
  }

  const userData = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: payload.password,
    role: role._id,
  };

  const newUser = await UserRepository.create(userData, options);
  const response = removeKey(newUser.toJSON(), 'password');

  const otp = generateOtp();
  await OtpService.createOtp({ user: newUser, otp });

  EmailService.sendAccountCreationEmailToUser({
    email: newUser.email,
    otp: otp,
    url: 'http://localhost:5173/verify-account',
  });
  return response;
};

const hasSamePassword = async (passwd: string, user: UserDbDoc): Promise<boolean> => {
  const isMatch = await compareHash(passwd, user.password);
  return isMatch;
};

const generateAuthTokens = (userId: any, time = '7d'): JWTGenerator => {
  const accessToken = jwtGenerator.generateAccessToken(userId, JWT_SECRET_KEY.accessTokenPrivateKey, time);
  const refreshToken = jwtGenerator.generateRefreshToken(userId, JWT_SECRET_KEY.refreshTokenPrivateKey);
  return { accessToken, refreshToken };
};

const loginUser = async (
  payload: UserLoginType,
): Promise<{
  refreshToken: string;
  accessToken: string;
}> => {
  const user = await UserRepository.findOne({ email: payload.email });
  if (!user || user.isDeleted) {
    throw createError(401, PLAIN_RESPONSE_MSG.invalidAuth);
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw createError(401, PLAIN_RESPONSE_MSG.unVerifiedAccount);
  }

  const authenticateUser = await hasSamePassword(payload.password, user);

  if (!authenticateUser) {
    throw createError(401, PLAIN_RESPONSE_MSG.invalidCredentials);
  }

  const { refreshToken, accessToken } = generateAuthTokens(user._id);

  return {
    refreshToken,
    accessToken,
  };
};

const changePassword = async (data: { userId: string; payload: UserPasswordChangeType }): Promise<void> => {
  const { userId, payload } = data;

  const user = await UserRepository.findById(userId);
  if (!user) {
    throw createError(404, DynamicMessages.notFoundMessage('User'));
  }

  const authenticateUser = await hasSamePassword(payload.currentPassword, user);

  if (!authenticateUser) {
    throw createError(401, 'Invalid current password');
  }

  const hashPassword = await generateHash(payload.newPassword);
  const updatedData = { password: hashPassword };
  const condition = {
    _id: user._id,
  };

  await UserRepository.update(condition, updatedData);
};

const passwordResetRequest = async (payload: UserPasswordResetRequestType): Promise<void> => {
  const user = await UserRepository.findOne({ email: payload.email });
  if (!user) {
    throw createError(404, DynamicMessages.notFoundMessage('User with this email'));
  }

  const otp = generateOtp();
  await OtpService.createOtp({ user, otp });

  await EmailService.sendPasswordResetRequestEmail({
    email: user.email,
    code: otp,
    url: 'http://localhost:5173/new-password',
  });
};

const resetPassword = async (payload: UserPasswordResetType): Promise<void> => {
  const user = await UserRepository.findOne({ email: payload.email });
  if (!user) {
    throw createError(404, DynamicMessages.notFoundMessage('User with this email'));
  }

  const isValidOtp = await OtpService.verifyOtp({ user, otp: payload.otp });
  if (!isValidOtp) {
    throw createError(401, PLAIN_RESPONSE_MSG.invalidOtp);
  }

  const passwordHash = await generateHash(payload.newPassword);
  const updatedData = { password: passwordHash };
  const condition = { _id: user._id };

  await UserRepository.update(condition, updatedData);
  OtpService.deleteOtp({ otp: payload.otp });
};

const verifyAccount = async (payload: UserAccountVerificationType): Promise<void> => {
  const user = await UserRepository.findOne({ email: payload.email });
  if (!user) {
    throw createError(404, DynamicMessages.notFoundMessage('User with this email'));
  }

  const isValidOtp = await OtpService.verifyOtp({ user, otp: payload.otp });
  if (!isValidOtp) {
    throw createError(401, PLAIN_RESPONSE_MSG.invalidOtp);
  }

  const updatedData = { status: USER_STATUS.ACTIVE };
  const condition = { _id: user._id };

  await UserRepository.update(condition, updatedData);
  OtpService.deleteOtp({ otp: payload.otp });
};

const getUserInfoById = async (id: string) => {
  const user = await UserRepository.findOne(
    {
      _id: id,
    },
    { select: ['_id', 'email'] },
  );
  return user;
};

const getUserProfile = async (data: { userId: string }): Promise<any> => {
  const options = {
    populate: [{ path: 'role', select: 'label scopes' }],
    select: ['email'],
  };
  const user = await UserRepository.findOne(
    {
      _id: data.userId,
    },
    options,
  );
  return user;
};

const UserService = {
  saveUser,
  loginUser,
  changePassword,
  passwordResetRequest,
  resetPassword,
  verifyAccount,
  getUserInfoById,
  getUserProfile,
};

export default UserService;
