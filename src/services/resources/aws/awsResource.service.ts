import AwsAmiRepository from '../../../repositories/resources/aws/ami.repository';
import AwsInstanceTypeRepository from '../../../repositories/resources/aws/instanceType.repository';
import { getAvailableInstanceTypes, getFilteredAMIs } from '../../../utils/aws';
import logger from '../../../utils/logger';

const saveAWSAmi = async () => {
  try {
    const amiList = await getFilteredAMIs();
    if (amiList.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const amiListPayload = [...amiList] as any;
      await AwsAmiRepository.bulkSave(amiListPayload);
    }
  } catch (error) {
    logger.error(`Error at saveAWSAmi(): ${error}`);
  }
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
  try {
    const instanceTypes = await getAvailableInstanceTypes();
    if (instanceTypes.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const instanceTypesPayload = [...instanceTypes] as any;
      await AwsInstanceTypeRepository.bulkSave(instanceTypesPayload);
    }
  } catch (error) {
    logger.error(`Error at saveAWSAmi(): ${error}`);
  }
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
