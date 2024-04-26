import colors from './colors';
import core from './core';
import * as env from './env';
import * as log from './log';
import options from './options';
import shell from './shell';
import validators from './validators';
import * as prompts from '@inquirer/prompts';
import spinner from 'ora';

export type { Arguments } from './core';
export type { Options } from './options/types';

export default {
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
