export type Colors = {
  foreground: string;
  background: string;
  table: {
    rowDark: string;
    rowLight: string;
    updateUp: string;
    updateDown: string;
  };
  button: {
    background: string;
  };
};

export type Theme = {
  [type: string]: {
    colors: Colors;
  };
};

export enum ThemeType {
  Light = 'light',
  Dark = 'dark',
}
