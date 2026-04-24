// packages
import { useTranslation } from 'react-i18next';

// data
import testimonials from '../../data/testimonials.json';

const TestimonialsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full bg-portfolio-dark-900 rounded-[50px] overflow-hidden px-16 py-32">
      <div className="relative z-10 max-w-[1300px] mx-auto flex flex-col gap-24">
        {/* Section Title */}
        <div className="flex flex-col items-center pb-5 text-center">
          <h2 className="font-space-mono text-5xl text-white tracking-[-0.72px] leading-normal max-w-[1164px]">
            <span>{t('testimonials.title.part1', 'Testimonials That Speak to ')} </span>
            <span className="text-principal">{t('testimonials.title.part2', 'My Results')}</span>
          </h2>

          <p className="font-space-mono text-xl text-portfolio-gray-50 tracking-[-0.3px] leading-normal max-w-[966px] mt-6">
            {t('testimonials.description', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue interdum ligula a dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lobortis orci elementum egestas lobortis.')}
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative h-[306px] overflow-hidden">
          <div className="flex gap-[52px] absolute left-1/2 -translate-x-[40%]">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="backdrop-blur-[7px] bg-white/14 rounded-[24px] p-5 flex flex-col gap-3.5 w-[784px] flex-shrink-0"
              >
                {/* Header */}
                <div className="flex gap-3 items-start">
                  <div className="w-[55px] h-[55px] rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0" />
                  <div className="flex flex-col">
                    <p className="font-urbanist font-bold text-[23.5px] text-white leading-normal">
                      {testimonial.name}
                    </p>
                    <p className="font-urbanist text-[18.3px] text-white leading-normal">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-space-mono text-[25.7px] text-white tracking-[-0.385px] leading-normal ml-1">
                    {testimonial.rating}
                  </span>
                </div>

                {/* Comment */}
                <p className="font-space-mono text-xl text-portfolio-gray-50 tracking-[-0.3px] leading-normal max-w-[742px]">
                  {testimonial.comment}
                </p>

                {/* Quote Icon */}
                <div className="absolute right-6 top-3 w-32 h-32 opacity-20">
                  <svg viewBox="0 0 128 128" fill="currentColor" className="text-white">
                    <path d="M64 128c35.346 0 64-28.654 64-64S99.346 0 64 0 0 28.654 0 64s28.654 64 64 64zm-24-96c-13.255 0-24 10.745-24 24s10.745 24 24 24c2.945 0 5.76-.548 8.376-1.52C45.418 85.048 40 93.74 40 104h16c0-13.255 10.745-24 24-24V56c-13.255 0-24-10.745-24-24h-16zm48 0c-13.255 0-24 10.745-24 24s10.745 24 24 24c2.945 0 5.76-.548 8.376-1.52C93.418 85.048 88 93.74 88 104h16c0-13.255 10.745-24 24-24V56c-13.255 0-24-10.745-24-24h-16z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrow */}
          <button className="absolute right-0 top-1/2 -translate-y-1/2 border-2 border-white rounded-full p-6 rotate-90 hover:bg-white hover:text-portfolio-dark-900 transition-all">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
