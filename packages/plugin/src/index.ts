import { Arguments } from './Arguments.js';
import { Options } from './Options.js';

export { Arguments, Options };

export abstract class Base {
  public constructor(public readonly name: string) {}

  /**
   * Override to include custom Jackspeak configuration.
   *
   * Will be called _before_ init() has been called.
   */
  public options(): Options {
    return {};
  }

  /**
   * Override to process user-provided arguments parsed by Jackspeak
   */
  public init(args: Arguments<ReturnType<this['options']>>): void {}
}
