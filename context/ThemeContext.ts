import { createContext } from 'react';
import { Theme, ThemeType } from './types';

export const ThemeContext = createContext<{
  theme: ThemeType;
  setTheme: () => void;
}>({
  theme: ThemeType.Light,
  setTheme: () => {},
});

export const themes: Theme = {
  light: {
    colors: {
      foreground: '#343b58',
      background: '#d5d6db',
      table: {
        rowDark: '#D5D6DB',
        rowLight: '#EBECF2',
        updateUp: '#9ece6a',
        updateDown: '#f7768e',
      },
      button: {
        background: '#5a4a78',
      },
    },
  },
  dark: {
    colors: {
      foreground: '#a9b1d6',
      background: '#1a1b26',
      table: {
        rowDark: '#414868',
        rowLight: '#565f89',
        updateUp: '#526B37',
        updateDown: '#733742',
      },
      button: {
        background: '#c0caf5',
      },
    },
  },
};