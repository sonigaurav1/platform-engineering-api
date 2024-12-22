/* eslint-disable @typescript-eslint/no-explicit-any */
import { JWT_SECRET_KEY } from '../../configs/server.config';
import { DynamicMessages, PLAIN_RESPONSE_MSG } from '../../constants/error';
import UserRoleRepository from '../../repositories/user/role.repository';
import UserRepository from '../../repositories/user/user.repository';
import { compareHash } from '../../utils/bcrypt';
import createError from '../../utils/http.error';
import jwtGenerator from '../../utils/jwt.generator';
import logger from '../../utils/logger';
import { removeKey } from '../../utils/object';
import { checkIfEmpty } from '../../utils/validation';

import type { DbTransactionOptions } from '../../interfaces/query.interface';
import type { UserDbDoc, UserLoginType, UserType } from '../../schemas/user/user.schema';

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

  const savedUser = await UserRepository.create(userData, options);
  const response = removeKey(savedUser.toJSON(), 'password');
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

const UserService = {
  saveUser,
  loginUser,
};

export default UserService;
