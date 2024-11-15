import { RecursivePartial } from '@battis/typescript-tricks';
import appRootPath from 'app-root-path';
import { jack, Jack } from 'jackspeak';
import process from 'process';
import * as env from './env.js';
import * as log from './log.js';
import options from './options.js';
import { Options } from './options/types.js';
import shell from './shell.js';

export type Arguments = {
  values: { [name: string]: string };
  positionals: string[];
};

export default {
  appRoot: () => appRootPath.toString(),

  init: function (config?: RecursivePartial<Options>): Arguments {
    const opt = options.hydrate(config || {});

    env.init(opt.env);

    const {
      envPrefix,
      requirePositionals,
      options: _options,
      optionLists,
      flags,
      ...jackOptions
    } = opt.args;

    const allowPositionals = !!requirePositionals;
    let j = jack({ envPrefix, allowPositionals })
      .opt(_options)
      .optList(optionLists)
      .flag(flags);
    for (const jackOption in jackOptions) {
      if (typeof j[jackOption as keyof Jack] === 'function') {
        // @ts-ignore FIXME typing gets... tricky here
        j = j[jackOption](jackOptions[jackOption]);
      }
    }
    const args = j.parse();
    if (
      args.values['help'] ||
      (opt.args.requirePositionals &&
        (!args.positionals.length ||
          (typeof opt.args.requirePositionals == 'number' &&
            args.positionals.length < opt.args.requirePositionals)))
    ) {
      let usage = j.usage();
      if (opt.args.requirePositionals) {
        if (typeof opt.args.requirePositionals === 'number') {
          if (opt.args.requirePositionals > 1) {
            usage = usage.replace(
              /\n\n/m,
              ` arg0..arg${opt.args.requirePositionals - 1}\n\n`
            );
          } else {
            usage = usage.replace(/\n\n/m, ' argument\n\n');
          }
        } else {
          usage = usage.replace(/\n\n/m, ' argument0...\n\n');
        }
      }
      shell.echo(usage);
      process.exit(0);
    }

    if (opt.env.setRootAsCurrentWorkingDirectory) {
      opt.log.root = opt.env.root;
    }
    opt.log.logFilePath = args.values.logFilePath || opt.log.logFilePath;
    opt.log.stdoutLevel = args.values.stdoutLevel || opt.log.stdoutLevel;
    opt.log.fileLevel = args.values.fileLevel || opt.log.fileLevel;
    log.init(opt.log);

    opt.shell.silent =
      args.values.silent !== undefined
        ? !!args.values.silent
        : opt.shell.silent;
    opt.shell.showCommands =
      args.values.commands !== undefined
        ? !!args.values.commands
        : opt.shell.showCommands;

    shell.init(opt.shell);

    return args as Arguments;
  }
};
