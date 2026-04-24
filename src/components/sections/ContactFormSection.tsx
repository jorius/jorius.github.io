// packages
import { FiSend } from "react-icons/fi";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

// utils
import { validateEmail } from "../../utils/validationUtils";

const ContactFormSection = () => {
  const { t } = useTranslation();
  const [emailError, setEmailError] = useState("");

  const handleEmailBlur = (email: string) => {
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = () => {
    // TODO: Implement contact form submission (send email or call API)
  };

  return (
    <section id="contact" className="w-full bg-white px-16 py-24">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6 items-center justify-center">
        {/* Title */}
        <h2 className="font-space-mono font-bold text-[64px] text-portfolio-dark-700 text-center leading-normal tracking-[-0.96px] max-w-[1028px]">
          {t("contact.title.part1", "Have a New Project Idea?")}
        </h2>

        {/* Email Input Form */}
        <div className="flex flex-col items-center justify-center gap-6 w-full">
          <div className="w-[832px] relative">
            <div className="backdrop-blur-[7.5px] border border-portfolio-gray-200 rounded-none p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="email"
                  placeholder={t(
                    "contact.emailPlaceholder",
                    "Enter Email Address",
                  )}
                  onBlur={(e) => handleEmailBlur(e.target.value)}
                  className="flex-1 bg-transparent font-urbanist font-medium text-xl text-black tracking-[-0.3px] outline-none placeholder:text-black/50"
                />
              </div>
            </div>
            <p
              className={`absolute -bottom-6 left-2 text-red-500 text-sm transition-opacity duration-300 ${emailError ? "opacity-100" : "opacity-0"}`}
            >
              {emailError}
            </p>
          </div>

          {/* Textarea Input */}
          <div className="backdrop-blur-[7.5px] border border-portfolio-gray-200 rounded-none p-3.5 flex items-start justify-between w-[832px]">
            <div className="flex items-start gap-4 flex-1">
              <textarea
                placeholder={t(
                  "contact.projectPlaceholder",
                  "e.g., I need a modern e-commerce website with payment integration and inventory management...",
                )}
                rows={4}
                maxLength={250}
                className="flex-1 bg-transparent font-urbanist font-medium text-xl text-black tracking-[-0.3px] outline-none placeholder:text-black/50 resize-none py-2"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button onClick={handleSubmit} className="bg-principal rounded-none px-8 py-4 hover:bg-principal/90 transition-all flex items-center justify-center gap-3 w-[832px]">
            <span className="text-white font-space-mono font-bold text-xl">
              {t("contact.title.part2", "Let's Discuss")}
            </span>
            <FiSend className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
