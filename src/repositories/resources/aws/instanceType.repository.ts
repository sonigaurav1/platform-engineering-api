import InstanceTypeModel from '../../../models/resources/aws/instanceType.model';
import BaseRepository from '../../base.repository';

import type { DbQueryOptions, DbTransactionOptions } from '../../../interfaces/query.interface';
import type { InstanceTypeDBDoc } from '../../../schemas/resources/aws/instanceType.schema';
import type { ObjectId } from 'mongoose';

const create = async (data: Partial<InstanceTypeDBDoc>, options?: DbTransactionOptions): Promise<InstanceTypeDBDoc> => {
  return BaseRepository.create(InstanceTypeModel, data, options);
};

const bulkSave = async (data: Partial<InstanceTypeDBDoc[]>, options?: DbTransactionOptions): Promise<InstanceTypeDBDoc[]> => {
  const filteredData = data.filter((item): item is InstanceTypeDBDoc => item !== undefined);
  return BaseRepository.bulkInsert(InstanceTypeModel, filteredData, options);
};

const update = async (condition: object, data: Partial<InstanceTypeDBDoc>, options: DbTransactionOptions = {}): Promise<InstanceTypeDBDoc | null> => {
  return BaseRepository.update(InstanceTypeModel, condition, data, options);
};

const updateMany = async (condition: object, data: Partial<InstanceTypeDBDoc>, options: DbTransactionOptions = {}): Promise<void> => {
  await BaseRepository.updateMany(InstanceTypeModel, condition, data, options);
};

const destroy = async (condition: object = {}, options: DbTransactionOptions = {}): Promise<InstanceTypeDBDoc | null> => {
  return BaseRepository.destroy(InstanceTypeModel, condition, options);
};

const softDelete = async (condition: object = {}): Promise<InstanceTypeDBDoc | null> => {
  return BaseRepository.softDelete(InstanceTypeModel, condition);
};

const findOne = async (condition: object = {}, options: DbQueryOptions = {}): Promise<InstanceTypeDBDoc | null> => {
  return BaseRepository.findOne(InstanceTypeModel, condition, options);
};

const findById = async (id: ObjectId | string): Promise<InstanceTypeDBDoc | null> => {
  return BaseRepository.findById(InstanceTypeModel, id);
};

const findAll = async (condition: object = {}, options: DbQueryOptions = {}): Promise<InstanceTypeDBDoc[] | null> => {
  return BaseRepository.findAll(InstanceTypeModel, condition, options);
};

const AwsInstanceTypeRepository = {
  destroy,
  softDelete,
  findOne,
  findById,
  findAll,
  create,
  update,
  bulkSave,
  updateMany,
};

export default AwsInstanceTypeRepository;
