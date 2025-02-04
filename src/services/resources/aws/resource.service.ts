import AmiRepository from '../../../repositories/resources/aws/ami.repository';
import { getFilteredAMIs } from '../../../utils/aws';
import logger from '../../../utils/logger';

const saveAWSAmi = async () => {
  try {
    const amiList = await getFilteredAMIs();
    if (amiList.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const amiListPayload = [...amiList] as any;
      await AmiRepository.bulkSave(amiListPayload);
    }
  } catch (error) {
    logger.error(`Error at saveAWSAmi(): ${error}`);
  }
};

const getAMIsList = async () => {
  try {
    const amiList = await AmiRepository.findAll();
    return amiList;
  } catch (error) {
    logger.error(`Error at getAMIsList(): ${error}`);
    throw error;
  }
};

const AWSResourceService = {
  getAMIsList,
  saveAWSAmi,
};

export default AWSResourceService;
