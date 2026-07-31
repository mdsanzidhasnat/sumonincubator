import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  X,
  Home,
  ShoppingBag,
  BookOpen,
  Info,
  Phone,
  Video,
  Sparkles,
  Egg,
  Cpu,
  Zap,
  BatteryCharging,
  Sprout,
  Sliders,
} from 'lucide-react';
import { Language } from '../types';
import { categories } from '../data/categories';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenVideos: () => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Egg':
      return <Egg className="w-4 h-4 text-brand-600" />;
    case 'Cpu':
      return <Cpu className="w-4 h-4 text-accent-600" />;
    case 'Zap':
      return <Zap className="w-4 h-4 text-blue-600" />;
    case 'BatteryCharging':
      return <BatteryCharging className="w-4 h-4 text-brand-600" />;
    case 'Sprout':
      return <Sprout className="w-4 h-4 text-green-600" />;
    case 'Sliders':
      return <Sliders className="w-4 h-4 text-indigo-600" />;
    default:
      return <Egg className="w-4 h-4 text-brand-600" />;
  }
};

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
    isActive
      ? 'bg-brand-50 text-brand-700'
      : 'text-slate-700 hover:bg-slate-100'
  }`;

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenVideos,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKey);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKey);
      };
    }
    document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 left-0 w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 bg-brand-900 text-white">
          <span className="text-sm font-extrabold tracking-tight">
            {lang === 'bn' ? 'সুমন মেনু' : 'Sumon Menu'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            aria-label={lang === 'bn' ? 'মেনু বন্ধ করুন' : 'Close menu'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable nav links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-4 mb-1">
            {lang === 'bn' ? 'নেভিগেশন' : 'Navigation'}
          </p>

          <NavLink to="/" onClick={onClose} className={mobileLinkClass}>
            <Home className="w-4 h-4" />
            <span>{lang === 'bn' ? 'হোম' : 'Home'}</span>
          </NavLink>

          <NavLink to="/shop" onClick={onClose} className={mobileLinkClass}>
            <ShoppingBag className="w-4 h-4" />
            <span>{lang === 'bn' ? 'শপ' : 'Shop'}</span>
          </NavLink>

          <NavLink to="/blog" onClick={onClose} className={mobileLinkClass}>
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'bn' ? 'আমাদের ব্লগ' : 'Our Blog'}</span>
          </NavLink>

          <NavLink to="/about" onClick={onClose} className={mobileLinkClass}>
            <Info className="w-4 h-4" />
            <span>{lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</span>
          </NavLink>

          <NavLink to="/contact" onClick={onClose} className={mobileLinkClass}>
            <Phone className="w-4 h-4" />
            <span>{lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}</span>
          </NavLink>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenVideos();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-accent-700 hover:bg-accent-50 w-full text-left transition-colors cursor-pointer"
          >
            <Video className="w-4 h-4 text-accent-500" />
            <span>{lang === 'bn' ? 'আমাদের ভিডিও' : 'Our Videos'}</span>
          </button>

          {/* Divider */}
          <div className="my-3 border-t border-slate-200" />

          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-4 mb-1">
            {lang === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Categories'}
          </p>

          <Link
            to="/shop"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-brand-50 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>{lang === 'bn' ? 'সকল প্রোডাক্ট' : 'All Products'}</span>
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-brand-50 transition-colors"
            >
              {getCategoryIcon(cat.iconName)}
              <span>{lang === 'bn' ? cat.nameBn : cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
