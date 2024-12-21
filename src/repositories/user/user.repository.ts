import { UserModel } from '../../models/user/user.model';

import type { DbTransactionOptions, DbQueryOptions } from '../../interfaces/query.interface';
import type { UserDbDoc } from '../../schemas/user/user.schema';
import type { ObjectId } from 'mongoose';

const create = async (data: object, options: DbTransactionOptions = {}): Promise<UserDbDoc> => {
  const user = await UserModel.create([data], options);
  return user[0] as UserDbDoc; // Return the first element as UserDbDoc
};

const bulkCreate = async (data: []): Promise<UserDbDoc[]> => UserModel.insertMany(data);

const update = async (condition: object, updatedData: object, options: DbTransactionOptions = {}): Promise<UserDbDoc | null> =>
  UserModel.findOneAndUpdate(condition, updatedData, { new: true, ...options });

const destroy = async (condition: object = {}, options: DbTransactionOptions = {}): Promise<UserDbDoc | null> =>
  UserModel.findOneAndDelete(condition, { ...options });

const softDelete = async (condition: object = {}): Promise<UserDbDoc | null> => UserModel.findOneAndUpdate(condition, { isDeleted: true });

const findOne = async (condition: object = {}, options: DbQueryOptions = {}): Promise<UserDbDoc | null> => {
  const query = UserModel.findOne({ ...condition, isDeleted: false });

  if (options.session) {
    query.session(options.session);
  }

  if (options.populate) {
    query.populate(options.populate);
  }

  if (options.select) {
    const selectFields = options.select.join(' ');
    query.select(selectFields);
  }

  return query.exec(); // Execute the query
};

const findById = async (id: ObjectId | string): Promise<UserDbDoc | null> => UserModel.findById(id);

const findAll = async (condition: object = {}, options: DbQueryOptions = {}): Promise<UserDbDoc[] | null> => {
  const query = UserModel.find({ ...condition, isDeleted: false });
  if (options.populate) {
    query.populate(options.populate);
  }

  if (options.select) {
    const selectFields = options.select.join(' ');
    query.select(selectFields);
  }

  return query.exec(); // Execute the query
};

const UserRepository = {
  create,
  bulkCreate,
  destroy,
  findOne,
  findById,
  findAll,
  update,
  softDelete,
};

export default UserRepository;
