import appRootPath from 'app-root-path';
import { DefaultLevels, LogOptions } from '../log/options';
import { ShellOptions } from '../shell/options';
import {
  FlagsConfig,
  OptionListsConfig,
  Options,
  OptionsConfig
} from './types';

const defaults: Options = {
  env: {
    root: appRootPath.toString(),
    loadDotEnv: true,
    setRootAsCurrentWorkingDirectory: true
  },
  args: {
    envPrefix: 'ARG',
    options: {
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
    },
    optionLists: {},
    flags: {
      help: {
        short: 'h',
        description: 'Usage'
      },
      commands: {
        description: 'Include shell commands in log'
      },
      silent: {
        description:
          'Hide command output (on by default, use --no-silent to disable)'
      }
    }
  },
  shell: {
    logCommands: true,
    silent: true
  },
  log: {
    logFilePath: undefined,
    stdoutLevel: 'info',
    fileLevel: 'all',
    levels: DefaultLevels,
    root: process.cwd()
  }
};

function hydrate(
  options: Partial<Options>,
  overrides: Partial<Options> = {}
): Options {
  const combine = <T>(fallback: T, arg?: T) =>
    (arg !== undefined ? arg : fallback) as T;
  const merge = <T>(fallback: T, arg?: T) =>
  ({
    ...fallback,
    ...(arg || {})
  } as T);
  return {
    env: {
      root: combine<string>(
        defaults.env.root,
        combine<string>(overrides?.env?.root, options?.env?.root)
      ),
      setRootAsCurrentWorkingDirectory: combine<boolean>(
        defaults.env.setRootAsCurrentWorkingDirectory,
        combine<boolean>(
          overrides?.env?.setRootAsCurrentWorkingDirectory,
          options?.env?.setRootAsCurrentWorkingDirectory
        )
      ),
      loadDotEnv: combine<string | boolean>(
        defaults.env.loadDotEnv,
        combine<string | boolean>(
          overrides?.env?.loadDotEnv,
          options?.env?.loadDotEnv
        )
      )
    },
    args: {
      envPrefix: combine<string>(
        defaults.args.envPrefix,
        combine<string>(overrides?.args?.envPrefix, options?.args?.envPrefix)
      ),
      options: merge<OptionsConfig>(
        defaults.args.options,
        merge<OptionsConfig>(overrides?.args?.options, options?.args?.options)
      ),
      optionLists: merge<OptionListsConfig>(
        defaults.args.optionLists,
        merge<OptionListsConfig>(
          overrides?.args?.optionLists,
          options?.args?.optionLists
        )
      ),
      flags: merge<FlagsConfig>(
        defaults.args.flags,
        merge<FlagsConfig>(overrides?.args?.flags, options?.args?.flags)
      )
    },
    shell: merge<ShellOptions>(
      defaults.shell,
      merge<ShellOptions>(overrides?.shell, options?.shell)
    ),
    log: merge<LogOptions>(
      defaults.log,
      merge<LogOptions>(overrides?.log, options?.log)
    )
  };
}

export default { defaults, hydrate };
