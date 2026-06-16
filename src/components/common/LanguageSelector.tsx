// packages
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = (): React.ReactElement => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'EN', flag: '🇺🇸' },
    { code: 'es', name: 'ES', flag: '🇨🇴' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 hover:opacity-70 transition-all duration-300"
      >
        <span className="text-2xl">{currentLanguage.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-[#171717] border border-white overflow-hidden shadow-lg rounded-none">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center justify-center px-4 py-3 w-full hover:bg-white/10 transition-colors duration-200 ${
                lang.code === i18n.language ? "bg-white/5" : ""
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
