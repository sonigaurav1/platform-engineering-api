/* eslint-disable @typescript-eslint/no-explicit-any */
import { runDbTransaction } from '../../../helpers/db.helper';
import AwsAmiRepository from '../../../repositories/resources/aws/ami.repository';
import AwsInstanceTypeRepository from '../../../repositories/resources/aws/instanceType.repository';
import { getAvailableInstanceTypes, getFilteredAMIs } from '../../../utils/aws';
import logger from '../../../utils/logger';

const saveAWSAmi = async () => {
  await runDbTransaction(async (session) => {
    const amiList = (await getFilteredAMIs()) as any[];
    if (amiList.length === 0) return;

    await AwsAmiRepository.bulkDelete({ isDeleted: false }, { session });
    await AwsAmiRepository.bulkSave(amiList, { session });
  });
};

const getAMIsList = async () => {
  try {
    const amiList = await AwsAmiRepository.findAll();
    return amiList;
  } catch (error) {
    logger.error(`Error at getAMIsList(): ${error}`);
    throw error;
  }
};

const saveAWSInstanceType = async () => {
  await runDbTransaction(async (session) => {
    const instanceTypes = (await getAvailableInstanceTypes()) as any[];
    if (instanceTypes.length === 0) return;

    await AwsInstanceTypeRepository.bulkDelete({ isDeleted: false }, { session });
    await AwsInstanceTypeRepository.bulkSave(instanceTypes, { session });
  });
};

const getInstanceTypeList = async () => {
  try {
    const instanceTypes = await AwsInstanceTypeRepository.findAll();
    return instanceTypes;
  } catch (error) {
    logger.error(`Error at getInstanceTypeList(): ${error}`);
    throw error;
  }
};

const AWSResourceService = {
  saveAWSAmi,
  getAMIsList,
  saveAWSInstanceType,
  getInstanceTypeList,
};

export default AWSResourceService;
