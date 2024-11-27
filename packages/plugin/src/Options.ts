import { ConfigMetaSet, ConfigSet, ConfigType } from 'jackspeak';

type MetaSet<T extends ConfigType> = {
  value: ConfigMetaSet<T, false>;
  list: ConfigMetaSet<T, true>;
};

type opt = MetaSet<'string'>;
type flag = MetaSet<'boolean'>;
type num = MetaSet<'number'>;

type Paragraph = {
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  pre?: boolean;
};

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
  man?: Paragraph[];
};
