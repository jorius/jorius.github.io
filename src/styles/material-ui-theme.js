// @packages
import { createMuiTheme } from '@material-ui/core/styles';

export const customPalette = {
  black: {
    dark: '#272727',
    light: '#59636A',
    main: '#414348',
  },
  blue: {
    dark: '#052F5F',
    light: '#4F9FFF',
    main: '#2088FF',
  },
  green: {

  },
  grey: {
    dark: '#8E8597',
    light: '#A4A5AE',
    main: '#9895A3',
  },
  orange: {
    dark: '#C45B00',
    light: '#FF8E5C',
    main: '#EC7C23',
  },
  red: {
    dark: '#840003',
    light: '#D79087',
    main: '#cb3837',
  },
  yellow: {
    dark: '#E7BB51',
    light: '#FFEECA',
    main: '#FFD166',
  },
  white: {
    dark: '#B1BDC5',
    light: '#FFFFFF',
    main: '#DADDE2',
  },
};

export const materialCustomTheme = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      root: {
        '&.Mui-focused': {
          color: customPalette.white.light,
        },
      },
    },
    MuiInput: {
      underline: {
        // TODO: Refactor this kind of implementation.
        '&:after': {
          borderBottom: `2px solid ${customPalette.white.light}`,
        },
        // TODO: Refactor this kind of implementation.
        '&.MuiInput-underline:hover:not(.Mui-disabled):before': {
          borderBottom: `2px solid ${customPalette.white.dark}`,
        },
        borderBottom: `1px solid ${customPalette.white.dark}`,
      },
    },
    MuiInputLabel: {
      formControl: {
        color: customPalette.white.light,
      },
    },
    MuiSelect: {
      icon: {
        color: customPalette.white.dark,
      },
      root: {
        color: customPalette.white.light,
      },
    },
  },
  palette: {
    custom: {
      ...customPalette,
    },
    primary: {
      ...customPalette.blue,
    },
    secondary: {
      ...customPalette.yellow,
    },
  },
  typography: {
    fontFamily: [
      'Oxygen Mono',
      'monospace',
    ].join(',')
  }
});
