const cronValidator = require('cron-validate');
import emailValidator from 'email-validator';
import fs from 'fs';
import pathValidator from 'is-valid-path';
import path from 'path';
import core from './core';

const notEmpty = (value?: string) =>
  (!!value && value.length > 0) || 'May not be empty';

const minLength = (minLength: number) => (value?: string) =>
  (!!value && value.length >= minLength) ||
  `Must be at least ${minLength} characters`;

const maxLength = (maxLength: number) => (value?: string) =>
  (!!value && value.length <= maxLength) ||
  `Must be no more than ${maxLength} characters`;

export default {
  notEmpty,
  minLength,
  maxLength,

  lengthBetween: (min: number, max: number) => (value?: string) =>
    (minLength(min)(value) && maxLength(max)(value)) ||
    `Must be between ${minLength} && ${maxLength} characters`,

  email: (value?: string) =>
    (notEmpty(value) && emailValidator.validate(value || '')) ||
    'Must be valid email address',

  cron: (value?: string) =>
    (notEmpty(value) && cronValidator(value || '').isValid()) ||
    'Must be valid cron schedule',

  isPath: (value?: string) =>
    (notEmpty(value) && pathValidator(value)) || 'Must be a valid path',

  pathExists: function(value?: string) {
    const possiblePath = path.resolve(core.appRoot(), value || '');
    return (
      (notEmpty(value) && fs.existsSync(possiblePath)) ||
      `${possiblePath} does not exist`
    );
  }
};
