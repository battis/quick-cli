import * as plugin from '@battis/qui-cli.plugin';
import chalk from 'chalk';

export class Colors extends plugin.Base {
  private static singleton?: Colors;

  public static getInstance() {
    if (!this.singleton) {
      this.singleton = new Colors();
    }
    return this.singleton;
  }

  public constructor() {
    super('colors');
    if (Colors.singleton) {
      throw new Error('Colors is a singleton');
    } else {
      Colors.singleton = this;
    }
  }

  public value = chalk.yellow;
  public quotedValue = chalk.green;
  public regexpValue = chalk.red;
  public url = chalk.cyan;
  public error = chalk.red.bold;
  public command = chalk.magenta;
  public keyword = chalk.magenta.bold;
}

export default Colors.getInstance();
