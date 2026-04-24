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

function App() {
  return (
    <Router>
      <Routes>
        {/* Palette route - isolated without layout */}
        <Route path="/palette" element={<Palette />} />

        {/* Main routes with layout */}
        <Route path="/*" element={
          <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-white">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

