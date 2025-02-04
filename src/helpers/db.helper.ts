/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseRepository from '../repositories/base.repository';
import logger from '../utils/logger';

export const runDbTransaction = async (callback: (session: any) => Promise<void>) => {
  const session = await BaseRepository.getDbSession();
  session.startTransaction();
  try {
    await callback(session);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    logger.error(`Database transaction error: ${error}`);
    throw error;
  } finally {
    session.endSession();
  }
};
