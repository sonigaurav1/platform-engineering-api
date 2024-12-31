import { v4 as uuidv4 } from 'uuid';

export const generateResourceId = () => {
  return uuidv4();
};
