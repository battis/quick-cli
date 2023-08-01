import ora from 'ora';
import path from 'path';
import stripAnsi from 'strip-ansi';
import winston from 'winston';
import colors from '../colors';
import options from '../options';
import { DefaultLevels, LogOptions } from './options';

const logger = winston.createLogger({
  transports: []
});
const transports = {
  console: new winston.transports.Console({
    format: winston.format.printf(({ message }) => message),
    level: 'info'
  }),
  file: null
};

const format = {
  stripColors: winston.format((info) => {
    for (const prop in info) {
      if (typeof info[prop] === 'string') {
        info[prop] = stripAnsi(info[prop]);
      }
    }
    return info;
  })
};

function init({
  logFilePath = options.defaults.log.logFilePath,
  stdoutLevel = options.defaults.log.stdoutLevel,
  fileLevel = options.defaults.log.fileLevel,
  levels = options.defaults.log.levels,
  root = options.defaults.log.root
}: Partial<LogOptions>) {
  transports.console.level = stdoutLevel;
  logger.configure({
    levels: levels.levels,
    transports: [transports.console]
  });
  if (logFilePath) {
    const filename = path.resolve(root, logFilePath);
    const spinner = ora(`Connecting to ${colors.url(filename)}`).start();
    transports.file = new winston.transports.File({
      filename,
      level: fileLevel,
      format: winston.format.combine(
        format.stripColors(),
        winston.format.timestamp(),
        winston.format.json()
      )
    });
    logger.add(transports.file);
    spinner.succeed(
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
