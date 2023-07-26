import AppRootPath from 'app-root-path';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

function parse(name = '.env') {
  const env = dotenv.config({
    path: path.join(AppRootPath.toString(), name)
  });
  if (!env.error) {
    return env.parsed;
  } else {
    throw env.error;
  }
}

export default {
  parse,

  get: (key: string, file = '.env') => parse(file)[key],

  set: function(key: string, value: string, file = '.env') {
    let env = fs.readFileSync(path.join(AppRootPath.toString(), file), 'utf8');
    const pattern = new RegExp(`${key}=.*\\n`);
    if (/[\s=]/.test(value)) {
      value = `"${value}"`;
    }
    if (pattern.test(env)) {
      env = env.replace(pattern, `${key}=${value}\n`);
    } else {
      env = `${env.trim()}\n\n${key}=${value}\n`;
    }
    fs.writeFileSync(path.join(AppRootPath.toString(), file), env);
  }
};
