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
}

const s = Shell.getInstance();
export default s;
