import { getCurrentDateTime } from '../utils/date';
import { getValue } from '../utils/object';

export const getResourceFileWrittenPath = (data: { userData: object; resourceName: string }) => {
  const { userData, resourceName } = data;
  const userId = getValue(userData, '_id');
  const currentDateTime = getCurrentDateTime();
  const terraformWritePath = `terraform/${resourceName}/${currentDateTime}_${userId}`;

  return terraformWritePath;
};

export const convertInstanceCountToString = (count: number): string => {
  if (count < 1) {
    throw new Error('Count must be greater than or equal to 1');
  }
  const listOfNumber = Array.from({ length: count }, (_, i) => i + 1);

  return listOfNumber.map((num) => `"${num}"`).join(',');
};
