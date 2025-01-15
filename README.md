# @battis/qui-cli

**Quickly** (get it?) build a CLI app

[![npm version](https://badge.fury.io/js/@battis%2Fqui-cli.svg)](https://badge.fury.io/js/@battis%2Fqui-cli)
[![Module type: ESM](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://nodejs.org/api/esm.html)

## Install

`npm i @battis/qui-cli`

## Usage

This is an ESM module that depends on other ESM modules, and so really can only feasibly be imported by ESM modules.

```js
import cli from '@battis/qui-cli';

const args = cli.init();
const name = await cli.prompts.input({ message: 'What is your name?' });
cli.log.info(`Hello, ${name}.`);
const spinner = cli.spinner('Wait a sec');
setTimeout(() => spinner.stop(), 1000);
```

## API

### `cli.init(config?: Partial<Options>)`

All configs have default values or can be ignored

```ts
type Options = {
  env: {
    // application root, defaults to cli.appPath()
    root: string;

    // wwhether or not to load .env file
    // accepts boolean to load from `root` or path to .env file
    // default `true`
    loadDotEnv: boolean | string;

    // whether to set the process current working directory to `root`
    // default true
    setRootAsCurrentWorkingDirectory: boolean;
  };

  /**
   * CLI argument config as in jackspeak
   * @see https://github.com/isaacs/jackspeak#usage
   */
  args: {
    envPrefix: string;
    requirePositionals: boolean | number; // number of (or if) positional args required
    options: OptionsConfig; // jack.opt()
    optionLists: OptionListsConfig; // jack.optList()

    // default includes --help/-h and --commands
    flags: FlagsConfig; // jack.flag()
  };

  shell: {
    // display shell command stdout (default `true`)
    silent: boolean;

    // show cli.shell.exec() commands in console (default `false`)
    showCommands: boolean;
  };

  log: {
    // path to log file (default `undefined`)
    logFilePath?: string;

    // log level to display in stdout (default `info`)
    stdoutLevel: string;

    // log level to display in log file (default `all`)
    fileLevel: string;

    /**
     * default `cli.log.DefaultLevels`
     * (i.e. all, trace, debug, info, warning, error, fatal)
     * @see https://github.com/winstonjs/winston#using-custom-logging-levels
     */
    levels: CustomLevels;
  };
};
```

### `cli.appPath(): string`

Report the root of the current project, per [app-root-path](https://www.npmjs.com/package/app-root-path).

### `cli.colors: chalk`

Pass-through to the [chalk](https://www.npmjs.com/package/chalk) terminal string styling [API](https://github.com/chalk/chalk#usage).

### `cli.log.get(): winston.Logger`

Pass-through to [winston](https://www.npmjs.com/package/winston) logger [API](https://github.com/winstonjs/winston#usage). A default logger to the console is created by `cli.init()`. The default log levels are: none, fatal, error, warning, info, debug, trace, all, with convenience methods for all of them:

### `cli.prompts: prompts

Pass-through to [@inquirer/prompts](https://www.npmjs.com/package/@inquirer/prompts) user input [API](https://github.com/SBoudrias/Inquirer.js/blob/master/packages/prompts/README.md).

### `cli.shell: shell`

Pass-through to [shelljs](https://www.npmjs.com/package/shelljs) unix shell [API](https://github.com/shelljs/shelljs#command-reference).

### `cli.validators`

Collection of validators for use with `cli.prompts` (or other places where validation of text is useful).
