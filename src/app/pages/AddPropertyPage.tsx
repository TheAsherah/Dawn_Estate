import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Upload, X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { apiCall, uploadFile } from '@/lib/api';
import { toast } from 'sonner';

interface AddPropertyPageProps {
  onNavigate: (page: string) => void;
  propertyId?: string | null;
}

export function AddPropertyPage({ onNavigate, propertyId }: AddPropertyPageProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const isEditing = Boolean(propertyId);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    category: '',
    prestation: '',
    city: 'Marrakech',
    surface: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    pool: false,
    price: '',
    images: [] as string[],
    videos: [] as string[],
  });

  useEffect(() => {
    if (!propertyId) return;

    apiCall(`/properties/${propertyId}`)
      .then(({ property }) => setFormData((current) => ({
        ...current,
        category: property.category || '',
        prestation: property.prestation || '',
        city: property.city || '',
        surface: String(property.surface || ''),
        address: property.address || '',
        bedrooms: String(property.bedrooms || ''),
        bathrooms: String(property.bathrooms || ''),
        pool: Boolean(property.pool),
        price: String(property.price || ''),
        images: Array.isArray(property.images) ? property.images : [],
      })))
      .catch((error) => toast.error(error.message || t('error')));
  }, [propertyId]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploadingImages(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const result = await uploadFile(file);
        uploadedUrls.push(result.url);
      }
      setFormData({ ...formData, images: [...formData.images, ...uploadedUrls] });
      toast.success(t('success'));
    } catch (error) {
      toast.error(t('error'));
    } finally {
      setUploadingImages(false);
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploadingVideos(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const result = await uploadFile(file);
        uploadedUrls.push(result.url);
      }
      setFormData({ ...formData, videos: [...formData.videos, ...uploadedUrls] });
      toast.success(t('success'));
    } catch (error) {
      toast.error(t('error'));
    } finally {
      setUploadingVideos(false);
    }
  }

  function removeImage(index: number) {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  }

  function removeVideo(index: number) {
    setFormData({
      ...formData,
      videos: formData.videos.filter((_, i) => i !== index),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      toast.error(t('error'));
      onNavigate('login');
      return;
    }

    setLoading(true);

    try {
      await apiCall(isEditing ? `/properties/${propertyId}` : '/properties', {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...formData,
          surface: parseFloat(formData.surface) || 0,
          bedrooms: parseInt(formData.bedrooms) || 0,
          bathrooms: parseInt(formData.bathrooms) || 0,
          price: parseFloat(formData.price),
        }),
      });

      toast.success(isEditing ? t('propertyUpdated') : t('propertySubmitted'));
      onNavigate(isEditing ? 'dashboard' : 'properties');
    } catch (error: any) {
      toast.error(error.message || t('error'));
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{t('error')}</p>
          <Button onClick={() => onNavigate('login')} className="bg-amber-700 hover:bg-amber-800">
            {t('login')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-warm-brown pb-32">
      {/* Refined Header */}
      <div className="pt-40 pb-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-center md:text-left"
          >
            <span className="text-warm-brown text-[10px] tracking-[0.5em] uppercase font-medium">
              List Your Estate
            </span>
            <h1 className="text-5xl md:text-6xl font-serif">
              {isEditing ? t('editProperty') : t('addNewProperty')}
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card border border-border p-8 md:p-16"
        >
          <form onSubmit={handleSubmit} className="space-y-16">

            {/* Personal Info */}
            <div className="space-y-8">
              <h3 className="text-warm-brown text-[10px] tracking-[0.3em] uppercase font-bold border-b border-border pb-4">{t('personalInfo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('firstName')}</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="bg-background border-border rounded-none h-14 focus:border-warm-brown transition-colors uppercase text-xs tracking-widest"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('lastName')}</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="bg-background border-border rounded-none h-14 focus:border-warm-brown transition-colors uppercase text-xs tracking-widest"
                  />
                </div>
              </div>
            </div>

            {/* Property Type */}
            <div className="space-y-8">
              <h3 className="text-warm-brown text-[10px] tracking-[0.3em] uppercase font-bold border-b border-border pb-4">{t('propertyDetails')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('category')}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger className="bg-background border-border rounded-none h-14 uppercase text-[10px] tracking-[0.2em] focus:ring-warm-brown">
                      <SelectValue placeholder={t('selectCategory')} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground rounded-none">
                      <SelectItem value="villa">{t('villa')}</SelectItem>
                      <SelectItem value="house">{t('house')}</SelectItem>
                      <SelectItem value="apartment">{t('apartment')}</SelectItem>
                      <SelectItem value="studio">{t('studio')}</SelectItem>
                      <SelectItem value="land">{t('land')}</SelectItem>
                      <SelectItem value="daily-renting">{t('dailyRenting')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('prestation')}</Label>
                  <Select
                    value={formData.prestation}
                    onValueChange={(value) => setFormData({ ...formData, prestation: value })}
                    required
                  >
                    <SelectTrigger className="bg-background border-border rounded-none h-14 uppercase text-[10px] tracking-[0.2em] focus:ring-warm-brown">
                      <SelectValue placeholder={t('selectPrestation')} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground rounded-none">
                      <SelectItem value="sale">{t('sale')}</SelectItem>
                      <SelectItem value="rent">{t('rent')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3 pt-4">
                <Label htmlFor="address" className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('address')}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  placeholder={t('enterAddress')}
                  className="bg-background border-border rounded-none h-14 focus:border-warm-brown transition-colors uppercase text-xs tracking-widest"
                />
              </div>
            </div>

            {/* Scale & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="space-y-3">
                <Label htmlFor="surface" className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('surface')} (M²)</Label>
                <Input
                  id="surface"
                  type="number"
                  value={formData.surface}
                  onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                  className="bg-background border-border rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="bedrooms" className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('bedrooms')}</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="bg-background border-border rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="bathrooms" className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('bathrooms')}</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="bg-background border-border rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="price" className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('priceLabel')} (MAD)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="bg-background border-border rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest min-w-0"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-y border-border py-6">
              <div className="space-y-1">
                <Label htmlFor="pool" className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('pool')}</Label>
                <p className="text-xs text-muted-foreground">{t('hasPool')}</p>
              </div>
              <Switch
                id="pool"
                checked={formData.pool}
                onCheckedChange={(checked) => setFormData({ ...formData, pool: checked })}
                aria-label={t('pool')}
                className="data-[state=checked]:bg-warm-brown"
              />
            </div>

            {/* Media Uploads */}
            <div className="space-y-12 pt-8">
              <h3 className="text-warm-brown text-[10px] tracking-[0.3em] uppercase font-bold border-b border-border pb-4">{t('mediaOverlay')}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Images */}
                <div className="space-y-6">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t('uploadImages')}</Label>
                  <label className="flex flex-col items-center justify-center w-full h-48 border border-dashed border-border hover:border-warm-brown transition-colors cursor-pointer group bg-muted/60">
                    <Upload className="w-6 h-6 mb-4 text-muted-foreground group-hover:text-warm-brown transition-colors" />
                    <span className="text-[10px] tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                      {uploadingImages ? t('loading') : t('selectFiles')}
                    </span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImages} />
                  </label>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {formData.images.map((img, i) => (
                        <div key={i} className="relative aspect-square border border-border">
                          <img src={img} alt="" className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-500" />
                          <button onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1 bg-background/80 text-muted-foreground hover:text-red-500 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Videos */}
                <div className="space-y-6">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t('uploadVideos')}</Label>
                  <label className="flex flex-col items-center justify-center w-full h-48 border border-dashed border-border hover:border-warm-brown transition-colors cursor-pointer group bg-muted/60">
                    <Upload className="w-6 h-6 mb-4 text-muted-foreground group-hover:text-warm-brown transition-colors" />
                    <span className="text-[10px] tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                      {uploadingVideos ? t('loading') : t('selectFiles')}
                    </span>
                    <input type="file" multiple accept="video/*" onChange={handleVideoUpload} className="hidden" disabled={uploadingVideos} />
                  </label>

                  {formData.videos.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {formData.videos.map((vid, i) => (
                        <div key={i} className="relative aspect-square border border-border bg-muted">
                          <video src={vid} className="w-full h-full object-cover opacity-50" />
                          <button onClick={() => removeVideo(i)} className="absolute top-2 right-2 p-1 bg-background/80 text-muted-foreground hover:text-red-500 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-12">
              <button
                type="submit"
                disabled={loading || uploadingImages || uploadingVideos}
                className="w-full bg-warm-brown text-white py-8 text-[10px] tracking-[0.5em] uppercase font-bold hover:bg-warm-brown/90 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('submitting') : isEditing ? t('saveChanges') : t('publishProperty')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
