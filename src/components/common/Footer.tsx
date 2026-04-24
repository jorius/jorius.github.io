// packages
import { FiArrowUpRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";

// components
import Button from "./Button";

// utils
import { scrollToSection } from "../../utils/scrollUtils";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#272727] rounded-tl-[24px] rounded-tr-[24px] px-16 py-6">
      <div className="max-w-[1298px] mx-auto flex flex-col gap-8">
        {/* Top Section */}
        <div className="flex items-center justify-between h-[130px]">
          <h2 className="font-space-mono font-bold text-[64px] text-white leading-normal tracking-[-0.96px] max-w-[909px]">
            {t("footer.cta", "Lets Connect There")}
          </h2>

          <Button
            variant="primary"
            size="md"
            className="px-5 py-2.5"
            icon={<FiArrowUpRight className="w-10 h-10" />}
          >
            {t("footer.hirMe", "Hire Me!")}
          </Button>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/20" />

        {/* Middle Section - Links */}
        <div className="grid grid-cols-2 gap-32 h-[258px]">
          {/* Navigation */}
          <div className="flex flex-col gap-7">
            <h3 className="font-space-mono font-bold text-xl text-principal tracking-[-0.3px]">
              {t("footer.navigation.title", "Navigation")}
            </h3>
            <nav className="flex flex-col gap-5 font-space-mono text-base text-white tracking-[-0.24px]">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("home");
                }}
                className="hover:text-principal transition-colors cursor-pointer"
              >
                {t("nav.home", "Home")}
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("about");
                }}
                className="hover:text-principal transition-colors cursor-pointer"
              >
                {t("nav.about", "About")}
              </a>
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("services");
                }}
                className="hover:text-principal transition-colors cursor-pointer"
              >
                {t("nav.services", "Services")}
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
                className="hover:text-principal transition-colors cursor-pointer"
              >
                {t("nav.contact", "Contact")}
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-7">
            <h3 className="font-space-mono font-bold text-xl text-principal tracking-[-0.3px]">
              {t("footer.contact.title", "Contact")}
            </h3>
            <div className="flex flex-col gap-5 font-roboto text-base text-white tracking-[-0.24px]">
              <a
                href="tel:+573013930289"
                className="hover:text-principal transition-colors"
              >
                +57 3013930289
              </a>
              <a
                href="mailto:josed.riosc@gmail.com"
                className="hover:text-principal transition-colors"
              >
                josed.riosc@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/20" />

        {/* Bottom Section - Copyright */}
        <div className="flex items-center justify-between text-xl text-white tracking-[-0.3px]">
          <p className="font-montserrat">
            {t("footer.copyright", "Copyright©")} {new Date().getFullYear()}.{" "}
            {t("footer.allRightsReserved", "All Rights Reserved.")}
          </p>
          <p className="font-space-mono text-right">
            {t("footer.legal", "User Terms & Conditions | Privacy Policy")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
