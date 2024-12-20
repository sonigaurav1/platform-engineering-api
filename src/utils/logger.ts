import fs from 'fs';

import winston, { format } from 'winston';
import 'winston-daily-rotate-file';

const LOG_DIR = {
  ERROR_FILE: 'log/error',
  INFO_FILE: 'log/info',
};

const LOG_LEVEL = {
  INFO: 'info',
  DEBUG: 'debug',
  VERBOSE: 'verbose',
  WARN: 'warn',
  ERROR: 'error',
};

if (!fs.existsSync(LOG_DIR.ERROR_FILE)) {
  fs.mkdirSync(LOG_DIR.ERROR_FILE, { recursive: true });
}

if (!fs.existsSync(LOG_DIR.INFO_FILE)) {
  fs.mkdirSync(LOG_DIR.INFO_FILE, { recursive: true });
}

// Custom format for error logging
const errorFormatter = format((info) => {
  if (info instanceof Error) {
    return {
      ...info,
      message: info.message,
      stack: info.stack,
    };
  }
  return info;
});

const winstonTransports = [
  new winston.transports.Console({
    format: format.combine(format.colorize(), format.simple(), errorFormatter()),
    level: LOG_LEVEL.INFO,
  }),
  new winston.transports.DailyRotateFile({
    format: format.combine(format.timestamp(), format.json()),
    maxFiles: '7d',
    level: LOG_LEVEL.INFO,
    dirname: LOG_DIR.INFO_FILE,
    datePattern: 'YYYY-MM-DD',
    filename: '%DATE%-debug.log',
  }),
  new winston.transports.DailyRotateFile({
    format: format.combine(format.timestamp(), format.json(), errorFormatter()),
    maxFiles: '100d',
    level: LOG_LEVEL.ERROR,
    dirname: LOG_DIR.ERROR_FILE,
    datePattern: 'YYYY-MM-DD',
    filename: '%DATE%-error.log',
  }),
];

const logger = winston.createLogger({
  transports: winstonTransports,
  format: format.combine(format.errors({ stack: true }), format.timestamp(), format.json()),
});

logger.stream({
  write: (message: string) => {
    logger.info(message);
  },
});

logger.stream({
  write: (message: string) => {
    logger.error(message);
  },
});

export default logger;
