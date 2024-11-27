import * as plugin from '@battis/qui-cli.plugin';
import appRoot from 'app-root-path';

export type Options = {
  root?: string;
};

export class Root extends plugin.Base {
  private root: string;

  private static singleton?: Root;

  public static getInstance(options?: Options) {
    if (!this.singleton) {
      this.singleton = new Root(options);
    }
    return this.singleton;
  }

  public constructor({ root }: Options = {}) {
    super('root');
    if (Root.singleton) {
      throw new Error('AppRoot is a singleton class');
    } else {
      Root.singleton = this;
    }
    if (root) {
      this.root = root;
    } else {
      this.root = appRoot.toString();
    }
  }

  /** @deprecated use Root.path() */
  public appRoot() {
    return this.root;
  }

  public path() {
    return this.root;
  }
}

export default () => Root.getInstance().path();
