/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicMessages, PLAIN_RESPONSE_MSG } from '../../constants/error';
import UserRoleRepository from '../../repositories/user/role.repository';
import UserRepository from '../../repositories/user/user.repository';
import createError from '../../utils/http.error';
import logger from '../../utils/logger';
import { removeKey } from '../../utils/object';
import { checkIfEmpty } from '../../utils/validation';

import type { DbTransactionOptions } from '../../interfaces/query.interface';
import type { UserType } from '../../schemas/user/user.schema';

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

// const loginUser = async (
//   payload: any,
// ): Promise<{
//   refreshToken: string;
//   accessToken: string;
// }> => {
//   const user = await UserRepository.findOne({ email: payload.email });
//   if (!user || user.isDeleted) {
//     throw createError(401, PLAIN_RESPONSE_MSG.invalidAuth);
//   }

//   const authenticateUser = await hasSamePassword(payload.password, user);

//   if (!authenticateUser) {
//     throw createError(401, PLAIN_RESPONSE_MSG.invalidCredentials);
//   }

//   const { refreshToken, accessToken } = generateAuthTokens(user._id);

//   return {
//     refreshToken,
//     accessToken,
//   };
// };

const UserService = {
  saveUser,
};

export default UserService;
