// packages
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// components
// import BlogSection from "../components/sections/BlogSection";
// import TestimonialsSection from '../components/sections/TestimonialsSection';
import ContactFormSection from "../components/sections/ContactFormSection";
import HeroSection from "../components/sections/HeroSection";
import ServicesSection from "../components/sections/ServicesSection";
import SkillsBannerSection from "../components/sections/SkillsBannerSection";
import WhyHireMeSection from "../components/sections/WhyHireMeSection";
import WorkExperienceSection from "../components/sections/WorkExperienceSection";

// utils
import { scrollToSection } from "../utils/scrollUtils";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (scrollTo) {
      setTimeout(() => scrollToSection(scrollTo), 50);
    }
  }, [location.state]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <HeroSection />
      {/* Services Section */}
      <ServicesSection />
      {/* Work Experience Section */}
      <WorkExperienceSection />
      {/* Why Hire Me Section */}
      <WhyHireMeSection />
      {/* Testimonials Section */}
      {/* <TestimonialsSection /> */}
      {/* Contact Form Section */}
      <ContactFormSection />
      {/* Skills Banner Section */}
      <SkillsBannerSection />
      {/* Blog Section */}
      {/* <BlogSection /> */}
    </div>
  );
};

export default Home;
