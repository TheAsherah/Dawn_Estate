import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t } = useLanguage();
  const logoSrc = '/uploads/logoooooooooo.png';

  return (
    <footer className="bg-black border-t border-white/5 text-white/40 selection:bg-warm-brown">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-32">
          {/* Brand/About */}
          <div className="space-y-8">
            <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-16 h-16 overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <img src={logoSrc} alt="Dawn Estate logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-sm font-serif tracking-widest text-white m-0 leading-none">DAWN ESTATE</h3>
                <p className="text-[8px] uppercase tracking-[0.3em] text-warm-brown mt-1">Marrakech</p>
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-widest leading-relaxed font-light">
              {t('aboutText')}
            </p>
          </div>

          {/* Curated Selection */}
          <div className="space-y-8">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white font-bold">{t('quickLinks')}</h4>
            <ul className="space-y-4">
              {[
                { key: 'home', label: t('home') },
                { key: 'properties', label: t('properties') },
                { key: 'add-property', label: t('addProperty') },
                { key: 'help', label: t('help') }
              ].map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => onNavigate(link.key)}
                    className="text-[10px] uppercase tracking-widest hover:text-warm-brown transition-colors duration-500 font-medium"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-8">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white font-bold">{t('contact')}</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4 group">
                <Mail className="w-3 h-3 text-warm-brown mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase tracking-widest font-light group-hover:text-white transition-colors cursor-pointer">contact@dawnestate.com</span>
              </li>
              <li className="flex items-start space-x-4 group">
                <Phone className="w-3 h-3 text-warm-brown mt-0.5 group-hover:scale-110 transition-transform" />
                <a href="https://wa.me/212762829992" target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-widest font-light hover:text-white transition-colors">+212 762-829992</a>
              </li>
              <li className="flex items-start space-x-4 group">
                <MapPin className="w-3 h-3 text-warm-brown mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase tracking-widest font-light">Hivernage, Marrakech</span>
              </li>
            </ul>
          </div>

          {/* Experience */}
          <div className="space-y-8">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white font-bold">{t('followUs')}</h4>
            <div className="flex space-x-6">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' }
              ].map((social) => (
                <button
                  key={social.label}
                  className="text-white/20 hover:text-warm-brown transition-colors duration-700"
                >
                  <social.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <div className="pt-8 border-t border-white/5">
              <p className="text-[8px] uppercase tracking-[0.4em] font-medium text-warm-brown">{t('footerSlogan')}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[8px] uppercase tracking-[0.5em] font-light">
            © {new Date().getFullYear()} Dawn Estate. {t('allRightsReserved')}.
          </p>
          <div className="flex space-x-12">
            <button className="text-[8px] uppercase tracking-[0.3em] hover:text-white transition-colors">{t('privacyPolicy')}</button>
            <button className="text-[8px] uppercase tracking-[0.3em] hover:text-white transition-colors">{t('termsOfService')}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
