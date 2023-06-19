import cronValidator from 'cron-validate';
import emailValidator from 'email-validator';
import fs from 'node:fs';
import path from 'node:path';
import * as core from '../core';
const pathValidator = require('is-valid-path');

export const notEmpty = (value?: string) =>
  (!!value && value.length > 0) || 'May not be empty';

export const minLength = (minLength: number) => (value?: string) =>
  (!!value && value.length >= minLength) ||
  `Must be at least ${minLength} characters`;

export const maxLength = (maxLength: number) => (value?: string) =>
  (!!value && value.length <= maxLength) ||
  `Must be no more than ${maxLength} characters`;

export const lengthBetween = (min: number, max: number) => (value?: string) =>
  (minLength(min)(value) && maxLength(max)(value)) ||
  `Must be between ${minLength} && ${maxLength} characters`;

export const email = (value?: string) =>
  (notEmpty(value) && emailValidator.validate(value || '')) ||
  'Must be valid email address';

export const cron = (value?: string) =>
  (notEmpty(value) && cronValidator(value || '').isValid()) ||
  'Must be valid cron schedule';

export const isPath = (value?: string) =>
  (notEmpty(value) && pathValidator(value)) || 'Must be a valid path';

export const pathExists = (value?: string) =>
  (notEmpty(value) &&
    fs.existsSync(path.resolve(core.appRoot(), value || ''))) ||
  `${path.resolve(core.appRoot(), value || '')} does not exist`;
