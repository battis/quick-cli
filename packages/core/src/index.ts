import * as plugin from '@battis/qui-cli.plugin';
import { ArrayElement } from '@battis/typescript-tricks';
import { Jack, JackOptions } from 'jackspeak';

export type Options = JackOptions & {
  requirePositionals?: boolean | number;
} & plugin.Options;

export class Core {
  public static readonly defaults = {
    requirePositionals: undefined,
    allowPositionals: true,
    envPrefix: 'ARG',
    env: process.env,
    usage: undefined,
    stopAtPositional: false
  };

  public plugins: plugin.Base[] = [];

  private _jack: Jack | undefined = undefined;
  private get jack() {
    if (!this._jack) {
      throw new Error('jackspeak has not been instantiated');
    }
    return this._jack;
  }

  private requirePositionals: boolean | number | undefined = undefined;

  public register(plugin: plugin.Base) {
    if (!this.plugins.includes(plugin)) {
      this.plugins.push(plugin);
    }
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
    this.jack
      .num({ ...num })
      .numList({ ...numList })
      .opt({ ...options, ...opt })
      .optList({ ...optionLists, ...optList })
      .flag({ ...flags, ...flag })
      .flagList({ ...flagList })
      .addFields({ ...fields });
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

  public init(
    options: Options = {}
  ): plugin.Arguments<
    typeof options &
      ReturnType<ArrayElement<(typeof this)['plugins']>['options']>
  > {
    const {
      requirePositionals: _reqPos = Core.defaults.requirePositionals,
      allowPositionals = Core.defaults.allowPositionals,
      env = Core.defaults.env,
      envPrefix = Core.defaults.envPrefix,
      usage = Core.defaults.usage,
      stopAtPositional = Core.defaults.stopAtPositional
    } = options;
    this.requirePositionals = _reqPos;
    this._jack = new Jack({
      allowPositionals:
        allowPositionals !== undefined
          ? allowPositionals
          : !!this.requirePositionals,
      envPrefix,
      usage,
      env,
      stopAtPositional
    }).flag({
      help: {
        short: 'h',
        description: 'Get usage information'
      }
    });
    let opt: plugin.Options = options;

    for (const plugin of this.plugins) {
      const pluginOptions = plugin.options();
      opt = {
        num: { ...opt.num, ...pluginOptions.num },
        numList: { ...opt.numList, ...pluginOptions.numList },
        opt: {
          ...opt.options,
          ...opt.opt,
          ...pluginOptions.options,
          ...pluginOptions.opt
        },
        optList: {
          ...opt.optionLists,
          ...opt.optList,
          ...pluginOptions.optionLists,
          ...pluginOptions.optList
        },
        flag: {
          ...opt.flags,
          ...opt.flag,
          ...pluginOptions.flags,
          ...pluginOptions.flag
        },
        flagList: { ...opt.flagList, ...pluginOptions.flagList },
        fields: { ...opt.fields, ...pluginOptions.fields },
        usage: [...(opt.usage || []), ...(pluginOptions.usage || [])]
      };
      this.apply(opt);
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
      console.log(this.usage());
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
