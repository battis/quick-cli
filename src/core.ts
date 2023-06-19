import dotenv from 'dotenv';
import { ConfigMetaSet, jack } from 'jackspeak';
import path from 'node:path';
import process from 'node:process';

type InitOptions = {
  root: string;
  loadDotEnv: boolean | string;
  setRootAsCurrentWorkingDirectory: boolean;
  options: ConfigMetaSet<'string', false>;
  flags: ConfigMetaSet<'boolean', false>;
};

export const appRoot = () =>
  path.parse(
    require.main?.filename ||
    __dirname
      .match(/^(.*\/node_modyles)\//)
      ?.splice(1)
      .shift() ||
    path.resolve(__dirname, '..')
  ).dir;

export function init(options?: Partial<InitOptions>) {
  const opt: InitOptions = {
    root: options?.root || appRoot(),
    loadDotEnv:
      options?.loadDotEnv === false
        ? false
        : typeof options?.loadDotEnv === 'string'
          ? options.loadDotEnv
          : true,
    setRootAsCurrentWorkingDirectory:
      options?.setRootAsCurrentWorkingDirectory === false ? false : true,
    options: {
      ...{
        help: {
          short: 'h',
          description: 'Usage'
        },
        ...(options?.options || {})
      }
    },
    flags: { ...(options?.flags || {}) }
  };
  if (opt.setRootAsCurrentWorkingDirectory) {
    process.chdir(opt.root);
  }
  if (opt.loadDotEnv === true) {
    dotenv.config();
  } else if (typeof opt.loadDotEnv === 'string') {
    dotenv.config({ path: path.resolve(process.cwd(), opt.loadDotEnv) });
  }
  const j = jack({ envPrefix: 'ARG' }).opt(opt.options).flag(opt.flags);
  const { values } = j.parse();
  if (values.help) {
    console.log(j.usage());
    process.exit(0);
  }
  return values;
}
