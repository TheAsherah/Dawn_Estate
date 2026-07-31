import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { t } = useLanguage();
  const { login, loginWithGoogle, logout, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get('auth_error');
    const authSuccess = params.get('auth');
    if (authError) {
      toast.error(authError);
      params.delete('auth_error');
    }
    if (authSuccess) {
      toast.success(t('success'));
      params.delete('auth');
      onNavigate('home');
    }
    if (authError || authSuccess) {
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [onNavigate, t]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success(t('success'));
      onNavigate('home');
    } catch (error: any) {
      toast.error(error.message || t('error'));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: any) {
      toast.error(error.message || t('error'));
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-warm-brown flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#0a0a0a] border border-white/5 p-12 md:p-16 space-y-12">
          <div className="text-center space-y-6">
            <div className="w-12 h-12 border border-warm-brown flex items-center justify-center mx-auto transition-transform duration-500 hover:rotate-45">
              <span className="text-warm-brown font-serif text-xl -rotate-0 group-hover:rotate-0 transition-transform duration-500">DE</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-serif tracking-tight">{t('loginTitle')}</h1>
              <p className="text-[10px] tracking-[0.4em] uppercase text-warm-brown font-medium">{t('brandTagline')}</p>
            </div>
          </div>

          {user ? (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-warm-brown text-sm">{user.firstName?.[0] || 'U'}</span>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">{t('login')}</p>
                  <p className="text-sm tracking-wide">{`${user.firstName} ${user.lastName}`}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full border border-white/10 text-white py-6 text-[10px] tracking-[0.5em] uppercase font-bold hover:border-warm-brown transition-all duration-500"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-8">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-warm-brown text-white py-6 text-[10px] tracking-[0.5em] uppercase font-bold hover:bg-warm-brown/90 transition-all duration-500 disabled:opacity-50"
                >
                  {loading ? t('loading') : t('signIn')}
                </button>
              </form>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/30">{t('or')}</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <button
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="w-full border border-white/10 text-white py-6 text-[10px] tracking-[0.4em] uppercase font-bold hover:border-warm-brown transition-all duration-500 disabled:opacity-50"
                >
                  {googleLoading ? t('loading') : t('signInWithGoogle')}
                </button>
              </div>
            </>
          )}

          {/* Register Link */}
          {!user && (
            <div className="pt-8 text-center border-t border-white/5">
              <p className="text-xs text-white/40 tracking-widest uppercase">
                {t('dontHaveAccount')}{' '}
                <button
                  onClick={() => onNavigate('register')}
                  className="text-warm-brown hover:text-white transition-colors font-bold ml-2"
                >
                  {t('register')}
                </button>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
