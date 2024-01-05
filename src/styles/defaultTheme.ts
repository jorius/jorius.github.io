// packages
import { ThemeOptions } from '@mui/material';

const DEFAULT_THEME: ThemeOptions = {
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          textDecoration: 'none',
        }
      }
    }
  },
  typography: {
    fontFamily: ['Comfortaa', 'monospace'].join(','),
    fontWeightBold: 700,
    fontWeightLight: 400,
    fontWeightRegular: 500,
  }
};

export default DEFAULT_THEME;
