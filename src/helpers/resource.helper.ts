import { getCurrentDateTime } from '../utils/date';
import { getValue } from '../utils/object';

export const getResourceFileWrittenPath = (data: { userData: object; resourceName: string }) => {
  const { userData, resourceName } = data;
  const userId = getValue(userData, '_id');
  const currentDateTime = getCurrentDateTime();
  const terraformWritePath = `terraform/${resourceName}/${currentDateTime}_${userId}`;

  return terraformWritePath;
};
