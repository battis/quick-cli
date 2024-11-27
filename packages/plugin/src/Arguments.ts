import { ConfigSetFromMetaSet, OptionsResults } from 'jackspeak';
import { Options } from './Options.js';

type FlattenConfigMetaSets<O extends Options> = ConfigSetFromMetaSet<
  'number',
  false,
  Exclude<O['num'], undefined>
> &
  ConfigSetFromMetaSet<'number', true, Exclude<O['numList'], undefined>> &
  ConfigSetFromMetaSet<'string', false, Exclude<O['opt'], undefined>> &
  ConfigSetFromMetaSet<'string', false, Exclude<O['opt'], undefined>> &
  ConfigSetFromMetaSet<'string', false, Exclude<O['options'], undefined>> &
  ConfigSetFromMetaSet<'string', true, Exclude<O['optList'], undefined>> &
  ConfigSetFromMetaSet<'string', true, Exclude<O['optionLists'], undefined>> &
  ConfigSetFromMetaSet<'boolean', false, Exclude<O['flag'], undefined>> &
  ConfigSetFromMetaSet<'boolean', false, Exclude<O['flags'], undefined>> &
  ConfigSetFromMetaSet<'boolean', true, Exclude<O['flagList'], undefined>> &
  Exclude<O['fields'], undefined>;

export type Arguments<O extends Options> = {
  positionals: (string | undefined)[];
  values: OptionsResults<FlattenConfigMetaSets<O>>;
};
