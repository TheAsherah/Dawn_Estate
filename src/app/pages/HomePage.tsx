import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Award, Home, Users } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/app/components/ui/button';
import { PropertyCard } from '@/app/components/PropertyCard';
import { apiCall } from '@/lib/api';

interface HomePageProps {
  onNavigate: (page: string, propertyId?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { t } = useLanguage();
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentProperties();
  }, []);

  async function fetchRecentProperties() {
    try {
      const data = await apiCall('/properties?status=all');
      // Get only approved properties, handle images, and limit to 6
      const approved = (data.properties || []).filter((p: any) => p.status === 'approved').map((p: any) => {
        if (typeof p.images === 'string') {
          try {
            p.images = JSON.parse(p.images);
          } catch (e) {
            p.images = [];
          }
        }
        if (!Array.isArray(p.images)) p.images = [];
        return p;
      }).slice(0, 6);
      setRecentProperties(approved);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background text-foreground selection:bg-warm-brown selection:text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with sophisticated overlay */}
        <div className="absolute inset-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMG1vZGVybiUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3Njk4Mjk2OTN8MA&ixlib=rb-4.1.0&q=80&w=2000"
            alt="Luxury Property"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="space-y-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className="space-y-6"
            >
              <span className="text-warm-brown text-[10px] tracking-[0.5em] uppercase font-medium">
                {t('establishedTagline')}
              </span>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.9] text-balance">
                {t('elevatedLiving')}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="max-w-xl mx-auto text-white/50 text-sm md:text-base leading-relaxed tracking-wider font-light"
            >
              {t('homeHeroDescription')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8"
            >
              <button
                onClick={() => onNavigate('properties')}
                className="group relative px-12 py-5 overflow-hidden border border-warm-brown text-white transition-all duration-500 hover:bg-warm-brown"
              >
                <span className="relative z-10 text-[10px] tracking-[0.4em] uppercase font-medium">{t('viewProperties')}</span>
              </button>
              <button
                onClick={() => onNavigate('help')}
                className="group flex items-center gap-4 text-white/80 hover:text-white transition-colors duration-300"
              >
                <span className="text-[10px] tracking-[0.4em] uppercase font-medium">{t('estimateProperty')}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[8px] tracking-[0.4em] text-white/30 uppercase font-medium rotate-90 mb-8 origin-center">{t('scroll')}</span>
          <div className="w-[1px] h-12 bg-gradient-to-t from-warm-brown to-transparent" />
        </motion.div>
      </section>

      {/* Recent Properties */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <span className="text-warm-brown text-[10px] tracking-[0.4em] uppercase font-medium">{t('curatedCollection')}</span>
              <h2 className="text-4xl md:text-5xl font-serif text-white">{t('recentProperties')}</h2>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onClick={() => onNavigate('properties')}
              className="text-white/40 hover:text-white text-[10px] tracking-[0.4em] uppercase border-b border-white/10 pb-2 transition-colors duration-300"
            >
              {t('viewAllProperties')}
            </motion.button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
              {recentProperties.map((property: any, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                >
                  <PropertyCard property={property} onNavigate={onNavigate} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Philosophy Section (Replacing Why Choose Us with something more premium) */}
      <section className="py-40 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative aspect-square overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop"
                alt="Interior"
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-warm-brown/10 mix-blend-multiply" />
            </motion.div>

            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <span className="text-warm-brown text-[10px] tracking-[0.4em] uppercase font-medium">{t('ourPhilosophy')}</span>
                <h2 className="text-5xl md:text-6xl font-serif text-white leading-tight">{t('beyondRealEstate')}</h2>
                <p className="text-white/60 text-lg font-light leading-relaxed">
                  {t('philosophyDescription')}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                  { title: t('exclusivity'), desc: t('exclusivityDesc') },
                  { title: t('trust'), desc: t('trustDesc') },
                  { title: t('excellence'), desc: t('excellenceDesc') },
                  { title: t('passion'), desc: t('passionDesc') },
                ].map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    key={i}
                    className="space-y-2"
                  >
                    <h4 className="text-white font-serif text-xl">{item.title}</h4>
                    <p className="text-white/40 text-sm font-light uppercase tracking-widest">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-60 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 grayscale brightness-50">
          <img
            src="https://images.unsplash.com/photo-1628592102751-ba8240275021?q=80&w=2070&auto=format&fit=crop"
            alt="Estate"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="text-warm-brown text-[10px] tracking-[0.5em] uppercase font-medium">{t('estimateSubtitle')}</span>
            <h2 className="text-5xl md:text-7xl font-serif">{t('estimateProperty')}</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => onNavigate('help')}
              className="bg-white text-black px-16 py-6 text-[10px] tracking-[0.5em] uppercase font-bold hover:bg-warm-brown hover:text-white transition-all duration-500"
            >
              {t('contactUs')}
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
