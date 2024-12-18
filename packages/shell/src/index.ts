import colors from '@battis/qui-cli.colors';
import log from '@battis/qui-cli.log';
import * as plugin from '@battis/qui-cli.plugin';
import ora, { Ora } from 'ora';
import shell from 'shelljs';

type CommandLogEntry = {
  message?: string;
  command: string;
  stdout?: string;
  stderr?: string;
};

export type Options = {
  showCommands?: boolean;
  silent?: boolean;
};

export class Shell extends plugin.Base {
  public static readonly defaults = {
    showCommands: true,
    silent: false
  };

  private showCommands = Shell.defaults.showCommands;
  private silent = Shell.defaults.silent;
  private result: shell.ShellString | undefined = undefined;

  private static singleton?: Shell;

  public static getInstance(options?: Options) {
    if (!this.singleton) {
      this.singleton = new Shell(options);
    }
    return this.singleton;
  }

  private constructor({
    showCommands = Shell.defaults.showCommands,
    silent = Shell.defaults.silent
  }: Options = {}) {
    super('shell');
    if (Shell.singleton) {
      throw new Error('Shell is a singleton');
    } else {
      Shell.singleton = this;
    }
    this.init({ positionals: [], values: { silent, commands: showCommands } }); // FIXME janky literal
  }

  public options() {
    return {
      flag: {
        commands: {
          description: `Include shell commands in log (default: ${colors.value(Shell.defaults.showCommands)}, ${colors.value('--no-commands')} to disable)`,
          default: Shell.defaults.showCommands
        },
        silent: {
          description: `Hide command output (default: ${colors.value(Shell.defaults.silent)})`,
          default: Shell.defaults.showCommands
        }
      }
    };
  }

  public init({
    values: { silent, commands } = {}
  }: plugin.Arguments<ReturnType<Shell['options']>>): void {
    this.showCommands = commands !== undefined ? commands : this.showCommands;
    this.silent = silent !== undefined ? silent : this.silent;
  }

  private keywords(command: string) {
    return command.replace(
      /((^\s*|\|\|?|&&)\s*)(\w+)/gm,
      `$1${colors.keyword('$3')}`
    );
  }
  public get() {
    return shell;
  }

  public exec(command: string) {
    let spinner: Ora | undefined = undefined;
    if (this.showCommands && this.silent) {
      spinner = ora(colors.command(this.keywords(command))).start();
    } else if (this.showCommands) {
      shell.echo(colors.command(this.keywords(command)));
    }
    const entry: CommandLogEntry = { command };
    this.result = shell.exec(command, { silent: this.silent });
    if (this.result.stdout.length) entry.stdout = this.result.stdout;
    if (this.result.stderr.length) entry.stderr = this.result.stderr;
    log.debug(entry);
    if (spinner) {
      spinner.succeed(colors.command(this.keywords(command)));
    }
    return this.result;
  }

  public setShowCommands(commandsAreShownInConsole: boolean) {
    return (this.showCommands = commandsAreShownInConsole);
  }

  public setSilent(commandsAreExecutedSilentlyInConsole: boolean) {
    return (this.silent = commandsAreExecutedSilentlyInConsole);
  }

  public isSilent() {
    return this.silent;
  }

  public commandsShown() {
    return this.showCommands;
  }

  public getPreviousResult() {
    return this.result;
  }

  /** @deprecated use shelljs */
  public cd = shell.cd;

  /** @deprecated use shelljs */
  public pwd = shell.pwd;

  /** @deprecated use shelljs */
  public ls = shell.ls;

  /** @deprecated use shelljs */
  public find = shell.find;

  /** @deprecated use shelljs */
  public cp = shell.cp;

  /** @deprecated use shelljs */
  public rm = shell.rm;

  /** @deprecated use shelljs */
  public mv = shell.mv;

  /** @deprecated use shelljs */
  public mkdir = shell.mkdir;

  /** @deprecated use shelljs */
  public test = shell.test;

  /** @deprecated use shelljs */
  public cat = shell.cat;

  /** @deprecated use shelljs */
  public sed = shell.sed;

  /** @deprecated use shelljs */
  public grep = shell.grep;

  /** @deprecated use shelljs */
  public which = shell.which;

  /** @deprecated use shelljs */
  public echo = shell.echo;

  /** @deprecated use shelljs */
  public pushd = shell.pushd;

  /** @deprecated use shelljs */
  public popd = shell.popd;

  /** @deprecated use shelljs */
  public dirs = shell.dirs;

  /** @deprecated use shelljs */
  public ln = shell.ln;

  /** @deprecated use shelljs */
  public exit = shell.exit;

  /** @deprecated use shelljs */
  public env = shell.env;

  /** @deprecated use shelljs */
  public sort = shell.sort;

  /** @deprecated use shelljs */
  public tail = shell.tail;

  /** @deprecated use shelljs */
  public uniq = shell.uniq;

  /** @deprecated use shelljs */
  public set = shell.set;
}

const s = Shell.getInstance();
export default s as Shell;
