import cronValidator from 'cron-validate';
import emailValidator from 'email-validator';

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
