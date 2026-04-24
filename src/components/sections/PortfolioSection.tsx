// packages
import { FiArrowUpRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

// components
import Badge from '../common/Badge';
import Button from '../common/Button';
import SectionTitle from '../common/SectionTitle';

// data
import portfolio from '../../data/portfolio.json';

const { projects, tags } = portfolio;

const PortfolioSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-white px-16 py-24">
      <div className="max-w-[1298px] mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <SectionTitle className="max-w-[643px]">
            <span>{t('portfolio.title.part1', 'Lets have a look at my ')} </span>
            <span className="text-principal">{t('portfolio.title.part2', 'Portfolio')}</span>
          </SectionTitle>

          <Button variant="primary" size="md">
            {t('portfolio.seeAll', 'See All')}
          </Button>
        </div>

        {/* Portfolio Grid and Details */}
        <div className="flex flex-col gap-12">
          {/* Projects Grid */}
          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="relative h-[371px] rounded-[20px] overflow-hidden group cursor-pointer"
                >
                  {/* Project Image */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/50" />

                  {/* Arrow Button */}
                  <div className="absolute top-4 right-4 border-2 border-white rounded-full p-6 rotate-90 group-hover:bg-white group-hover:text-portfolio-dark-900 transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {/* Project Title */}
                  <div className="absolute bottom-10 left-10">
                    <h3 className="font-lufga font-bold text-[70px] text-white leading-[61px] tracking-[-1.05px]">
                      {project.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-3">
              <div className="bg-principal h-[15px] w-[60px] rounded-[21px]" />
              <div className="bg-portfolio-gray-200 h-[15px] w-[15px] rounded-full" />
              <div className="bg-portfolio-gray-200 h-[15px] w-[15px] rounded-full" />
              <div className="bg-portfolio-gray-200 h-[15px] w-[15px] rounded-full" />
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-3.5 flex-wrap">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          {/* Project Details */}
          <div className="flex flex-col gap-6">
            <div className="flex gap-5 items-end">
              <h3 className="font-space-mono font-bold text-5xl text-portfolio-dark-700 leading-none tracking-[-0.72px] flex-1">
                {t('portfolio.featured.title', 'Mabooo - Technology Solution')}
              </h3>
              <button className="border-2 border-white rounded-full p-6 rotate-90 hover:bg-portfolio-dark-900 hover:border-portfolio-dark-900 transition-all">
                <FiArrowUpRight className="w-8 h-8 text-portfolio-dark-900 hover:text-white" />
              </button>
            </div>

            <p className="font-space-mono text-xl text-portfolio-dark-700 text-center tracking-[-0.3px] leading-none max-w-[742px]">
              {t('portfolio.featured.description', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue interdum ligula a dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lobortis orci elementum egestas lobortis.')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
