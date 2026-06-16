// packages
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// components
import LegacyLayout from './components/LegacyLayout';
import { ScrollToTop } from './components/ScrollToTop';

// pages
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Palette from './pages/Palette';
import Pgp from './pages/Pgp';
import Portfolio from './pages/Portfolio';
import Writing from './pages/Writing';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Standalone routes — render their own chrome (header/footer baked in). */}
        <Route path="/" element={<Home />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/writing/:slug" element={<Writing />} />
        <Route path="/read/:slug" element={<Navigate to="/writing" replace />} />
        <Route path="/pgp" element={<Pgp />} />
        <Route path="/palette" element={<Palette />} />

        {/* Legacy routes — wrapped in old Header/Footer until each page is redesigned. */}
        <Route element={<LegacyLayout />}>
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* 404 — standalone, uses BTopBar. Must be last. */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
