import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, X, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
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
import { apiCall, uploadFile } from '@/lib/api';
import { toast } from 'sonner';

interface HelpPageProps {
  onNavigate: (page: string) => void;
}

export function HelpPage({ onNavigate }: HelpPageProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    city: '',
    surface: '',
    message: '',
    images: [] as string[],
    videos: [] as string[],
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploadingImages(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const result = await uploadFile(file, 'make-d093e79c-estimations');
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
        const result = await uploadFile(file, 'make-d093e79c-estimations');
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
    setLoading(true);

    try {
      await apiCall('/estimations', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          surface: parseFloat(formData.surface) || 0,
        }),
      });

      toast.success(t('estimationSubmitted'));
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyType: '',
        city: '',
        surface: '',
        message: '',
        images: [],
        videos: [],
      });
    } catch (error: any) {
      toast.error(error.message || t('error'));
    } finally {
      setLoading(false);
    }
  }

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
              Property Estimation
            </span>
            <h1 className="text-5xl md:text-7xl font-serif">
              {t('estimateTitle')}
            </h1>
            <p className="text-white/40 text-sm tracking-[0.2em] uppercase font-light max-w-2xl">
              {t('estimateSubtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0a0a0a] border border-white/5 p-12 md:p-16 space-y-12"
        >
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('name')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-transparent border-white/10 rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-transparent border-white/10 rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-transparent border-white/10 rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest"
              />
            </div>

            {/* Property Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('propertyType')}</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                  required
                >
                  <SelectTrigger className="bg-transparent border-white/10 rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest">
                    <SelectValue placeholder={t('selectCategory')} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10 rounded-none text-xs">
                    <SelectItem value="villa" className="focus:bg-warm-brown focus:text-white rounded-none">{t('villa')}</SelectItem>
                    <SelectItem value="house" className="focus:bg-warm-brown focus:text-white rounded-none">{t('house')}</SelectItem>
                    <SelectItem value="apartment" className="focus:bg-warm-brown focus:text-white rounded-none">{t('apartment')}</SelectItem>
                    <SelectItem value="studio" className="focus:bg-warm-brown focus:text-white rounded-none">{t('studio')}</SelectItem>
                    <SelectItem value="land" className="focus:bg-warm-brown focus:text-white rounded-none">{t('land')}</SelectItem>
                    <SelectItem value="daily-renting" className="focus:bg-warm-brown focus:text-white rounded-none">{t('dailyRenting')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="city" className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('city')}</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-transparent border-white/10 rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="surface" className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('surface')} (m²)</Label>
              <Input
                id="surface"
                type="number"
                value={formData.surface}
                onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                className="bg-transparent border-white/10 rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="message" className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('message')}</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-transparent border-white/10 rounded-none focus:border-warm-brown transition-colors text-xs tracking-widest min-h-[150px] p-4"
                rows={4}
              />
            </div>

            {/* Upload Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Images */}
              <div className="space-y-6">
                <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('uploadImages')}</Label>
                <label className="flex flex-col items-center justify-center w-full aspect-video border border-dashed border-white/10 hover:border-warm-brown transition-all duration-500 cursor-pointer group bg-black/40">
                  <Upload className="w-5 h-5 text-white/20 group-hover:text-warm-brown mb-4 transition-colors" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-colors">
                    {uploadingImages ? t('loading') : t('uploadImages')}
                  </span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative aspect-square border border-white/10">
                        <img src={img} className="w-full h-full object-cover" />
                        <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-white text-black p-1 hover:bg-warm-brown hover:text-white transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Videos */}
              <div className="space-y-6">
                <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('uploadVideos')}</Label>
                <label className="flex flex-col items-center justify-center w-full aspect-video border border-dashed border-white/10 hover:border-warm-brown transition-all duration-500 cursor-pointer group bg-black/40">
                  <Upload className="w-5 h-5 text-white/20 group-hover:text-warm-brown mb-4 transition-colors" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-colors">
                    {uploadingVideos ? t('loading') : t('uploadVideos')}
                  </span>
                  <input type="file" accept="video/*" multiple onChange={handleVideoUpload} className="hidden" />
                </label>

                {formData.videos.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {formData.videos.map((vid, i) => (
                      <div key={i} className="relative aspect-square border border-white/10 flex items-center justify-center overflow-hidden">
                        <video src={vid} className="w-full h-full object-cover" />
                        <button onClick={() => removeVideo(i)} className="absolute -top-2 -right-2 bg-white text-black p-1 hover:bg-warm-brown hover:text-white transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || uploadingImages || uploadingVideos}
              className="w-full bg-warm-brown text-white py-6 text-[10px] tracking-[0.5em] uppercase font-bold hover:bg-warm-brown/90 transition-all duration-500 disabled:opacity-50"
            >
              {loading ? t('submitting') : t('submit')}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
