// packages
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// contexts
import { BThemeProvider } from './contexts/ThemeContext';

// components
import App from './App.tsx';

// i18n
import './i18n';

// styles
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BThemeProvider>
      <App />
    </BThemeProvider>
  </StrictMode>,
);
