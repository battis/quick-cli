import { Arguments } from './Arguments.js';
import { Options } from './Options.js';

export { Arguments, Options };

export abstract class Base {
  public constructor(public readonly name: string) {}

  public options(): Options {
    return {};
  }

  public init(args: Arguments<ReturnType<this['options']>>): void {}
}
