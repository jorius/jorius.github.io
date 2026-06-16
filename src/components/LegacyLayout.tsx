// packages
import { Outlet } from 'react-router-dom';

// components
import Footer from './common/Footer';
import Header from './common/Header';

const LegacyLayout = (): React.ReactElement => (
  <div className="min-h-screen bg-light-bg text-light-text">
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default LegacyLayout;
