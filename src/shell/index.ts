import shell from 'shelljs';
import colors from '../colors';
import log from '../log';
import options from '../options';
import { ShellOptions } from './options';

type CommandLogEntry = {
  message?: string;
  command: string;
  stdout: string;
  stderr: string;
};

let logCommands: boolean;
let silent: boolean;
let previousResult: shell.ShellString;

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
    if (logCommands) {
      shell.echo(colors.command(command));
    }
    previousResult = shell.exec(command, { silent });
    log.debug({
      command: command,
      stdout: previousResult.stdout,
      stderr: previousResult.stderr
    });
    return previousResult;
  },

  setLogCommands: (commandsAreShownInLog: boolean) =>
    (logCommands = commandsAreShownInLog),
  setSilent: (commandsAreExecutedSilently: boolean) =>
    (silent = commandsAreExecutedSilently),
  getPreviousResult: () => previousResult
};
