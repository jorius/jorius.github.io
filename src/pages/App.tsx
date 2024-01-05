// packages
import React from 'react';
import {
  ThemeProvider,
} from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import { GlobalStyles } from '@mui/material';

// components
import McTopbar from '../components/Topbar';
import McAboutMe from '../components/AboutMe';

// theme
import { darkTheme } from '../styles/theme';
import global from '../styles/global';

export const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles styles={global} />
      <CssBaseline />
      <McTopbar />
      <McAboutMe />
    </ThemeProvider>
  );
};

export default App;
