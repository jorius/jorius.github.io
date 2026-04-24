// packages
import { FiArrowUpRight } from 'react-icons/fi';
import { useState } from "react";
import { useTranslation } from 'react-i18next';

// data
import services from '../../data/services.json';

const ServicesSection = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const cardsPerSlide = 3;
  const totalSlides = Math.ceil(services.length / cardsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section
      id="services"
      data-section="services"
      className="relative w-full bg-portfolio-dark-900 overflow-hidden px-16 py-32"
    >
      {/* Background Pattern/Texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('/bg-pattern.jpg')] bg-cover bg-center" />

      <div className="relative z-10 max-w-[1299px] mx-auto flex flex-col gap-24">
        {/* Section Header */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <h2 className="font-space-mono font-bold text-[96px] text-principal leading-none tracking-[-1.44px]">
              {t("services.title", "Services")}
            </h2>
          </div>
          <p className="font-space-mono text-lg text-white tracking-[-0.27px] leading-normal max-w-[576px]">
            {t(
              "services.description",
              "Leveraging 10+ years of experience in software development, cloud architecture, and cybersecurity to deliver robust, scalable solutions for businesses worldwide.",
            )}
          </p>
        </div>

        {/* Services Cards Carousel */}
        <div className="flex flex-col gap-10">
          {/* Carousel Container */}
          <div className="relative">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-20 bg-white/10 backdrop-blur-sm p-4 rounded-full hover:bg-principal transition-all duration-300"
              aria-label="Previous slide"
            >
              <FiArrowUpRight className="w-8 h-8 text-white rotate-[225deg]" />
            </button>

            {/* Cards Container */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="min-w-full flex gap-6">
                    {services
                      .slice(
                        slideIndex * cardsPerSlide,
                        (slideIndex + 1) * cardsPerSlide,
                      )
                      .map((service) => (
                        <div
                          key={service.key}
                          className="relative group w-[413px] h-[508px] overflow-hidden bg-white flex-shrink-0 border-4 border-principal/20 hover:border-principal transition-all duration-300 shadow-xl"
                        >
                          {/* Top Section with Title */}
                          <div className="absolute top-11 left-0 right-0 px-9">
                            <div className="flex items-start justify-between">
                              <p className="font-space-mono text-[32px] text-portfolio-dark-900 tracking-[-0.48px] leading-normal flex-1 font-bold">
                                {t(
                                  `services.items.${service.key}`,
                                  service.title,
                                )}
                              </p>
                            </div>

                            {/* Separator Line */}
                            <div className="w-full h-[2px] bg-principal/60 mt-6" />
                          </div>

                          {/* Arrow Button */}
                          <button className="absolute bottom-8 right-8 bg-principal p-6 hover:bg-portfolio-dark-900 transition-all duration-300 group-hover:scale-110">
                            <FiArrowUpRight className="w-8 h-8 text-white" />
                          </button>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-20 bg-white/10 backdrop-blur-sm p-4 rounded-full hover:bg-principal transition-all duration-300"
              aria-label="Next slide"
            >
              <FiArrowUpRight className="w-8 h-8 text-white rotate-45" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-3">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-[15px] rounded-[21px] transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-principal w-[60px]"
                    : "bg-portfolio-gray-200 w-[15px]"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
