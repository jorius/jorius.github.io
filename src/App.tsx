// packages
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// components
import Footer from './components/common/Footer';
import Header from './components/common/Header';

// pages
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Palette from './pages/Palette';
import Portfolio from './pages/Portfolio';
import Read from './pages/Read';

function App() {
  return (
    <Router>
      <Routes>
        {/* Standalone routes — render their own chrome (header/footer baked in). */}
        <Route path="/" element={<Home />} />
        <Route path="/read/:slug" element={<Read />} />
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
