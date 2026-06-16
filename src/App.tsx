// packages
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// components
import Footer from './components/common/Footer';
import Header from './components/common/Header';
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

        {/* Legacy routes still wrapped in the pre-overhaul Header/Footer layout
            until each page gets its own design pass. */}
        <Route
          path="/*"
          element={(
            <div className="min-h-screen bg-light-bg text-light-text">
              <Header />
              <main>
                <Routes>
                  <Route path="/about" element={<About />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
