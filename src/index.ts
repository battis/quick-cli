import * as prompts from '@inquirer/prompts';
import colors from './colors';
import core from './core';
import log from './log';
import shell from './shell';
import validators from './validators';

export default {
  ...core,
  log,
  prompts,
  colors,
  shell,
  validators
};
