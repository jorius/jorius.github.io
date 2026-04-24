// packages
import { FiBriefcase } from "react-icons/fi";
import { useTranslation } from 'react-i18next';

// components
import SectionTitle from '../common/SectionTitle';

// data
import experiences from '../../data/experiences.json';

const WorkExperienceSection = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="w-full bg-white px-16 py-24">
      <div className="max-w-[1298px] mx-auto flex flex-col gap-24">
        {/* Section Title */}
        <div className="flex items-center justify-center py-[85px]">
          <SectionTitle>
            <span>{t("experience.title.part1", "My ")} </span>
            <span className="text-principal">
              {t("experience.title.part2", "Work Experience")}
            </span>
          </SectionTitle>
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-16">
          {experiences.map((exp, index) => (
            <div key={exp.key} className="flex items-start gap-12">
              {/* Left Column - Company and Date */}
              <div className="min-w-[500px] flex flex-col gap-3.5">
                <div className="flex items-center gap-4">
                  {/* Company Logo */}
                  <div
                    className="w-12 h-12 rounded overflow-hidden flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: exp.logo ? "white" : `${exp.color}15`,
                    }}
                  >
                    {exp.logo ? (
                      <img
                        src={exp.logo}
                        alt={exp.company}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <FiBriefcase
                        className="w-6 h-6"
                        style={{ color: exp.color }}
                      />
                    )}
                  </div>
                  <h3 className="font-space-mono font-bold text-[40px] text-portfolio-dark-700 leading-none tracking-[-0.6px]">
                    {t(`experience.${exp.key}.company`, exp.company)}
                  </h3>
                </div>
                <p className="font-space-mono text-2xl text-portfolio-gray-400 leading-none tracking-[-0.36px] ml-16">
                  {t(`experience.${exp.key}.period`, exp.period)}
                </p>
              </div>

              {/* Center - Timeline Dot */}
              <div className="relative flex flex-col items-center">
                <div className="w-12 h-12 flex items-center justify-center z-10">
                  <div
                    className="w-9 h-9 rounded-full"
                    style={{ backgroundColor: exp.color || "#0066CC" }}
                  />
                </div>
                {/* Vertical Line - only show if not last item */}
                {index < experiences.length - 1 && (
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[2px] h-[calc(100%+4rem)] bg-portfolio-gray-300" />
                )}
              </div>

              {/* Right Column - Role and Description */}
              <div className="flex-1 flex flex-col gap-3.5">
                <h4 className="font-space-mono font-bold text-3xl text-portfolio-dark-700 leading-none tracking-[-0.6px]">
                  {t(`experience.${exp.key}.role`)}
                </h4>
                <p className="font-space-mono text-lg text-portfolio-gray-400 tracking-[-0.27px] leading-normal">
                  {t(`experience.${exp.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkExperienceSection;
