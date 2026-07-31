import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-warm-brown pb-32">
      {/* Refined Header */}
      <div className="pt-40 pb-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="text-warm-brown text-[10px] tracking-[0.5em] uppercase font-medium">
              {t('getInTouch')}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif">
              {t('contact')}
            </h1>
            <p className="text-white/40 text-sm tracking-[0.2em] uppercase font-light max-w-2xl">
              {t('contactIntro')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-16"
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-serif">DAWN ESTATE</h2>
              <p className="text-white/50 leading-relaxed font-light text-sm max-w-md">
                {t('aboutText')}
              </p>
            </div>

            <div className="space-y-12">
              <div className="flex items-start space-x-8 group">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center transition-colors group-hover:border-warm-brown">
                  <Mail className="w-4 h-4 text-warm-brown" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('email')}</h3>
                  <div className="space-y-1">
                    <p className="text-white/80 font-light hover:text-warm-brown transition-colors cursor-pointer">contact@dawnestate.com</p>
                    <p className="text-white/80 font-light hover:text-warm-brown transition-colors cursor-pointer">concierge@dawnestate.com</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-8 group">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center transition-colors group-hover:border-warm-brown">
                  <Phone className="w-4 h-4 text-warm-brown" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('phone')}</h3>
                  <div className="space-y-1">
                    <a href="https://wa.me/212762829992" target="_blank" rel="noreferrer" className="text-white/80 font-light hover:text-warm-brown transition-colors">+212 762-829992 (WhatsApp)</a>
                    <p className="text-white/80 font-light">+212 524 XX XX XX</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-8 group">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center transition-colors group-hover:border-warm-brown">
                  <MapPin className="w-4 h-4 text-warm-brown" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('address')}</h3>
                  <div className="space-y-1">
                    <p className="text-white/80 font-light">Hivernage, Marrakech</p>
                    <p className="text-white/80 font-light">{t('kingdomOfMorocco')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-12 border-t border-white/5 space-y-6">
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('followUs')}</h3>
              <div className="flex space-x-8">
                {[
                  { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/' },
                  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/' },
                  { icon: Twitter, label: 'Twitter', href: 'https://x.com/' },
                  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/' }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="text-white/40 hover:text-warm-brown transition-colors duration-500"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative aspect-[4/5] overflow-hidden group"
          >
            <img
              src="https://images.unsplash.com/photo-1763783695583-c0703902d318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBjaXR5JTIwdmlld3xlbnwxfHx8fDE3Njk3Mzc1NTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Dawn Estate Marrakech"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-1000" />

            <div className="absolute bottom-12 left-12">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-[1px] bg-warm-brown" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-white">{t('marrakechHeadOffice')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
