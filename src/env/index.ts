import options from '../options';
import { EnvironmentOptions } from './options';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

let root: string;
let loadDotEnv: boolean | string;
let setRootAsCurrentWorkingDirectory: boolean;

export function init({
  root: r = options.defaults.env.root,
  loadDotEnv: l = options.defaults.env.loadDotEnv,
  setRootAsCurrentWorkingDirectory: s = options.defaults.env
    .setRootAsCurrentWorkingDirectory
}: EnvironmentOptions) {
  root = r;
  loadDotEnv = l;
  setRootAsCurrentWorkingDirectory = s;

  if (setRootAsCurrentWorkingDirectory) {
    process.chdir(root);
  }
  if (loadDotEnv === true) {
    dotenv.config({ path: path.resolve(root, '.env') });
  } else if (typeof loadDotEnv === 'string') {
    dotenv.config({ path: path.resolve(root, loadDotEnv) });
  }
}

export function parse(file = '.env') {
  const env = dotenv.config({
    path: path.resolve(root, file)
  });
  if (env.error) {
    throw env.error;
  }
  return env.parsed;
}

type GetOptions = {
  key: string;
  file?: string;
};

export function get({ key, file = '.env' }: GetOptions) {
  if (fs.existsSync(path.resolve(root, file))) {
    return parse(file)[key];
  }
  return undefined;
}

export function exists({ key, file = '.env' }: GetOptions) {
  if (fs.existsSync(path.resolve(root, file))) {
    return !!parse(file)[key];
  }
  return false;
}

type SetOptions = {
  key: string;
  value: string;
  file?: string;
  comment?: string;
  ifNotExists?: boolean;
};

export function set({
  key,
  value,
  file = '.env',
  comment,
  ifNotExists = false
}: SetOptions) {
  const filePath = path.resolve(root, file);
  if (ifNotExists === false || false === exists({ key, file })) {
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

type RemoveOptions = {
  key: string;
  file?: string;
  comment?: string;
};

export function remove({ key, file = '.env', comment }: RemoveOptions) {
  const filePath = path.resolve(root, file);
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
