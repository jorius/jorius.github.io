// packages
import { FaLinkedin, FaGithub, FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

// components
import LanguageSelector from "./LanguageSelector";

// utils
import { scrollToSection } from "../../utils/scrollUtils";

const Header = (): React.ReactElement => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInServicesSection, setIsInServicesSection] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const handleScroll = () => {
      const servicesSection = document.querySelector(
        'section[data-section="services"]',
      );
      if (servicesSection) {
        const rect = servicesSection.getBoundingClientRect();
        const isInView = rect.top <= 60 && rect.bottom >= 60;
        setIsInServicesSection(isInView);
      }

      const sectionIds = ["home", "services", "about", "contact"];
      let current = "home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 61) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBgClass = isInServicesSection
    ? "backdrop-blur-[7.5px] bg-white border border-solid border-portfolio-dark-900"
    : "backdrop-blur-[7.5px] bg-[#171717] border border-solid border-white";

  const textColorClass = isInServicesSection
    ? "text-portfolio-dark-900"
    : "text-white";
  const hoverClass = isInServicesSection
    ? "hover:bg-portfolio-dark-900/10"
    : "hover:bg-white/10";

  const getNavLinkClass = (sectionId: string): string => {
    const isPortfolioRoute = sectionId === "portfolio" && location.pathname === "/portfolio";
    const isSectionActive = sectionId !== "portfolio" && activeSection === sectionId && location.pathname === "/";
    if (isPortfolioRoute || isSectionActive) {
      return "px-8 py-3 rounded-none font-space-mono text-lg text-white tracking-[-0.3px] bg-[#505050] hover:bg-[#505050]/90 transition-all cursor-pointer";
    }
    return `px-8 py-3 rounded-none font-space-mono text-lg ${textColorClass} tracking-[-0.3px] ${hoverClass} transition-all cursor-pointer`;
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
          {/* Home */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              if (location.pathname === "/") {
                scrollToSection("home");
              } else {
                navigate("/", { state: { scrollTo: "home" } });
              }
            }}
            className={getNavLinkClass("home")}
          >
            {t("nav.home")}
          </a>

          {/* Services */}
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              if (location.pathname === "/") {
                scrollToSection("services");
              } else {
                navigate("/", { state: { scrollTo: "services" } });
              }
            }}
            className={getNavLinkClass("services")}
          >
            {t("nav.services", "Services")}
          </a>

          {/* About */}
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              if (location.pathname === "/") {
                scrollToSection("about");
              } else {
                navigate("/", { state: { scrollTo: "about" } });
              }
            }}
            className={getNavLinkClass("about")}
          >
            {t("nav.about")}
          </a>

          {/* Contact */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              if (location.pathname === "/") {
                scrollToSection("contact");
              } else {
                navigate("/", { state: { scrollTo: "contact" } });
              }
            }}
            className={getNavLinkClass("contact")}
          >
            {t("nav.contact")}
          </a>

          {/* Portfolio */}
          <a
            href="/portfolio"
            onClick={(e) => {
              e.preventDefault();
              navigate("/portfolio");
              window.scrollTo(0, 0);
            }}
            className={getNavLinkClass("portfolio")}
          >
            {t("nav.portfolio")}
          </a>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector />
        </div>
      </nav>
    </header>
  );
};

export default Header;
