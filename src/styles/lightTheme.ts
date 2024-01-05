// packages
import { createTheme } from '@mui/material/styles';

import DEFAULT_THEME from './defaultTheme';

export const lightTheme = createTheme({
  ...DEFAULT_THEME,
  palette: {
    background: {
      default: '#000',
      paper: '#e0e0e0',
    },
    mode: 'light',
    primary: {
      light: '#f4ad94',
      main: '#F08E6A',
      dark: '#ee764a',
      contrastText: '#f5f5f5',
    },
    secondary: {
      light: '#6accf0',
      main: '#06b8ea',
      dark: '#06b8ea',
      contrastText: '#f5f5f5',
    },
  }
});

export default lightTheme;
