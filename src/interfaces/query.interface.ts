/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClientSession } from 'mongoose';

export interface DbQueryOptions {
  populate?: any;
  select?: string[]; // Array of field names to select
  skip?: number;
  limit?: number;
  session?: ClientSession;
  sort?: any;
}

export interface DbTransactionOptions {
  session?: ClientSession;
}
export interface PaginationParams {
  page: number;
  limit: number;
  condition?: object;
}

export interface SearchParams extends PaginationParams {
  search: any;
}

export interface FilterParams extends PaginationParams {
  filter: object;
}
export interface FilterSearchParams extends PaginationParams, SearchParams, FilterParams {}
