// packages
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="relative w-full min-h-[932px] flex flex-col items-center bg-white px-16 pt-10"
    >
      {/* Main Content Container */}
      <div className="relative w-full max-w-[1440px] flex flex-col items-center">
        {/* Hello Badge and Title */}
        <div className="flex flex-col items-center gap-2.5 mt-20">
          <h1 className="font-vast-shadow font-bold text-[64px] text-center leading-none tracking-[-1.4335px] max-w-[1197px]">
            <span className="inline-flex items-center gap-4">
              <span className="bg-white/10 border-[1.275px] border-portfolio-dark-900 rounded-none px-6 py-3 font-vast-shadow font-bold text-[64px] text-portfolio-dark-900 tracking-[-1.4335px]">
                {t("hero.greeting", "Hello!")}
              </span>
              <span className="text-portfolio-dark-900">
                {t("hero.intro", "I'm ")}{" "}
              </span>
              <span className="text-principal">{t("hero.name", "Jose")}</span>
              <span className="text-portfolio-dark-900">,</span>
            </span>
            <br />
            <span className="text-portfolio-dark-900">
              {t("hero.title", "Software Developer and Cybersecurity Analyst")}
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
