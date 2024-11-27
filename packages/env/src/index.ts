import * as plugin from '@battis/qui-cli.plugin';
import appRoot from '@battis/qui-cli.root';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

export type Options = {
  root?: string;
  loadDotEnv?: boolean | string;
  setRootAsCurrentWorkingDirectory?: boolean;
};

type GetOptions = {
  key: string;
  file?: string;
};

type SetOptions = {
  key: string;
  value: string;
  file?: string;
  comment?: string;
  ifNotExists?: boolean;
};
type RemoveOptions = {
  key: string;
  file?: string;
  comment?: string;
};

export class Env extends plugin.Base {
  private root: string;

  private static singleton?: Env;

  public static getInstance(options?: Options) {
    if (!this.singleton) {
      this.singleton = new Env(options);
    }
    return this.singleton;
  }

  public constructor({
    root = appRoot(),
    loadDotEnv = true,
    setRootAsCurrentWorkingDirectory = true
  }: Options = {}) {
    super('env');
    if (Env.singleton) {
      throw new Error('Env is a singleton');
    } else {
      Env.singleton = this;
    }
    this.root = root;
    if (setRootAsCurrentWorkingDirectory) {
      process.chdir(this.root);
    }
    if (loadDotEnv === true) {
      dotenv.config({ path: path.resolve(this.root, '.env') });
    } else if (typeof loadDotEnv === 'string') {
      dotenv.config({ path: path.resolve(this.root, loadDotEnv) });
    }
  }

  public parse(file = '.env') {
    const env = dotenv.config({
      path: path.resolve(this.root, file)
    });
    if (env.error) {
      throw env.error;
    }
    return env.parsed || {};
  }

  public get({ key, file = '.env' }: GetOptions) {
    if (fs.existsSync(path.resolve(this.root, file))) {
      return this.parse(file)[key];
    }
    return undefined;
  }

  public exists({ key, file = '.env' }: GetOptions) {
    if (fs.existsSync(path.resolve(this.root, file))) {
      return !!this.parse(file)[key];
    }
    return false;
  }

  public set({
    key,
    value,
    file = '.env',
    comment,
    ifNotExists = false
  }: SetOptions) {
    const filePath = path.resolve(this.root, file);
    if (ifNotExists === false || false === this.exists({ key, file })) {
      let env = fs.readFileSync(filePath).toString();
      const pattern = new RegExp(`^${key}=.*$`, 'm');
      if (/[\s=]/.test(value)) {
        value = `"${value}"`;
      }
      if (pattern.test(env)) {
        env = env.replace(pattern, `${key}=${value}`);
      } else {
        env = `${env.trim()}\n${
          comment ? `\n# ${comment}\n` : ''
        }${key}=${value}\n`;
      }
      fs.writeFileSync(filePath, env);
    }
  }

  public remove({ key, file = '.env', comment }: RemoveOptions) {
    const filePath = path.resolve(this.root, file);
    if (fs.existsSync(filePath)) {
      const env = fs.readFileSync(filePath).toString();
      const pattern = new RegExp(`${key}=.*\\n`);
      if (pattern.test(env)) {
        fs.writeFileSync(
          filePath,
          env.replace(pattern, comment ? `# ${comment}\n` : '')
        );
      }
    }
  }
}
