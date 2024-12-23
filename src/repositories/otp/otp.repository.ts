import { OtpModel } from '../../models/otp/otp.model';

import type { OtpDoc } from '../../models/otp/otp.model';
import type { ObjectId } from 'mongoose';

const create = async (data: object): Promise<OtpDoc> => OtpModel.create(data);

const bulkCreate = async (data: []): Promise<OtpDoc[]> => OtpModel.insertMany(data);

const update = async (condition: object, updatedData: object): Promise<OtpDoc | null> =>
  OtpModel.findOneAndUpdate(condition, updatedData, { new: true });

const destroy = async (condition: object = {}): Promise<OtpDoc | null> => OtpModel.findOneAndDelete(condition);

const findOne = async (condition: object = {}): Promise<OtpDoc | null> => OtpModel.findOne({ ...condition });

const findById = async (id: ObjectId | string): Promise<OtpDoc | null> => OtpModel.findById(id);

const findAll = async (condition: object = {}): Promise<OtpDoc[] | null> => OtpModel.find({ ...condition });

const OtpRepository = {
  create,
  bulkCreate,
  destroy,
  findOne,
  findById,
  findAll,
  update,
};

export default OtpRepository;
