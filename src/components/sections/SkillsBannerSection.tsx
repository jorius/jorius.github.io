// packages
import React from 'react';

const SkillsBannerSection: React.FC = () => {
  const skills = [
    'UX/UI Interface',
    'App Design',
    'Back End',
    'Cybersecurity',
    'User Research',
    'UX Design',
    'App Design',
    'Dashboard',
    'Wireframe',
  ];

  return (
    <section className="w-full bg-principal h-[147px] rounded-none overflow-hidden flex items-center">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-4 rotate-[-2.5deg]">
        {/* Duplicate the skills array for seamless loop */}
        {[...skills, ...skills, ...skills].map((skill, index) => (
          <React.Fragment key={index}>
            <span className="font-space-mono text-5xl text-black tracking-[-0.72px] inline-block">
              {skill}
            </span>
            <svg
              className="w-9 h-9 inline-block"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default SkillsBannerSection;
