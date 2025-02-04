import AmiModel from '../../../models/resources/aws/ami.model';
import BaseRepository from '../../base.repository';

import type { DbQueryOptions, DbTransactionOptions } from '../../../interfaces/query.interface';
import type { AMIDbDoc } from '../../../schemas/resources/aws/ami.schema';
import type { ObjectId } from 'mongoose';

const create = async (data: Partial<AMIDbDoc>, options?: DbTransactionOptions): Promise<AMIDbDoc> => {
  return BaseRepository.create(AmiModel, data, options);
};

const bulkSave = async (data: Partial<AMIDbDoc[]>, options?: DbTransactionOptions): Promise<AMIDbDoc[]> => {
  const filteredData = data.filter((item): item is AMIDbDoc => item !== undefined);
  return BaseRepository.bulkInsert(AmiModel, filteredData, options);
};

const update = async (condition: object, data: Partial<AMIDbDoc>, options: DbTransactionOptions = {}): Promise<AMIDbDoc | null> => {
  return BaseRepository.update(AmiModel, condition, data, options);
};

const updateMany = async (condition: object, data: Partial<AMIDbDoc>, options: DbTransactionOptions = {}): Promise<void> => {
  await BaseRepository.updateMany(AmiModel, condition, data, options);
};

const destroy = async (condition: object = {}, options: DbTransactionOptions = {}): Promise<AMIDbDoc | null> => {
  return BaseRepository.destroy(AmiModel, condition, options);
};

const softDelete = async (condition: object = {}): Promise<AMIDbDoc | null> => {
  return BaseRepository.softDelete(AmiModel, condition);
};

const findOne = async (condition: object = {}, options: DbQueryOptions = {}): Promise<AMIDbDoc | null> => {
  return BaseRepository.findOne(AmiModel, condition, options);
};

const findById = async (id: ObjectId | string): Promise<AMIDbDoc | null> => {
  return BaseRepository.findById(AmiModel, id);
};

const findAll = async (condition: object = {}, options: DbQueryOptions = {}): Promise<AMIDbDoc[] | null> => {
  return BaseRepository.findAll(AmiModel, condition, options);
};

const AmiRepository = {
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

export default AmiRepository;
