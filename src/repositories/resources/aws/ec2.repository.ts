import { EC2Model } from '../../../models/resources/aws/ec2.model';
import BaseRepository from '../../base.repository';

import type { DbQueryOptions, DbTransactionOptions } from '../../../interfaces/query.interface';
import type { EC2DBDoc } from '../../../schemas/resources/aws/ec2.schema';
import type { ObjectId } from 'mongoose';

const create = async (data: Partial<EC2DBDoc>, options: DbTransactionOptions): Promise<EC2DBDoc> => {
  return BaseRepository.create(EC2Model, data, options);
};

const update = async (condition: object, data: Partial<EC2DBDoc>, options: DbTransactionOptions = {}): Promise<EC2DBDoc | null> => {
  return BaseRepository.update(EC2Model, condition, data, options);
};

const destroy = async (condition: object = {}, options: DbTransactionOptions = {}): Promise<EC2DBDoc | null> => {
  return BaseRepository.destroy(EC2Model, condition, options);
};

const softDelete = async (condition: object = {}): Promise<EC2DBDoc | null> => {
  return BaseRepository.softDelete(EC2Model, condition);
};

const findOne = async (condition: object = {}, options: DbQueryOptions = {}): Promise<EC2DBDoc | null> => {
  return BaseRepository.findOne(EC2Model, condition, options);
};

const findById = async (id: ObjectId | string): Promise<EC2DBDoc | null> => {
  return BaseRepository.findById(EC2Model, id);
};

const findAll = async (condition: object = {}, options: DbQueryOptions = {}): Promise<EC2DBDoc[] | null> => {
  return BaseRepository.findAll(EC2Model, condition, options);
};

const EC2Repository = {
  destroy,
  softDelete,
  findOne,
  findById,
  findAll,
  create,
  update,
};

export default EC2Repository;
