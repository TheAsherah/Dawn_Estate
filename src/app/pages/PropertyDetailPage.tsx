import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Maximize, Bath, Bed, Waves, ArrowLeft, Share2, User } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { apiCall } from '@/lib/api';

interface PropertyDetailPageProps {
  propertyId: string;
  onNavigate: (page: string) => void;
}

export function PropertyDetailPage({ propertyId, onNavigate }: PropertyDetailPageProps) {
  const { t, language } = useLanguage();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const whatsappNumber = '212762829992';

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  async function fetchProperty() {
    try {
      const data = await apiCall(`/properties/${propertyId}`);
      const prop = data.property;

      // Handle images if they come as a string
      if (prop && typeof prop.images === 'string') {
        try {
          prop.images = JSON.parse(prop.images);
        } catch (e) {
          prop.images = [];
        }
      }

      if (prop && !Array.isArray(prop.images)) {
        prop.images = [];
      }

      setProperty(prop);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const openWhatsApp = (message: string) => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-warm-brown mx-auto mb-4"></div>
          <p className="text-white/40 uppercase tracking-widest text-xs">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-8 tracking-widest uppercase">{t('error')}</p>
          <button
            onClick={() => onNavigate('properties')}
            className="border border-warm-brown text-white px-10 py-4 text-[10px] tracking-[0.4em] uppercase"
          >
            {t('backToProperties')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-warm-brown pb-32">
      {/* Back Button Floating */}
      <button
        onClick={() => onNavigate('properties')}
        className="fixed top-28 left-8 z-40 w-12 h-12 bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-warm-brown hover:border-warm-brown transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Hero Gallery Section */}
      <section className="relative h-[85vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={property.images[0] || "https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?q=80&w=2000"}
          alt={property.category}
          className="w-full h-full object-cover grayscale-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

        {/* Basic Info Overlay */}
        <div className="absolute bottom-20 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <Badge className="bg-warm-brown text-white text-[10px] tracking-[0.4em] uppercase rounded-none px-6 py-2 border-none">
                  {t(property.prestation as any)}
                </Badge>
                <span className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-medium">/{t(property.category as any)}</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-serif text-white max-w-4xl leading-tight">
                {property.address || property.category}
              </h1>
              <div className="flex items-center text-warm-brown text-sm tracking-[0.3em] font-medium uppercase">
                <MapPin className="w-4 h-4 mr-3" />
                {property.city}, MARRAKECH
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-32">

            {/* Features Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-y border-white/5 py-12">
              {[
                { icon: Maximize, label: t('surfaceStat'), value: `${property.surface} M²` },
                { icon: Bed, label: t('bedroomsStat'), value: property.bedrooms },
                { icon: Bath, label: t('bathroomsStat'), value: property.bathrooms },
                { icon: Waves, label: t('poolStat'), value: property.pool ? t('yes') : t('no') }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3 text-warm-brown">
                    <item.icon className="w-4 h-4" />
                    <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-white/40">{item.label}</span>
                  </div>
                  <p className="text-2xl font-light tracking-widest">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="space-y-12">
              <h3 className="text-3xl font-serif text-white/50">{t('gallery')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {property.images.slice(0, 6).map((img: string, i: number) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="aspect-square bg-white/5 overflow-hidden border border-white/5"
                  >
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-12 max-w-3xl">
              <h2 className="text-4xl font-serif leading-tight">{t('masterpieceTitle')}</h2>
              <div className="space-y-8 text-white/60 text-lg font-light leading-relaxed">
                <p>{t('masterpieceParagraphOne')}</p>
                <p>{t('masterpieceParagraphTwo')}</p>
              </div>
            </div>
          </div>

          {/* Sidebar / Contact */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-12 bg-[#0a0a0a] border border-white/5 p-12">
              <div className="space-y-4">
                <span className="text-warm-brown text-[10px] tracking-[0.4em] uppercase font-medium">{t('inquiryPrice')}</span>
                <p className="text-5xl font-light tracking-widest">{formatPrice(property.price)}</p>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/5 flex items-center justify-center border border-white/10">
                    <User className="w-8 h-8 text-warm-brown" />
                  </div>
                  <div>
                    <p className="text-lg font-serif">{property.first_name} {property.last_name}</p>
                    <p className="text-[10px] tracking-widest text-white/40 uppercase">{t('expertAdvisor')}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-8">
                  <button
                    onClick={() => openWhatsApp(`${t('whatsAppInterestMessage')}: ${property.address || property.category} in Marrakech`)}
                    className="w-full bg-warm-brown text-white py-6 text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-warm-brown/90 transition-all duration-500 flex items-center justify-center gap-4"
                  >
                    <Share2 className="w-4 h-4" />
                    {t('contactWhatsApp')}
                  </button>
                  <button
                    onClick={() => openWhatsApp(`${t('whatsAppViewingMessage')}: ${property.address || property.category} in Marrakech`)}
                    className="w-full border border-white/10 text-white py-6 text-[10px] tracking-[0.4em] uppercase font-medium hover:bg-white/5 transition-all duration-500"
                  >
                    {t('requestViewing')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
