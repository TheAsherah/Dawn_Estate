import React from 'react';
import { MapPin, Maximize, Bath, Bed, Waves } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface Property {
  id: string;
  category: string;
  prestation: string;
  city: string;
  address: string;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  pool: boolean;
  price: number;
  images: string[];
  status: string;
}

interface PropertyCardProps {
  property: Property;
  onNavigate: (page: string, propertyId?: string) => void;
}

export function PropertyCard({ property, onNavigate }: PropertyCardProps) {
  const { t, language } = useLanguage();

  const formatPrice = (price: number) => {
    const parts = new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).formatToParts(price);

    return {
      amount: parts.filter((part) => part.type !== 'currency' && part.type !== 'literal').map((part) => part.value).join('').trim(),
      currency: parts.find((part) => part.type === 'currency')?.value || 'MAD',
    };
  };

  const defaultImage = "https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMG1vZGVybiUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3Njk4Mjk2OTN8MA&ixlib=rb-4.1.0&q=80&w=1080";

  return (
    <div className="bg-card border-refined group cursor-pointer overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-warm-brown/10">
      {/* Image Container */}
      <div className="relative h-[450px] overflow-hidden">
        <img
          src={property.images[0] || defaultImage}
          alt={property.category}
          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
        />
        {/* Overlay Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-3">
          <Badge className="bg-warm-brown text-white text-[10px] tracking-[0.2em] uppercase rounded-none px-4 py-1.5 border-none">
            {t(property.prestation as any)}
          </Badge>
          <Badge className="bg-background/90 backdrop-blur-md text-foreground text-[10px] tracking-[0.2em] uppercase rounded-none px-4 py-1.5 border border-border">
            {t(property.category as any)}
          </Badge>
        </div>

        {/* Hover info overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('property-detail', property.id);
            }}
            className="bg-white text-black hover:bg-warm-brown hover:text-white rounded-none text-[10px] tracking-[0.3em] uppercase py-6 px-10 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0"
          >
            {t('viewDetails')}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6" onClick={() => onNavigate('property-detail', property.id)}>
        <div className="space-y-2">
          <div className="flex items-center text-warm-brown">
            <MapPin className="w-3 h-3 mr-2" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">{property.address || property.city}</span>
          </div>
          <h3 className="text-2xl font-serif text-foreground group-hover:text-warm-brown transition-colors duration-300">
            {t(property.category as any)} <span className="text-muted-foreground font-sans font-light">/</span> {property.city}
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-t border-border pt-6">
          <p className="whitespace-nowrap text-base sm:text-xl font-light tracking-wide text-foreground">
            <span className="block">{formatPrice(property.price).amount}</span>
            <span className="block text-[9px] sm:text-[10px] tracking-[0.25em] text-muted-foreground">{formatPrice(property.price).currency}</span>
          </p>

          {/* Minimal Features */}
          <div className="flex items-center gap-4 sm:gap-6 text-muted-foreground text-[10px] tracking-widest uppercase shrink-0">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-2">
                <Bed className="w-3 h-3" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.surface > 0 && (
                <div className="flex items-center gap-2 border-l border-border pl-6">
                <Maximize className="w-3 h-3" />
                <span>{property.surface} M²</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
