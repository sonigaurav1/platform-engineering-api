import fs from 'fs';

import winston, { format } from 'winston';

import type { Logger } from 'winston';
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

// Ensure log directories exist
if (!fs.existsSync(LOG_DIR.ERROR_FILE)) {
  fs.mkdirSync(LOG_DIR.ERROR_FILE, { recursive: true });
}

if (!fs.existsSync(LOG_DIR.INFO_FILE)) {
  fs.mkdirSync(LOG_DIR.INFO_FILE, { recursive: true });
}

// Custom filter for error logs
const errorOnlyFilter = format((info) => {
  return info.level === LOG_LEVEL.ERROR ? info : false;
});

// Custom filter for info logs (exclude error logs)
const infoOnlyFilter = format((info) => {
  return info.level !== LOG_LEVEL.ERROR ? info : false;
});

// Winston transports
const winstonTransports = [
  // Console transport for all logs
  new winston.transports.Console({
    format: format.combine(format.colorize(), format.simple()),
    level: LOG_LEVEL.DEBUG,
  }),

  // Daily rotate file for info logs (excluding error logs)
  new winston.transports.DailyRotateFile({
    format: format.combine(format.timestamp(), infoOnlyFilter(), format.json()),
    maxFiles: '7d',
    level: LOG_LEVEL.INFO,
    dirname: LOG_DIR.INFO_FILE,
    datePattern: 'YYYY-MM-DD',
    filename: '%DATE%-info.log',
  }),

  // Daily rotate file for error logs
  new winston.transports.DailyRotateFile({
    format: format.combine(format.timestamp(), errorOnlyFilter(), format.json()),
    maxFiles: '100d',
    level: LOG_LEVEL.ERROR,
    dirname: LOG_DIR.ERROR_FILE,
    datePattern: 'YYYY-MM-DD',
    filename: '%DATE%-error.log',
  }),
];

// Create the logger instance
const logger: Logger = winston.createLogger({
  level: LOG_LEVEL.DEBUG,
  transports: winstonTransports,
  format: format.combine(format.errors({ stack: true }), format.timestamp(), format.json()),
});

logger.stream({
  write: (message: string) => {
    logger.error(message.trim());
  },
});

export default logger;
