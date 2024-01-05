// packages
import { createTheme } from '@mui/material/styles';
import { ThemeOptions } from '@mui/material';

// default theme
import DEFAULT_THEME from './defaultTheme';

export const MAIN_DARK_COLOR = '#292828';
export const MAIN_LIGHT_COLOR = '#f5f5f5';

export const darkTheme: ThemeOptions = createTheme({
  ...DEFAULT_THEME,
  components: {
    ...DEFAULT_THEME.components,
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          background: MAIN_DARK_COLOR,
        },
        root: {
          borderBottom: `1px solid rgba(245, 245, 245, 0.25)`,
          boxShadow: 'unset',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: MAIN_LIGHT_COLOR,
          cursor: 'pointer',
          textDecoration: 'none',
          ':hover': {
            color: '#ee764a'
          },

        }
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: MAIN_LIGHT_COLOR,
          fontSize: '14px',
          fontWeight: 500,
          '& .MuiSvgIcon-root': {
            color: MAIN_LIGHT_COLOR,
          },
        },
      },
    },
  },
  palette: {
    text: {
      primary: MAIN_LIGHT_COLOR
    },
    background: {
      default: MAIN_DARK_COLOR,
      paper: MAIN_DARK_COLOR,
    },
    mode: 'dark',
    primary: {
      light: '#f4ad94',
      main: '#F08E6A',
      dark: '#ee764a',
      contrastText: MAIN_LIGHT_COLOR,
    },
    secondary: {
      light: '#6accf0',
      main: '#06b8ea',
      dark: '#06b8ea',
      contrastText: MAIN_LIGHT_COLOR,
    },
  },
});

export default darkTheme;
