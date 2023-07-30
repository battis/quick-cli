import path from 'path';
import winston from 'winston';
import colors from '../colors';
import options from '../options';
import { DefaultLevels, LogOptions } from './options';

const logger = winston.createLogger();

function init({
  logFilePath = options.defaults.log.logFilePath,
  stdoutLevel = options.defaults.log.stdoutLevel,
  fileLevel = options.defaults.log.fileLevel,
  levels = options.defaults.log.levels,
  root = options.defaults.log.root
}: Partial<LogOptions>) {
  logger.configure({
    levels: levels.levels,
    transports: [
      new winston.transports.Console({
        format: winston.format.printf(({ message }) => message),
        level: stdoutLevel
      })
    ]
  });
  if (logFilePath) {
    const filename = path.resolve(root, logFilePath);
    logger.add(
      new winston.transports.File({
        filename,
        level: fileLevel
      })
    );
    logger.info(
      `Logging level ${colors.value(fileLevel)} to ${colors.url(filename)}`
    );
  }
  winston.addColors(levels.colors);
  return logger;
}

const get = () => logger || init({});

const namedLogMethod =
  (level: string) =>
    (message: string, ...meta: any[]) =>
      logger.log(level, message, ...meta);

export default {
  init,
  get,
  log: logger.log.bind(logger),
  trace: namedLogMethod('trace'),
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warning: namedLogMethod('warning'),
  error: logger.error.bind(logger),
  fatal: namedLogMethod('fatal'),
  DefaultLevels
};
