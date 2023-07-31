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

let logCommands: boolean;
let silent: boolean;
let result: shell.ShellString;

function init({
  silent: s = options.defaults.shell.silent,
  logCommands: lc = options.defaults.shell.logCommands
}: Partial<ShellOptions>) {
  silent = s;
  logCommands = lc;
}

export default {
  ...shell,
  init,
  get: () => shell,
  exec: function(command: string) {
    let spinner: Ora;
    if (logCommands) {
      spinner = ora(colors.command(command)).start();
    }
    const entry: CommandLogEntry = { command };
    result = shell.exec(command, { silent });
    result.stdout.length && (entry.stdout = result.stdout);
    result.stderr.length && (entry.stderr = result.stderr);
    log.debug(entry);
    spinner && spinner.succeed(colors.command(command));
    return result;
  },

  setLogCommands: (commandsAreShownInLog: boolean) =>
    (logCommands = commandsAreShownInLog),
  setSilent: (commandsAreExecutedSilently: boolean) =>
    (silent = commandsAreExecutedSilently),
  getPreviousResult: () => result
};
