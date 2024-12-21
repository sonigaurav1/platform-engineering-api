import { RoleModel } from '../../models/user/role.model';

import type { DbTransactionOptions, DbQueryOptions } from '../../interfaces/query.interface';
import type { RoleDbDoc } from '../../schemas/user/user.schema';
import type { ObjectId } from 'mongoose';

const create = async (data: object, options: DbTransactionOptions = {}): Promise<RoleDbDoc> => {
  const user = await RoleModel.create([data], options);
  return user[0] as RoleDbDoc; // Return the first element as RoleDbDoc
};

const bulkCreate = async (data: []): Promise<RoleDbDoc[]> => RoleModel.insertMany(data);

const update = async (condition: object, updatedData: object, options: DbTransactionOptions = {}): Promise<RoleDbDoc | null> =>
  RoleModel.findOneAndUpdate(condition, updatedData, { new: true, ...options });

const destroy = async (condition: object = {}, options: DbTransactionOptions = {}): Promise<RoleDbDoc | null> =>
  RoleModel.findOneAndDelete(condition, { ...options });

const softDelete = async (condition: object = {}): Promise<RoleDbDoc | null> => RoleModel.findOneAndUpdate(condition, { isDeleted: true });

const findOne = async (condition: object = {}, options: DbQueryOptions = {}): Promise<RoleDbDoc | null> => {
  const query = RoleModel.findOne({ ...condition, isDeleted: false });

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

const findById = async (id: ObjectId | string): Promise<RoleDbDoc | null> => RoleModel.findById(id);

const findAll = async (condition: object = {}, options: DbQueryOptions = {}): Promise<RoleDbDoc[] | null> => {
  const query = RoleModel.find({ ...condition, isDeleted: false });
  if (options.populate) {
    query.populate(options.populate);
  }

  if (options.select) {
    const selectFields = options.select.join(' ');
    query.select(selectFields);
  }

  return query.exec(); // Execute the query
};

const UserRoleRepository = {
  create,
  bulkCreate,
  destroy,
  findOne,
  findById,
  findAll,
  update,
  softDelete,
};

export default UserRoleRepository;
