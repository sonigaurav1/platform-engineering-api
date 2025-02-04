import { ResourceModel } from '../../models/resources/resource.model';
import BaseRepository from '../base.repository';

import type { DbQueryOptions, DbTransactionOptions } from '../../interfaces/query.interface';
import type { ResourceDBDoc } from '../../schemas/resources/resource.schema';
import type { ObjectId } from 'mongoose';

const create = async (data: Partial<ResourceDBDoc>, options?: DbTransactionOptions): Promise<ResourceDBDoc> => {
  return BaseRepository.create(ResourceModel, data, options);
};

const update = async (condition: object, data: Partial<ResourceDBDoc>, options: DbTransactionOptions = {}): Promise<ResourceDBDoc | null> => {
  return BaseRepository.update(ResourceModel, condition, data, options);
};

const destroy = async (condition: object = {}, options: DbTransactionOptions = {}): Promise<ResourceDBDoc | null> => {
  return BaseRepository.destroy(ResourceModel, condition, options);
};

const softDelete = async (condition: object = {}): Promise<ResourceDBDoc | null> => {
  return BaseRepository.softDelete(ResourceModel, condition);
};

const findOne = async (condition: object = {}, options: DbQueryOptions = {}): Promise<ResourceDBDoc | null> => {
  return BaseRepository.findOne(ResourceModel, condition, options);
};

const findById = async (id: ObjectId | string): Promise<ResourceDBDoc | null> => {
  return BaseRepository.findById(ResourceModel, id);
};

const findAll = async (condition: object = {}, options: DbQueryOptions = {}): Promise<ResourceDBDoc[] | null> => {
  return BaseRepository.findAll(ResourceModel, condition, options);
};

const ResourceRepository = {
  destroy,
  softDelete,
  findOne,
  findById,
  findAll,
  create,
  update,
};

export default ResourceRepository;
