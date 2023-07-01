import shell from 'shelljs';
import colors from '../colors';
import log from '../log';
import options from '../options';
import { ShellOptions } from './options';

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
      log.info(colors.command(command));
    }
    previousResult = shell.exec(command, { silent });
    return previousResult;
  },

  setLogCommands: (commandsAreShownInLog: boolean) =>
    (logCommands = commandsAreShownInLog),
  setSilent: (commandsAreExecutedSilently: boolean) =>
    (silent = commandsAreExecutedSilently),
  getPreviousResult: () => previousResult
};
