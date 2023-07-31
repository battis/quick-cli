import ora, { Ora } from 'ora';
import shell from 'shelljs';
import colors from '../colors';
import log from '../log';
import options from '../options';
import { ShellOptions } from './options';

type CommandLogEntry = {
  message?: string;
  command: string;
  stdout?: string;
  stderr?: string;
};

let showCommands: boolean;
let silent: boolean;
let result: shell.ShellString;

function init({
  silent: s = options.defaults.shell.silent,
  showCommands: lc = options.defaults.shell.showCommands
}: Partial<ShellOptions>) {
  silent = s;
  showCommands = lc;
}

export default {
  ...shell,
  init,
  get: () => shell,
  exec: function(command: string) {
    let spinner: Ora;
    if (showCommands && silent) {
      spinner = ora(colors.command(command)).start();
    } else if (showCommands) {
      shell.echo(colors.command(command));
    }
    const entry: CommandLogEntry = { command };
    result = shell.exec(command, { silent });
    if (result.stdout.length) entry.stdout = result.stdout;
    if (result.stderr.length) entry.stderr = result.stderr;
    log.debug(entry);
    if (spinner) spinner.succeed(colors.command(command));
    return result;
  },

  setshowCommands: (commandsAreShownInLog: boolean) =>
    (showCommands = commandsAreShownInLog),
  setSilent: (commandsAreExecutedSilently: boolean) =>
    (silent = commandsAreExecutedSilently),
  getPreviousResult: () => result
};
