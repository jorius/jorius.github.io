// packages
import { FaLinkedin, FaGithub, FaWhatsapp } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// components
import LanguageSelector from './LanguageSelector';

// hooks
import { useScrollToSection } from '../../hooks/useNavigation';

interface NavItem {
  labelKey: string;
  sectionId?: string;
  route?: string;
}

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.home', sectionId: 'b-now' },
  { labelKey: 'nav.services', sectionId: 'b-services' },
  { labelKey: 'nav.about', route: '/about' },
  { labelKey: 'nav.contact', sectionId: 'b-contact' },
  { labelKey: 'nav.portfolio', route: '/portfolio' },
];

const Header = (): React.ReactElement => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToSection = useScrollToSection();
  const [isInServicesSection, setIsInServicesSection] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    const handleScroll = (): void => {
      const servicesSection = document.querySelector('section[data-section="services"]');
      if (servicesSection) {
        const rect = servicesSection.getBoundingClientRect();
        setIsInServicesSection(rect.top <= 60 && rect.bottom >= 60);
      }

      const sectionIds = ['home', 'services', 'about', 'contact'];
      let current = 'home';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 61) current = id;
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navBgClass = isInServicesSection
    ? 'backdrop-blur-[7.5px] bg-white border border-solid border-portfolio-dark-900'
    : 'backdrop-blur-[7.5px] bg-[#171717] border border-solid border-white';

  const textColorClass = isInServicesSection ? 'text-portfolio-dark-900' : 'text-white';
  const hoverClass = isInServicesSection ? 'hover:bg-portfolio-dark-900/10' : 'hover:bg-white/10';

  const getNavLinkClass = (item: NavItem): string => {
    const isPortfolioRoute = item.route === '/portfolio' && location.pathname === '/portfolio';
    const isSectionActive = item.sectionId !== undefined && activeSection === item.sectionId && location.pathname === '/';
    if (isPortfolioRoute || isSectionActive) {
      return 'px-8 py-3 rounded-none font-space-mono text-lg text-white tracking-[-0.3px] bg-[#505050] hover:bg-[#505050]/90 transition-all cursor-pointer';
    }
    return `px-8 py-3 rounded-none font-space-mono text-lg ${textColorClass} tracking-[-0.3px] ${hoverClass} transition-all cursor-pointer`;
  };

  const handleNavClick = (e: React.MouseEvent, item: NavItem): void => {
    e.preventDefault();
    if (item.route) {
      navigate(item.route);
      window.scrollTo(0, 0);
    } else if (item.sectionId) {
      scrollToSection(item.sectionId);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`${navBgClass} rounded-none px-16 py-2 flex items-center justify-between w-full h-[60px] transition-colors duration-300`}
      >
        {/* Social Icons - Left */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/jose-rios-4ab123163/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${textColorClass} ${hoverClass} p-2 rounded transition-all`}
          >
            <FaLinkedin className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/jorius"
            target="_blank"
            rel="noopener noreferrer"
            className={`${textColorClass} ${hoverClass} p-2 rounded transition-all`}
          >
            <FaGithub className="w-5 h-5" />
          </a>
          <a
            href="https://wa.me/573013930289"
            target="_blank"
            rel="noopener noreferrer"
            className={`${textColorClass} ${hoverClass} p-2 rounded transition-all`}
          >
            <FaWhatsapp className="w-5 h-5" />
          </a>
        </div>

        <div className="flex items-center justify-center flex-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.labelKey}
              href={item.route ?? `#${item.sectionId}`}
              onClick={(e) => handleNavClick(e, item)}
              className={getNavLinkClass(item)}
            >
              {t(item.labelKey)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector />
        </div>
      </nav>
    </header>
  );
};

export default Header;
