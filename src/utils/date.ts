import moment from 'moment';

export const getCurrentDateTime = (dateFormat = 'YYYY-MM-DD_HH-mm-ss') => {
  return moment().format(dateFormat);
};
