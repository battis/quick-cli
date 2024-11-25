import chalk from 'chalk';

export default {
  value: chalk.yellow,
  quotedValue: chalk.green,
  regexpValue: chalk.red,
  url: chalk.cyan,
  error: chalk.bgRed.whiteBright.bold,
  command: chalk.magenta,
  keyword: chalk.magenta.bold
};
