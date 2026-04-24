// packages
import { AiOutlineSend } from 'react-icons/ai';
import { FaWhatsapp } from 'react-icons/fa';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    from: '',
    subject: '',
    category: '',
    body: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Implement a feature to send emails
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg dark:bg-dark-bg text-white pt-32 pb-20">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-16 neon-text">
          {t('contact.title')}
        </h1>

        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="cyber-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="from" className="block text-sm font-mono text-neon-cyan mb-2">
                  {t('contact.form.from')}
                </label>
                <input
                  type="email"
                  id="from"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border focus:border-neon-cyan rounded-lg text-white font-mono outline-none transition-colors duration-300"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-mono text-neon-cyan mb-2">
                  {t('contact.form.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border focus:border-neon-cyan rounded-lg text-white font-mono outline-none transition-colors duration-300"
                  placeholder="Subject"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-mono text-neon-cyan mb-2">
                  {t('contact.form.category')}
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border focus:border-neon-cyan rounded-lg text-white font-mono outline-none transition-colors duration-300"
                >
                  <option value="">Select a category</option>
                  <option value="general">General Inquiry</option>
                  <option value="project">Project Collaboration</option>
                  <option value="job">Job Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="body" className="block text-sm font-mono text-neon-cyan mb-2">
                  {t('contact.form.body')}
                </label>
                <textarea
                  id="body"
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border focus:border-neon-cyan rounded-lg text-white font-mono outline-none transition-colors duration-300 resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold uppercase tracking-wider border-2 border-neon-pink hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2"
              >
                <AiOutlineSend className="w-5 h-5" />
                {t('contact.form.send')}
              </button>
            </form>
          </div>

          {/* WhatsApp Section */}
          <div className="flex flex-col justify-center">
            <div className="cyber-card text-center">
              <div className="mb-6">
                <FaWhatsapp className="w-24 h-24 mx-auto text-neon-green" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">
                {t('contact.whatsapp')}
              </h2>
              <p className="text-gray-400 mb-6">
                Prefer to chat directly? Reach me on WhatsApp for quick responses!
              </p>
              {/* TODO: Replace placeholder phone number with real WhatsApp number */}
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-gradient-to-r from-neon-green to-neon-cyan text-dark-bg font-bold uppercase tracking-wider border-2 border-neon-green hover:scale-105 transition-transform duration-300"
              >
                Open WhatsApp
              </a>
            </div>

            <div className="cyber-card mt-6">
              <h3 className="text-xl font-bold mb-4 text-neon-pink">Quick Info</h3>
              <div className="space-y-3 text-gray-400 font-mono text-sm">
                <p>📧 Email response: 24-48 hours</p>
                <p>💬 WhatsApp: Usually instant</p>
                <p>🌍 Timezone: UTC-5</p>
                <p>⏰ Available: Mon-Fri, 9AM-6PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
