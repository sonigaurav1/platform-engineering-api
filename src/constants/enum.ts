export const RESOURCE_STATUS = {
  FAILED: 'failed',
  STOPPED: 'stopped',
  DELETED: 'deleted',
  PENDING: 'pending',
  RUNNING: 'running',
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const RESOURCE_TYPE = {
  EC2: 'EC2',
  S3: 'S3',
  RDS: 'RDS',
  REDIS: 'REDIS',
};

export const RESOURCE_STATUS_DB_ENUM = Object.values(RESOURCE_STATUS);
export const USER_STATUS_DB_ENUM = Object.values(USER_STATUS);
