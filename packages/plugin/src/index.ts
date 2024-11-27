import {
  ConfigMetaSet,
  ConfigOptionBase,
  ConfigSet,
  ConfigType,
  OptionsResults
} from 'jackspeak';

type MetaSet<T extends ConfigType> = {
  value: ConfigMetaSet<T, false>;
  list: ConfigMetaSet<T, true>;
};

type opt = MetaSet<'string'>;
type flag = MetaSet<'boolean'>;
type num = MetaSet<'number'>;

export type Options = {
  num?: num['value'];
  numList?: num['list'];
  opt?: opt['value'];
  optList?: opt['list'];
  flag?: flag['value'];
  flagList?: flag['list'];
  fields?: ConfigSet;
} & {
  /** @deprecated use opt */
  options?: opt['value'];

  /** @deprecated use optList */
  optionLists?: opt['list'];

  /** @deprecated use flag */
  flags?: flag['value'];
} & {
  usage?: { text: string; level?: 1 | 2 | 3 | 4 | 5 | 6; pre?: boolean }[];
};

export type Arguments<O extends Options = Options> = {
  positionals?: string[];
  values?: OptionsResults<
    Record<keyof O['num'], ConfigOptionBase<'number', false>> &
      Record<keyof O['numList'], ConfigOptionBase<'number', true>> &
      Record<
        keyof O['opt'] | keyof O['options'],
        ConfigOptionBase<'string', false>
      > &
      Record<
        keyof O['optList'] | keyof O['optionLists'],
        ConfigOptionBase<'string', true>
      > &
      Record<
        keyof O['flag'] | keyof O['flags'],
        ConfigOptionBase<'boolean', false>
      > &
      Record<keyof O['flagList'], ConfigOptionBase<'boolean', true>>
  >;
};

export abstract class Base {
  public constructor(public readonly name: string) {}

  public options(): Options {
    return {};
  }

  public init(args: Arguments<ReturnType<Base['options']>>): void {}
}
