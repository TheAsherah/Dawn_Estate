import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { PropertyCard } from '@/app/components/PropertyCard';
import { apiCall } from '@/lib/api';

interface PropertiesPageProps {
  onNavigate: (page: string, propertyId?: string) => void;
}

export function PropertiesPage({ onNavigate }: PropertiesPageProps) {
  const { t } = useLanguage();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: '',
    prestation: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    pool: '',
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  async function fetchProperties() {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.category) queryParams.append('category', filters.category);
      if (filters.prestation) queryParams.append('prestation', filters.prestation);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.pool) queryParams.append('pool', filters.pool);

      queryParams.append('status', 'all');

      const data = await apiCall(`/properties?${queryParams.toString()}`);
      // Only show approved properties and ensure images are parsed
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
      });
      setProperties(approved);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters({
      category: '',
      prestation: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      pool: '',
    });
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-warm-brown selection:text-white pb-32">
      {/* Refined Header */}
      <div className="pt-40 pb-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="text-warm-brown text-[10px] tracking-[0.5em] uppercase font-medium">
              Curated Selection
            </span>
            <h1 className="text-5xl md:text-7xl font-serif">
              {t('properties')}
            </h1>
            <p className="text-white/40 text-sm md:text-base font-light tracking-widest max-w-xl">
              {t('exclusiveProperties')} in Marrakech.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-32 space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] tracking-[0.4em] uppercase font-medium text-warm-brown flex items-center gap-3">
                  <Filter className="w-3 h-3" />
                  {t('filters')}
                </h2>
                <button
                  onClick={resetFilters}
                  className="text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors"
                >
                  {t('reset')}
                </button>
              </div>

              <div className="space-y-10">
                {/* Category */}
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase tracking-widest text-white/50">{t('category')}</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
                    <SelectTrigger className="bg-transparent border-white/10 rounded-none text-white focus:ring-warm-brown h-12 uppercase text-[10px] tracking-[0.2em]">
                      <SelectValue placeholder={t('selectCategory')} />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white rounded-none">
                      <SelectItem value=" ">{t('selectCategory')}</SelectItem>
                      <SelectItem value="villa">{t('villa')}</SelectItem>
                      <SelectItem value="house">{t('house')}</SelectItem>
                      <SelectItem value="apartment">{t('apartment')}</SelectItem>
                      <SelectItem value="studio">{t('studio')}</SelectItem>
                      <SelectItem value="land">{t('land')}</SelectItem>
                      <SelectItem value="daily-renting">{t('dailyRenting')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Prestation */}
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase tracking-widest text-white/50">{t('prestation')}</Label>
                  <Select
                    value={filters.prestation}
                    onValueChange={(value) => handleFilterChange('prestation', value)}
                  >
                    <SelectTrigger className="bg-transparent border-white/10 rounded-none text-white focus:ring-warm-brown h-12 uppercase text-[10px] tracking-[0.2em]">
                      <SelectValue placeholder={t('selectPrestation')} />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white rounded-none">
                      <SelectItem value=" ">{t('selectPrestation')}</SelectItem>
                      <SelectItem value="sale">{t('sale')}</SelectItem>
                      <SelectItem value="rent">{t('rent')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase tracking-widest text-white/50">{t('priceRange')}</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="MIN"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="bg-transparent border-white/10 rounded-none text-white focus:ring-warm-brown h-12 text-[10px] tracking-widest"
                    />
                    <Input
                      type="number"
                      placeholder="MAX"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="bg-transparent border-white/10 rounded-none text-white focus:ring-warm-brown h-12 text-[10px] tracking-widest"
                    />
                  </div>
                </div>

                {/* Pool */}
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase tracking-widest text-white/50">{t('pool')}</Label>
                  <Select
                    value={filters.pool}
                    onValueChange={(value) => handleFilterChange('pool', value)}
                  >
                    <SelectTrigger className="bg-transparent border-white/10 rounded-none text-white focus:ring-warm-brown h-12 uppercase text-[10px] tracking-[0.2em]">
                      <SelectValue placeholder={t('pool')} />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white rounded-none">
                      <SelectItem value=" ">{t('pool')}</SelectItem>
                      <SelectItem value="true">{t('yes')}</SelectItem>
                      <SelectItem value="false">{t('no')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mt-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full h-14 border border-warm-brown text-white text-[10px] tracking-[0.4em] uppercase font-medium flex items-center justify-center gap-4"
            >
              <Filter className="w-3 h-3" />
              {t('filters')}
            </button>

            {/* Mobile Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden bg-white/5 border-x border-b border-white/10 p-6 space-y-6"
                >
                  {/* Same content as desktop but in a simpler layout */}
                  <Select value={filters.category} onValueChange={(v) => handleFilterChange('category', v)}>
                    <SelectTrigger className="bg-black border-white/10 rounded-none text-white"><SelectValue placeholder={t('selectCategory')} /></SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white"><SelectItem value="villa">{t('villa')}</SelectItem></SelectContent>
                  </Select>

                  <button onClick={resetFilters} className="w-full py-4 text-[10px] tracking-[0.4em] uppercase text-white/50">
                    {t('resetAll')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[1, 2, 4].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                {properties.map((property: any, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                  >
                    <PropertyCard property={property} onNavigate={onNavigate} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-40 border border-dashed border-white/10">
                <p className="text-white/30 text-xs tracking-[0.5em] uppercase">{t('noProperties')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
