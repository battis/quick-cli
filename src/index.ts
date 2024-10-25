import colors from './colors.js';
import core from './core.js';
import * as env from './env.js';
import * as log from './log.js';
import options from './options.js';
import shell from './shell.js';
import validators from './validators.js';
import * as prompts from '@inquirer/prompts';
import spinner from 'ora';

export type { Arguments } from './core.js';
export type { Options } from './options/types.js';

const cli = {
  ...core,
  colors,
  env,
  log,
  options,
  prompts,
  shell,
  spinner,
  validators
};
export default cli;
