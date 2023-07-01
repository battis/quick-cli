import { ConfigMetaSet } from 'jackspeak';
import { LogOptions } from '../log/options';
import { ShellOptions } from '../shell/options';

export type OptionsConfig = ConfigMetaSet<'string', false>;
export type OptionListsConfig = ConfigMetaSet<'string', true>;
export type FlagsConfig = ConfigMetaSet<'boolean', false>;

export type EnvironmentOptions = {
  root: string;
  loadDotEnv: boolean | string;
  setRootAsCurrentWorkingDirectory: boolean;
};

export type ArgumentOptions = {
  envPrefix: string;
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
