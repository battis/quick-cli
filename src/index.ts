import * as prompts from '@inquirer/prompts';
import spinner from 'ora';
import colors from './colors';
import core from './core';
import env from './env';
import log from './log';
import options from './options';
import shell from './shell';
import validators from './validators';

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
