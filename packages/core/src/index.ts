import * as plugin from '@battis/qui-cli.plugin';
import { Jack, JackOptions } from 'jackspeak';

export type Options = JackOptions & {
  requirePositionals?: boolean | number;
} & plugin.Options;

export class Core {
  private plugins = new Map<string, plugin.Base>();

  private _jack: Jack | undefined = undefined;
  private get jack() {
    if (!this._jack) {
      throw new Error('jackspeak has not been instantiated');
    }
    return this._jack;
  }

  private requirePositionals: boolean | number | undefined = undefined;

  public register(plugin: plugin.Base) {
    this.plugins.set(plugin.name, plugin);
  }

  private apply(config: plugin.Options) {
    const {
      num,
      numList,
      opt,
      options,
      optList,
      optionLists,
      flag,
      flags,
      flagList,
      fields,
      usage
    } = config;
    num && this.jack.num(num);
    numList && this.jack.numList(numList);
    opt && this.jack.opt(opt);
    options && this.jack.opt(options);
    optList && this.jack.optList(optList);
    optionLists && this.jack.optList(optionLists);
    flag && this.jack.flag(flag);
    flags && this.jack.flag(flags);
    flagList && this.jack.flagList(flagList);
    fields && this.jack.addFields(fields);
    if (usage) {
      for (const entry of usage) {
        if (entry.level) {
          this.jack.heading(entry.text, entry.level, { pre: entry.pre });
        } else {
          this.jack.description(entry.text, { pre: entry.pre });
        }
      }
    }
  }

  public init(options: Options = {}) {
    const {
      requirePositionals: _reqPos,
      allowPositionals,
      env,
      envPrefix,
      usage,
      stopAtPositional
    } = options;
    this.requirePositionals = _reqPos;
    this._jack = new Jack({
      allowPositionals:
        allowPositionals !== undefined
          ? allowPositionals
          : !!this.requirePositionals,
      envPrefix,
      env,
      usage,
      stopAtPositional
    }).flag({
      help: {
        short: 'h',
        description: 'Get usage information'
      }
    });
    this.apply(options);

    for (const [_, plugin] of this.plugins) {
      plugin.options && this.apply(plugin.options());
    }

    const { positionals = [], values = {} } = this.jack.parse();

    if (
      this.requirePositionals &&
      (!positionals.length ||
        (typeof this.requirePositionals == 'number' &&
          positionals.length < this.requirePositionals))
    ) {
      throw new Error(
        `Incorrect positional arguments (${this.requirePositionals} expected, ${positionals.length} provided)`
      );
    }
    if ('help' in values && values.help) {
      console.log(usage);
      process.exit(0);
    }

    return { positionals, values };
  }

  public usage() {
    let usage = this.jack.usage();
    if (this.requirePositionals) {
      if (typeof this.requirePositionals === 'number') {
        if (this.requirePositionals > 1) {
          usage = usage.replace(
            /\n\n/m, // FIXME hilariously unreliable regex!
            ` arg0..arg${this.requirePositionals - 1}\n\n`
          );
        } else {
          usage = usage.replace(/\n\n/m, ' argument\n\n');
        }
      } else {
        usage = usage.replace(/\n\n/m, ' argument0...\n\n');
      }
    }
    return usage;
  }

  public usageMarkdown() {
    return this.jack.usageMarkdown(); // FIXME format arguments
  }
}
