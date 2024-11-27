import colors from '@battis/qui-cli.colors';
import * as plugin from '@battis/qui-cli.plugin';
import ora from 'ora';
import path from 'path';
import stripAnsi from 'strip-ansi';
import winston from 'winston';
import { CustomLevels, DefaultLevels } from './Levels.js';

export { CustomLevels, DefaultLevels };

export type Options = {
  logFilePath?: string;
  stdoutLevel?: string;
  fileLevel?: string;
  levels?: CustomLevels;
  root?: string;
};

export class Log extends plugin.Base {
  private logger = winston.createLogger({
    transports: []
  });

  private transports: Record<string, winston.transport> = {
    console: new winston.transports.Console({
      format: winston.format.printf(({ message }) => message as string),
      level: 'info'
    })
  };

  private format = {
    stripColors: winston.format((info) => {
      for (const prop in info) {
        if (typeof info[prop] === 'string') {
          info[prop] = stripAnsi(info[prop]);
        }
      }
      return info;
    })
  };

  private root: string;
  private levels: CustomLevels;

  private static singleton: Log | undefined = undefined;

  public static getInstance(options?: Options) {
    if (!this.singleton) {
      this.singleton = new Log(options);
    }
    return this.singleton;
  }

  public constructor({
    logFilePath = undefined,
    stdoutLevel = 'info',
    fileLevel = 'all',
    levels = DefaultLevels,
    root = process.cwd()
  }: Options = {}) {
    super('log');
    if (Log.singleton) {
      throw new Error('Log is a singleton');
    } else {
      Log.singleton = this;
    }
    (this.root = root), (this.levels = levels);
    this.init({
      positionals: [], // FIXME janky literal
      values: { logFilePath, stdoutLevel, fileLevel }
    });
    winston.addColors(levels.colors);
  }

  public options() {
    return {
      opt: {
        logFilePath: {
          description: 'Path to log file'
        },
        stdoutLevel: {
          description:
            'Log level to console stdout: off, fatal, error, warning, info, debug, trace, or all (default: info)'
        },
        fileLevel: {
          description:
            'Log level to log file (if path proved): off, fatal, error, warning, info, debug, trace, or all (default: all)'
        }
      }
    };
  }

  public init({
    values: { logFilePath, stdoutLevel, fileLevel } = {}
  }: plugin.Arguments<ReturnType<Log['options']>>) {
    this.transports.console.level = stdoutLevel;
    this.logger.configure({
      levels: this.levels.levels,
      transports: [this.transports.console]
    });
    if (logFilePath) {
      const filename = path.resolve(this.root, logFilePath);
      const spinner = ora(`Connecting to ${colors.url(filename)}`).start();
      this.transports.file = new winston.transports.File({
        filename,
        level: fileLevel,
        format: winston.format.combine(
          this.format.stripColors(),
          winston.format.timestamp(),
          winston.format.json()
        )
      });
      this.logger.add(this.transports.file);
      spinner.succeed(
        `Logging level ${colors.value(fileLevel)} to ${colors.url(filename)}`
      );
    }
  }

  public get() {
    return this.logger || this.init({ positionals: [], values: {} }); // FIXME janky literal
  }

  private colorObject(obj: object) {
    return JSON.stringify(obj, null, 2)
      .replace(/: ([^"{[][^,]*)/g, `: ${colors.value('$1')}`)
      .replace(/: ("([^"]|\\")*")/g, `: ${colors.quotedValue('$1')}`);
  }

  private namedLogMethod(level: string) {
    return (message: string | object, ...meta: any[]) => {
      if (typeof message != 'string') {
        if (meta.some((elt: any) => elt.color === false)) {
          if (message === undefined) {
            message = 'undefined';
          } else {
            message = JSON.stringify(message, null, 2);
          }
        } else {
          if (message === undefined) {
            message = colors.value('undefined');
          } else {
            message = this.colorObject(message);
          }
        }
      }
      return this.logger.log(level, message, ...meta);
    };
  }

  public log = this.logger.log.bind(this.logger);
  public trace = this.namedLogMethod('trace');
  public debug = this.namedLogMethod('debug');
  public info = this.namedLogMethod('info');
  public warning = this.namedLogMethod('warning');
  public error = this.namedLogMethod('error');
  public fatal = this.namedLogMethod('fatal');
}

const log = new Log();
export default log;
