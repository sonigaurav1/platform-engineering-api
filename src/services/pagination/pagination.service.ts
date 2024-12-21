/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Model, Document } from 'mongoose';

interface PaginationOptions {
  page: number;
  limit: number;
  condition?: object;
  populate?: any;
  select?: any;
  sort?: any;
}

interface PaginatedResult<T> {
  results: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const paginate = async <T extends Document>(model: Model<T>, options: PaginationOptions): Promise<PaginatedResult<T>> => {
  const { page = 1, limit = 10, condition = {}, select = '', populate = '', sort } = options;
  const skip = (page - 1) * limit;

  const [docs, totalDocs] = await Promise.all([
    model
      .find({ ...condition, isDeleted: false })
      .populate(populate)
      .select(select)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec(),
    model.countDocuments({ ...condition, isDeleted: false }).exec(),
  ]);

  const totalPages = Math.ceil(totalDocs / limit);

  return {
    totalPages,
    totalCount: totalDocs,
    currentPage: page,
    results: docs,
  };
};

const PaginationService = {
  paginate,
};

export default PaginationService;
