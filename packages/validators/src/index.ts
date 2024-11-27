import * as plugin from '@battis/qui-cli.plugin';
import appRoot from '@battis/qui-cli.root';
import domainValidator from '@tahul/is-valid-domain';
import cronValidator from 'cron-validate';
import emailValidator from 'email-validator';
import pathValidator from 'is-valid-path';
import fs from 'node:fs';
import path from 'node:path';

export type Validator = (value?: string) => boolean | string;

export class Validators extends plugin.Base {
  private static singleton: Validators;

  public static getInstance() {
    if (!this.singleton) {
      this.singleton = new Validators();
    }
    return this.singleton;
  }

  public constructor() {
    super('validators');
    if (Validators.singleton) {
      throw new Error('Validators is a singleton');
    } else {
      Validators.singleton = this;
    }
  }

  public notEmpty(value?: string) {
    return (!!value && value.length > 0) || 'May not be empty';
  }

  public minLength(minLength: number): Validator {
    return (value?: string) =>
      (!!value && value.length >= minLength) ||
      `Must be at least ${minLength} characters`;
  }

  public maxLength(maxLength: number): Validator {
    return (value?: string) =>
      (!!value && value.length <= maxLength) ||
      `Must be no more than ${maxLength} characters`;
  }

  public isPath(value?: string) {
    return (
      (this.notEmpty(value) && pathValidator(value)) || 'Must be a valid path'
    );
  }

  public match(pattern: RegExp): Validator {
    return (value?: string) =>
      (!!value && pattern.test(value)) ||
      `Must match pattern /${pattern.toString()}/`;
  }

  public lengthBetween(min: number, max: number): Validator {
    return (value?: string) =>
      (this.minLength(min)(value) && this.maxLength(max)(value)) ||
      `Must be between ${min} && ${max} characters`;
  }

  public email(): Validator {
    return (value?: string) =>
      (this.notEmpty(value) && emailValidator.validate(value || '')) ||
      'Must be valid email address';
  }

  public cron(value?: string) {
    return (
      // FIXME cronValidator callable
      // @ts-ignore
      (this.notEmpty(value) && cronValidator(value || '').isValid()) ||
      'Must be valid cron schedule'
    );
  }

  public isHostname({
    subdomain = false,
    wildcard = false,
    allowUnicode = false,
    topLevel = false,
    localhost = true,
    ipAddress = true,
    allowed = []
  }: {
    subdomain?: boolean;
    wildcard?: boolean;
    allowUnicode?: boolean;
    topLevel?: boolean;
    localhost?: boolean;
    ipAddress?: boolean;
    allowed?: string[];
  }): Validator {
    return (value?: string) => {
      let domain;
      if (value) {
        domain = domainValidator(value, {
          subdomain,
          wildcard,
          allowUnicode,
          topLevel
        });
      }
      return (
        (!!value &&
          (domain ||
            (localhost && value === 'localhost') ||
            (ipAddress && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value)) ||
            allowed.includes(value))) ||
        `Must be a valid hostname`
      );
    };
  }

  public pathExists(root = appRoot()): Validator {
    return (value?: string) => {
      const possiblePath = path.resolve(root, value || '');
      return (
        (this.isPath(value) && fs.existsSync(possiblePath)) ||
        `${possiblePath} does not exist`
      );
    };
  }

  public combine(...validators: (Validator | undefined)[]): Validator {
    return (value?: string) =>
      validators.reduce(
        (valid: string | boolean, validator?: Validator) =>
          validator ? (valid && validator ? validator(value) : true) : valid,
        true
      );
  }
}
