// packages
import { useTranslation } from 'react-i18next';

// components
import SectionTitle from '../common/SectionTitle';

const WhyHireMeSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-portfolio-gray-100 rounded-none overflow-hidden px-16 py-32">
      <div className="max-w-[1299px] mx-auto flex gap-20 items-center">
        {/* Left Side - Profile Image */}
        <div className="relative w-[603px] h-[600px] flex-shrink-0">
          <img
            src="/images/why-hire-me-pfp.png"
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <SectionTitle>
              <span>{t("whyHire.title.part1", "Why ")} </span>
              <span className="text-principal">
                {t("whyHire.title.part2", "Hire me")}
              </span>
              <span>?</span>
            </SectionTitle>
          </div>

          <p className="font-space-mono text-xl text-portfolio-gray-400 tracking-[-0.3px] leading-normal max-w-[444px]">
            {t(
              "whyHire.description",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacus nunc, posuere in justo vulputate, bibendum sodales ",
            )}
          </p>

          {/* CTA Button */}
          <button className="border-2 border-portfolio-dark-900 rounded-none px-14 py-8 font-space-mono font-bold text-[25.692px] text-portfolio-dark-900 tracking-[-0.3854px] hover:bg-portfolio-dark-900 hover:text-white transition-all duration-300 self-start">
            {t("whyHire.cta", "Hire Me!")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyHireMeSection;
