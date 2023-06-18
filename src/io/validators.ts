import emailValidator from 'email-validator';

export const notEmpty = (value?: string) => value && value.length > 0;

export const email = (value?: string) =>
  notEmpty(value) && emailValidator.validate(value || '');

export const minLength = (minLength: number) => (value?: string) =>
  value && value.length >= minLength;

export const maxLength = (maxLength: number) => (value?: string) =>
  value && value.length <= maxLength;

export const lengthBetween = (min: number, max: number) => (value?: string) =>
  minLength(min)(value) && maxLength(max)(value);
