import colors from '@battis/qui-cli.colors';
import chalk from 'chalk';
import cliProgress from 'cli-progress';

type Options = {
  value?: number;
  max: number;
};

export class ProgressBar {
  private multibar: cliProgress.MultiBar;
  private bar: cliProgress.SingleBar;

  public static getInstance(options: Options) {
    return new ProgressBar(options);
  }

  public constructor({ value = 0, max }: Options) {
    this.multibar = new cliProgress.MultiBar({
      format: `{bar} {percentage}% {eta_formatted} ${colors.value('{caption}')}`,
      barCompleteChar: '█',
      barIncompleteChar: '█',
      autopadding: true,
      autopaddingChar: '   ',
      formatBar: (progress, options: cliProgress.Options) => {
        const completeSize = Math.round(progress * options.barsize!);
        const incompleteSize = options.barsize! - completeSize;
        return (
          chalk.green(options.barCompleteString!.substring(0, completeSize)) +
          options.barGlue +
          chalk.gray.dim(
            options.barIncompleteString!.substring(0, incompleteSize)
          )
        );
      }
    });
    this.bar = this.multibar.create(max, value);
    this.bar.update({ caption: '' });
  }

  public increment() {
    this.bar.increment();
  }

  public caption(caption: string) {
    this.bar.update({
      caption: caption.substring(0, 24) + (caption.length > 24 ? '…' : '')
    });
  }

  public stop() {
    this.multibar.stop();
  }
}

export default ProgressBar.getInstance;
