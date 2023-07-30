import appRootPath from 'app-root-path';
import dotenv from 'dotenv';
import { jack } from 'jackspeak';
import path from 'path';
import process from 'process';
import log from './log';
import options from './options';
import { Options } from './options/types';
import shell from './shell';

export type Arguments = {
  values: { [name: string]: string };
  positionals: string[];
};

export default {
  appRoot: () => appRootPath.toString(),

  init: function(config?: Partial<Options>): Arguments {
    const opt = options.hydrate(config || {});
    if (opt.env.setRootAsCurrentWorkingDirectory) {
      process.chdir(opt.env.root);
      opt.log.root = opt.env.root;
    }
    if (opt.env.loadDotEnv === true) {
      dotenv.config();
    } else if (typeof opt.env.loadDotEnv === 'string') {
      dotenv.config({ path: path.resolve(process.cwd(), opt.env.loadDotEnv) });
    }
    const j = jack({ envPrefix: opt.args.envPrefix })
      .opt(opt.args.options)
      .optList(opt.args.optionLists)
      .flag(opt.args.flags);
    const args = j.parse();
    if (args.values['help']) {
      console.log(j.usage());
      process.exit(0);
    }
    opt.shell.silent =
      args.values.silent !== undefined
        ? !!args.values.silent
        : opt.shell.silent;
    opt.shell.logCommands =
      args.values.command !== undefined
        ? !!args.values.command
        : opt.shell.logCommands;

    shell.init(opt.shell);
    log.init(opt.log);

    return args;
  }
};
