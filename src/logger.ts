import winston from 'winston';

let singletonlogger: winston.Logger;

export const logger = () =>
  singletonlogger ||
  (singletonlogger = winston.createLogger({
    transports: [new winston.transports.Console()]
  }));

export const log = logger().log;

export const level = {
  all: 'all',
  trace: 'trace',
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  fatal: 'fatal',
  off: 'off'
};
