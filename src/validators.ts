import cronValidator from 'cron-validate';
import emailValidator from 'email-validator';
import fs from 'fs';
import domainValidator from 'is-valid-domain';
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

const isPath = (value?: string) =>
  (notEmpty(value) && pathValidator(value)) || 'Must be a valid path';

export default {
  notEmpty,
  minLength,
  maxLength,
  isPath,

  match: (pattern: RegExp) => (value?: string) =>
    (!!value && pattern.test(value)) ||
    `Must match pattern /${pattern.toString()}/`,

  lengthBetween: (min: number, max: number) => (value?: string) =>
    (minLength(min)(value) && maxLength(max)(value)) ||
    `Must be between ${minLength} && ${maxLength} characters`,

  email: (value?: string) =>
    (notEmpty(value) && emailValidator.validate(value || '')) ||
    'Must be valid email address',

  cron: (value?: string) =>
    (notEmpty(value) && cronValidator(value || '').isValid()) ||
    'Must be valid cron schedule',

  isHostname:
    ({
      subdomain = false,
      wildcard = false,
      allowUnicode = false,
      topLevel = false,
      localhost = true,
      ipAddress = true,
      allowed = []
    }) =>
      (value?: string) =>
        (!!value &&
          (domainValidator(value, {
            subdomain,
            wildcard,
            allowUnicode,
            topLevel
          }) ||
            (localhost && value === 'localhost') ||
            (ipAddress && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value)) ||
            allowed.includes(value))) ||
        'Must be a valid hostname',

  pathExists: (root = core.appRoot()) =>
    function(value?: string) {
      const possiblePath = path.resolve(root, value || '');
      return (
        (isPath(value) && fs.existsSync(possiblePath)) ||
        `${possiblePath} does not exist`
      );
    }
};
