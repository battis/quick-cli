export type CustomLevels = {
  levels: { [name: string]: number };
  colors: { [name: string]: string };
};

export const DefaultLevels: CustomLevels = {
  levels: {
    all: 6,
    trace: 5,
    debug: 4,
    info: 3,
    warning: 2,
    error: 1,
    fatal: 0
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
