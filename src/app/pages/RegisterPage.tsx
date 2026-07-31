import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { t } = useLanguage();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('error'));
      return;
    }

    setLoading(true);

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      toast.success(t('success'));
      onNavigate('home');
    } catch (error: any) {
      toast.error(error.message || t('error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-warm-brown flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg"
      >
        <div className="bg-[#0a0a0a] border border-white/5 p-12 md:p-16 space-y-12">
          {/* Logo & Header */}
          <div className="text-center space-y-6">
            <div className="w-12 h-12 border border-warm-brown flex items-center justify-center mx-auto transition-transform duration-500 hover:rotate-45">
              <span className="text-warm-brown font-serif text-xl -rotate-0 group-hover:rotate-0 transition-transform duration-500">DE</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-serif tracking-tight">{t('registerTitle')}</h1>
              <p className="text-[10px] tracking-[0.4em] uppercase text-warm-brown font-medium">{t('joinCollection')}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-[10px] uppercase tracking-widest text-white/40">{t('firstName')}</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="bg-transparent border-white/10 rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-[10px] uppercase tracking-widest text-white/40">{t('lastName')}</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="bg-transparent border-white/10 rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-white/40">{t('emailAddress')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-transparent border-white/10 rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-white/40">{t('phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-transparent border-white/10 rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="password" className="text-[10px] uppercase tracking-widest text-white/40">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="bg-transparent border-white/10 rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-[10px] uppercase tracking-widest text-white/40">{t('confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="bg-transparent border-white/10 rounded-none h-14 focus:border-warm-brown transition-colors text-xs tracking-widest"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-warm-brown text-white py-6 text-[10px] tracking-[0.5em] uppercase font-bold hover:bg-warm-brown/90 transition-all duration-500 disabled:opacity-50"
            >
              {loading ? t('loading') : t('signUp')}
            </button>
          </form>

          {/* Login Link */}
          <div className="pt-8 text-center border-t border-white/5">
            <p className="text-xs text-white/40 tracking-widest uppercase">
              {t('alreadyHaveAccount')}{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-warm-brown hover:text-white transition-colors font-bold ml-2"
              >
                {t('login')}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
