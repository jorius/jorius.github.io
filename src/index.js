// @packages
import React from 'react';
import ReactDOM from 'react-dom';
import dotenv from 'dotenv';

// @components
import AppContainer from './containers/app';

// @styles
import './assets/css/site.css';

dotenv.config();

ReactDOM.render(
  <React.StrictMode>
    <AppContainer />
  </React.StrictMode>,
  document.getElementById('root')
);
