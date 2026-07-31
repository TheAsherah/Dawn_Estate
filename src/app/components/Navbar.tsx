import React, { useState } from 'react';
import { Menu, X, Globe, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onToggleSidebar: () => void;
}

export function Navbar({ onNavigate, currentPage, onToggleSidebar }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, isAdmin } = useAuth();
  const logoSrc = '/uploads/logoooooooooo.png';
  const languageOptions = [
    { code: 'en' as const, label: 'EN' },
    { code: 'fr' as const, label: 'FR' },
    { code: 'ar' as const, label: 'AR' },
  ];

  const navLinks = [
    { key: 'home', label: t('home') },
    { key: 'properties', label: t('properties') },
    { key: 'add-property', label: t('addProperty') },
    { key: 'help', label: t('help') },
    { key: 'contact', label: t('contact') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-4 group"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <img src={logoSrc} alt="Dawn Estate logo" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block text-left pt-2 -ml-1">
              <h1 className="text-xl font-serif tracking-widest text-white m-0 leading-none">
                DAWN ESTATE
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-warm-brown mt-0.5">{t('exclusiveProperties')}</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => onNavigate(link.key)}
                className={`text-xs uppercase tracking-widest font-medium transition-all duration-300 relative py-2 ${currentPage === link.key
                  ? 'text-warm-brown'
                  : 'text-white/70 hover:text-warm-brown'
                  }`}
              >
                {link.label}
                {currentPage === link.key && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-warm-brown"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-white/70 hover:text-white hover:bg-white/5 uppercase text-[10px] tracking-widest">
                  <Globe className="w-3 h-3" />
                  <span>{language.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black border-white/10 text-white">
                {languageOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.code}
                    className="hover:bg-white/10 focus:bg-white/10"
                    onSelect={() => setLanguage(option.code)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-white/10 hover:border-warm-brown text-[10px] tracking-widest uppercase bg-transparent text-white">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-3 h-3 text-warm-brown" />
                      )}
                    </div>
                    <span className="hidden sm:inline">
                      {user.firstName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black border-white/10 text-white">
                  {isAdmin && (
                    <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10" onSelect={() => onNavigate('dashboard')}>
                      <LayoutDashboard className="w-3 h-3 mr-2 text-warm-brown" />
                      {t('dashboard')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10" onSelect={logout}>
                    <LogOut className="w-3 h-3 mr-2 text-red-500" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <button
                  onClick={() => onNavigate('login')}
                  className="text-[10px] uppercase tracking-widest text-white/70 hover:text-white transition-colors"
                >
                  {t('login')}
                </button>
                <Button
                  size="sm"
                  onClick={() => onNavigate('register')}
                  className="bg-warm-brown hover:bg-warm-brown/90 text-white text-[10px] tracking-widest uppercase px-6"
                >
                  {t('register')}
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
