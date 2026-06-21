// packages
import { useTranslation } from 'react-i18next';

const About = (): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-dark-bg dark:bg-dark-bg text-white pt-32 pb-20">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-12 neon-text">
          {t('about.title')}
        </h1>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Personal Section */}
          <div className="cyber-card">
            <h2 className="text-3xl font-bold mb-6 text-neon-pink">
              {t('about.personal.title')}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              {t('about.personal.description')}
            </p>
          </div>

          {/* Professional Section */}
          <div className="cyber-card">
            <h2 className="text-3xl font-bold mb-6 text-neon-cyan">
              {t('about.professional.title')}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t('about.professional.description')}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="border-l-4 border-neon-purple pl-4">
                <h3 className="text-xl font-bold text-neon-purple mb-2">Skills</h3>
                <ul className="text-gray-400 space-y-1">
                  <li>• Full-Stack Development</li>
                  <li>• Cybersecurity</li>
                  <li>• Cloud Architecture</li>
                  <li>• DevOps &amp; CI/CD</li>
                </ul>
              </div>
              <div className="border-l-4 border-neon-blue pl-4">
                <h3 className="text-xl font-bold text-neon-blue mb-2">Interests</h3>
                <ul className="text-gray-400 space-y-1">
                  <li>• Open Source</li>
                  <li>• Security Research</li>
                  <li>• System Design</li>
                  <li>• AI &amp; Machine Learning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
