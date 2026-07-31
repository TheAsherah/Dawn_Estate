import React from 'react';
import { X, Home, Building2, PlusCircle, HelpCircle, Mail, LogIn, UserPlus, LayoutDashboard, User } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/app/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Sidebar({ isOpen, onClose, onNavigate, currentPage }: SidebarProps) {
  const { t } = useLanguage();
  const { user, logout, isAdmin } = useAuth();
  const logoSrc = '/uploads/logoooooooooo.png';

  const handleNavigate = (page: string) => {
    onNavigate(page);
    onClose();
  };

  const menuItems = [
    { key: 'home', label: t('home'), icon: Home },
    { key: 'properties', label: t('properties'), icon: Building2 },
    { key: 'add-property', label: t('addProperty'), icon: PlusCircle },
    { key: 'help', label: t('help'), icon: HelpCircle },
    { key: 'contact', label: t('contact'), icon: Mail },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay - Sophisticated Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />

          {/* Sidebar - Sharp & Minimal */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 40, stiffness: 400 }}
            className="fixed top-0 right-0 bottom-0 w-80 lg:w-96 bg-black border-l border-white/5 shadow-2xl z-[101] overflow-y-auto flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-10">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 overflow-hidden flex items-center justify-center">
                  <img src={logoSrc} alt="Dawn Estate logo" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-serif tracking-[0.2em] text-white m-0">DAWN ESTATE</h2>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-warm-brown">{t('exclusiveProperties')}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 border border-white/5 hover:border-warm-brown transition-colors group"
              >
                <X className="w-5 h-5 text-white/40 group-hover:text-warm-brown transition-colors" />
              </button>
            </div>

            {/* User Info - Premium Card */}
            {user && (
              <div className="px-10 py-10 bg-white/5 border-y border-white/5">
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 border border-warm-brown flex items-center justify-center">
                    <User className="w-6 h-6 text-warm-brown" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-white/40 font-light">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation - Minimalist List */}
            <div className="flex-1 p-10 space-y-12">
              <nav className="space-y-6">
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-bold mb-8">{t('navigation')}</p>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.key;

                  return (
                    <button
                      key={item.key}
                      onClick={() => handleNavigate(item.key)}
                      className={`w-full flex items-center justify-between group transition-all duration-500 py-2 border-b border-transparent hover:border-warm-brown ${isActive ? 'text-warm-brown' : 'text-white/60 hover:text-white'
                        }`}
                    >
                      <div className="flex items-center space-x-4">
                        <Icon className={`w-4 h-4 transition-colors duration-500 ${isActive ? 'text-warm-brown' : 'text-white/20 group-hover:text-warm-brown'}`} />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-medium">{item.label}</span>
                      </div>
                      <div className={`w-1 h-1 bg-warm-brown transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'}`} />
                    </button>
                  );
                })}

                {/* Admin Dashboard */}
                {isAdmin && (
                  <button
                    onClick={() => handleNavigate('dashboard')}
                    className={`w-full flex items-center justify-between group transition-all duration-500 py-2 border-b border-transparent hover:border-warm-brown mt-12 ${currentPage === 'dashboard' ? 'text-warm-brown' : 'text-white/60 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center space-x-4">
                      <LayoutDashboard className={`w-4 h-4 transition-colors duration-500 ${currentPage === 'dashboard' ? 'text-warm-brown' : 'text-white/20 group-hover:text-warm-brown'}`} />
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{t('dashboard')}</span>
                    </div>
                  </button>
                )}
              </nav>

              {/* Categories - Extra Refined */}
              <div className="space-y-6">
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-bold mb-8">{t('categories')}</p>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { key: 'villa', label: t('villa') },
                    { key: 'house', label: t('house') },
                    { key: 'apartment', label: t('apartment') },
                    { key: 'studio', label: t('studio') },
                    { key: 'land', label: t('land') },
                    { key: 'daily-renting', label: t('dailyRenting') },
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => handleNavigate('properties')}
                      className="text-left text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-warm-brown transition-colors duration-500"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Auth Actions - Minimalist Footer */}
            <div className="p-10 border-t border-white/5 space-y-4">
              {!user ? (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleNavigate('login')}
                    className="py-4 border border-white/10 text-[10px] uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all duration-700"
                  >
                    {t('login')}
                  </button>
                  <button
                    onClick={() => handleNavigate('register')}
                    className="py-4 bg-warm-brown text-white text-[10px] uppercase tracking-[0.3em] hover:bg-warm-brown/80 transition-all duration-700"
                  >
                    {t('register')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full py-4 border border-white/10 text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-red-500 hover:border-red-500 transition-all duration-700 flex items-center justify-center space-x-3"
                >
                  <LogIn className="w-3 h-3" />
                  <span>{t('logout')}</span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
