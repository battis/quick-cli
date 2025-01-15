import { Colors } from '@battis/qui-cli.colors';
import { Core, Options as CoreOptions } from '@battis/qui-cli.core';
import { Env, Options as EnvOptions } from '@battis/qui-cli.env';
import { Log, Options as LogOptions } from '@battis/qui-cli.log';
import * as plugin from '@battis/qui-cli.plugin';
import { Root } from '@battis/qui-cli.root';
import { Shell, Options as ShellOptions } from '@battis/qui-cli.shell';
import { Validators } from '@battis/qui-cli.validators';
import * as prompts from '@inquirer/prompts';

export type Options = {
  env?: EnvOptions;
  args?: CoreOptions;
  log?: LogOptions;
  shell?: ShellOptions;
};

export type Arguments<O extends plugin.Options = plugin.Options> =
  plugin.Arguments<ReturnType<Env['options']>> &
    plugin.Arguments<ReturnType<Log['options']>> &
    plugin.Arguments<ReturnType<Shell['options']>> &
    plugin.Arguments<O>;

function init({ env, args, log, shell }: Options = {}) {
  const core = new Core();
  core.register(Root.getInstance({ root: env?.root }));
  core.register(Colors.getInstance());
  core.register(Env.getInstance({ root: Root.getInstance().path(), ...env }));
  core.register(Log.getInstance(log));
  core.register(Shell.getInstance(shell));
  core.register(Validators.getInstance());
  const {
    requirePositionals,
    allowPositionals,
    envPrefix,
    env: _env,
    usage,
    stopAtPositional,
    ...options
  } = args || {};
  return core.init(args) as Arguments<typeof options>;
}

const defaults = {
  env: Env.defaults,
  args: Core.defaults,
  log: Log.defaults,
  shell: Shell.defaults
};

export const cli = {
  init,
  appRoot: Root.getInstance().path(),
  colors: Colors.getInstance(),
  env: Env.getInstance(),
  log: Log.getInstance(),
  shell: Shell.getInstance(),
  validators: Validators.getInstance(),

  options: {
    defaults,
    hydrate: (
      options: Partial<{
        env: Partial<EnvOptions>;
        args: Partial<CoreOptions>;
        log: Partial<LogOptions>;
        shell: Partial<ShellOptions>;
      }>
    ): Parameters<typeof init>[0] => {
      return {
        env: { ...defaults.env, ...options?.env },
        args: { ...defaults.args, ...options?.args },
        log: { ...defaults.log, ...options?.log },
        shell: { ...defaults.shell, ...options?.shell }
      };
    }
  },

  /** @deprecated use @inquirer/prompts directly */
  prompts
};

export default cli;
