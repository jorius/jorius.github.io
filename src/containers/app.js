// @packages
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';

// @pages
import MainRoutes from '../configuration/routes';

// @store
import { store } from '../core';

// @theme
import { materialCustomTheme } from '../styles';

const AppContainer = () => (
  <Provider store={store}>
    <ThemeProvider theme={materialCustomTheme}>
      <CssBaseline />
      <BrowserRouter>
        <MainRoutes />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);

export default AppContainer;
