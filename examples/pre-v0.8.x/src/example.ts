import cli from '@battis/qui-cli';

const {
  positionals: [arg0, arg1],
  values: { opt0, opt1, flag0, flag1, ...rest }
} = cli.init({
  args: {
    allowPositionals: true,
    options: {
      opt0: {},
      opt1: {}
    },
    flags: {
      flag0: { default: false },
      flag1: { default: false }
    }
  }
});

cli.log.info({ flag0, flag1, opt0, opt1, arg0, arg1, rest });
