import React, { useEffect, useState } from 'react';
import { Menu, X, Globe, User, LogOut, LayoutDashboard, Moon, Sun } from 'lucide-react';
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
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    return (window.localStorage.getItem('dawn-theme') as 'light' | 'dark' | null) ?? 'light';
  });
  const isDark = theme === 'dark';
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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    window.localStorage.setItem('dawn-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${isDark ? 'bg-black/80 border-white/10' : 'bg-white/90 border-black/10 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-4 group"
          >
            <div className="w-16 h-16 sm:w-18 sm:h-18 overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <img src={logoSrc} alt="Dawn Estate logo" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block text-left pt-2 -ml-1">
              <h1 className={`text-xl font-serif tracking-widest m-0 leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
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
                  : isDark ? 'text-white/70 hover:text-warm-brown' : 'text-slate-600 hover:text-warm-brown'
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
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`rounded-full p-2 ${isDark ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={`gap-2 uppercase text-[10px] tracking-widest ${isDark ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
                  <Globe className="w-3 h-3" />
                  <span>{language.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={`${isDark ? 'bg-black border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                {languageOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.code}
                    className={isDark ? 'hover:bg-white/10 focus:bg-white/10' : 'hover:bg-slate-100 focus:bg-slate-100'}
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
                  <Button variant="outline" size="sm" className={`gap-2 text-[10px] tracking-widest uppercase bg-transparent ${isDark ? 'border-white/10 hover:border-warm-brown text-white' : 'border-slate-200 hover:border-warm-brown text-slate-900'}`}>
                    <div className={`w-6 h-6 rounded-full overflow-hidden border flex items-center justify-center ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-100'}`}>
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
                <DropdownMenuContent align="end" className={`${isDark ? 'bg-black border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  {user && (
                    <DropdownMenuItem className={isDark ? 'hover:bg-white/10 focus:bg-white/10' : 'hover:bg-slate-100 focus:bg-slate-100'} onSelect={() => onNavigate('dashboard')}>
                      <LayoutDashboard className="w-3 h-3 mr-2 text-warm-brown" />
                      {t('dashboard')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className={isDark ? 'hover:bg-white/10 focus:bg-white/10' : 'hover:bg-slate-100 focus:bg-slate-100'} onSelect={logout}>
                    <LogOut className="w-3 h-3 mr-2 text-red-500" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <button
                  onClick={() => onNavigate('login')}
                  className={`text-[10px] uppercase tracking-widest transition-colors ${isDark ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
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
              className={`lg:hidden p-2 transition-colors ${isDark ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
