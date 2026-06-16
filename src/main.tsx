// packages
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Restore the path encoded by public/404.html before React Router reads the URL.
// GitHub Pages serves 404.html for unknown paths; it redirects to /?/the/path so
// index.html is served (path = "/"). This block converts that back to the real
// path before BrowserRouter ever initialises, so the correct route is matched.
(function restoreSpaPath() {
  const qs = window.location.search;
  if (!qs.startsWith('?/')) return;
  const parts = qs.slice(2).split('&').map((s) => s.replace(/~and~/g, '&'));
  const path = '/' + parts.shift()! + (parts.length ? '?' + parts.join('&') : '') + window.location.hash;
  window.history.replaceState(null, '', path);
}());

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
