export type CustomLevels = {
  levels: { [name: string]: number };
  colors: { [name: string]: string };
};

export type LogOptions = {
  logFilePath?: string;
  stdoutLevel: string;
  fileLevel: string;
  levels: CustomLevels;
  root: string;
};

export const DefaultLevels: CustomLevels = {
  levels: {
    all: 0,
    trace: 1,
    debug: 2,
    info: 3,
    warning: 4,
    error: 5,
    fatal: 6
  },
  colors: {
    trace: 'blue',
    debug: 'blue',
    info: 'white',
    warning: 'bold yellow',
    error: 'bold red',
    fatal: 'bold black redBG'
  }
};
