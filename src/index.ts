import * as core from './core';
import * as io from './io/';
import * as logger from './logger';

export default {
  appRoot: core.appRoot,
  init: core.init,
  log: logger.log,
  logger,
  io
};
