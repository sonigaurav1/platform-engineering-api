import type { DbQueryOptions, DbTransactionOptions } from '../interfaces/query.interface';
import type { Model, Document, ObjectId } from 'mongoose';

const create = async <T extends Document>(model: Model<T>, data: Partial<T>, option?: DbTransactionOptions): Promise<T> => {
  const dbData = await model.create([data], { ...option });
  return dbData[0];
};

const update = async <T extends Document>(
  model: Model<T>,
  condition: object,
  data: Partial<T>,
  options: DbTransactionOptions = {},
): Promise<T | null> => {
  return model.findOneAndUpdate(condition, data, { new: true, ...options });
};

const destroy = async <T extends Document>(model: Model<T>, condition: object = {}, options: DbTransactionOptions = {}): Promise<T | null> => {
  return model.findOneAndDelete(condition, { ...options });
};

const softDelete = async <T extends Document>(model: Model<T>, condition: object = {}): Promise<T | null> => {
  return model.findOneAndUpdate(condition, { isDeleted: true });
};

const findOne = async <T extends Document>(model: Model<T>, condition: object = {}, options: DbQueryOptions = {}): Promise<T | null> => {
  const query = model.findOne({ ...condition, isDeleted: false });

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

const findById = async <T extends Document>(model: Model<T>, id: ObjectId | string): Promise<T | null> => {
  return model.findById(id);
};

const findAll = async <T extends Document>(model: Model<T>, condition: object = {}, options: DbQueryOptions = {}): Promise<T[] | null> => {
  const query = model.find({ ...condition, isDeleted: false });

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

const BaseRepository = {
  create,
  update,
  destroy,
  softDelete,
  findOne,
  findById,
  findAll,
};

export default BaseRepository;
