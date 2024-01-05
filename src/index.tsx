// packages
import React from 'react';
import ReactDOM from 'react-dom/client';

// app
import App from './pages/App';

// vitals
import reportWebVitals from './reportWebVitals';

import '@fontsource/comfortaa/300.css';
import '@fontsource/comfortaa/400.css';
import '@fontsource/comfortaa/500.css';
import '@fontsource/comfortaa/700.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
