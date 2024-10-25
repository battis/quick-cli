import { EnvironmentOptions } from '../env/options.js';
import { LogOptions } from '../log/options.js';
import { ShellOptions } from '../shell/options.js';
import { ConfigMetaSet } from 'jackspeak';

export type OptionsConfig = ConfigMetaSet<'string', false>;
export type OptionListsConfig = ConfigMetaSet<'string', true>;
export type FlagsConfig = ConfigMetaSet<'boolean', false>;

export type ArgumentOptions = {
  envPrefix: string;
  requirePositionals: boolean | number;
  options: OptionsConfig;
  optionLists: OptionListsConfig;
  flags: FlagsConfig;
};

export type Options = {
  env: EnvironmentOptions;
  args: ArgumentOptions;
  shell: ShellOptions;
  log: LogOptions;
};
