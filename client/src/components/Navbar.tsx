import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Menu,
  ChevronDown,
  Egg,
  Cpu,
  Zap,
  BatteryCharging,
  Sprout,
  Sliders,
  Sparkles,
  Video,
  BookOpen,
  Info,
  Phone,
  Home,
  ShoppingBag,
} from 'lucide-react';
import { Language } from '../types';
import { categories } from '../data/categories';

interface NavbarProps {
  lang: Language;
  onOpenVideos: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, onOpenVideos }) => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Egg':
        return <Egg className="w-4 h-4 text-bismillah-primaryGreen" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-bismillah-primaryGreen" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-bismillah-primaryGreen" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-4 h-4 text-bismillah-primaryGreen" />;
      case 'Sprout':
        return <Sprout className="w-4 h-4 text-bismillah-primaryGreen" />;
      case 'Sliders':
        return <Sliders className="w-4 h-4 text-bismillah-primaryGreen" />;
      default:
        return <Egg className="w-4 h-4 text-bismillah-primaryGreen" />;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-3.5 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
      isActive
        ? 'border-bismillah-accentYellow text-white font-bold'
        : 'border-transparent text-white/85 hover:text-bismillah-accentYellow hover:border-bismillah-accentYellow/60'
    }`;

  return (
    <nav className="bg-bismillah-primaryGreen text-white relative z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* LEFT: MEGA MENU BUTTON FOR CATEGORIES */}
        <div className="relative" ref={megaMenuRef}>
          <button
            onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
            className="flex items-center gap-2.5 bg-bismillah-bgDark hover:bg-slate-800 text-white font-bold text-sm px-5 py-3.5 cursor-pointer transition-colors"
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
            <span>{lang === 'bn' ? 'সমগ্র ক্যাটাগরি' : 'All Categories'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isMegaMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Mega Menu Dropdown */}
          {isMegaMenuOpen && (
            <div className="absolute top-full left-0 w-72 bg-white rounded-sharp shadow-lg border border-bismillah-borderLight py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-bismillah-borderLight text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'bn' ? 'সকল বিভাগ' : 'All Departments'}
              </div>
              <div className="divide-y divide-slate-50">
                <Link
                  to="/shop"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-bismillah-primaryGreen/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-bismillah-primaryGreen" />
                    <span className="text-xs font-semibold">
                      {lang === 'bn' ? 'সকল প্রোডাক্ট' : 'All Products'}
                    </span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-full">
                    150+
                  </span>
                </Link>

                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-bismillah-primaryGreen/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(cat.iconName)}
                      <span className="text-xs font-semibold">
                        {lang === 'bn' ? cat.nameBn : cat.name}
                      </span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-full">
                      {cat.itemCount}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CENTER: HORIZONTAL MENU LINKS */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold tracking-wide">
          <NavLink to="/" className={linkClass}>
            <Home className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'হোম' : 'Home'}</span>
          </NavLink>

          <NavLink to="/shop" className={linkClass}>
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'শপ' : 'Shop'}</span>
          </NavLink>

          <NavLink to="/blog" className={linkClass}>
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'আমাদের ব্লগ' : 'Our Blog'}</span>
          </NavLink>

          <NavLink to="/about" className={linkClass}>
            <Info className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</span>
          </NavLink>

          <NavLink to="/contact" className={linkClass}>
            <Phone className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}</span>
          </NavLink>

          <button
            onClick={onOpenVideos}
            className="px-3.5 py-3.5 border-b-2 border-transparent text-bismillah-accentYellow hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-bismillah-accentYellow animate-pulse" />
            <span>{lang === 'bn' ? 'আমাদের ভিডিও' : 'Our Videos'}</span>
          </button>
        </div>

        {/* RIGHT: SPECIAL HIGHLIGHT / PROMO TAG */}
        <div className="hidden lg:flex items-center gap-2 bg-bismillah-bgDark/25 px-3.5 py-1.5 rounded-sm border border-white/25 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-bismillah-accentYellow" />
          <span className="text-white/90 font-medium">
            {lang === 'bn'
              ? '৮৮টি ডিমে ৯৮% হ্যাচিং গ্যারান্টি!'
              : '98% Hatch Rate Guaranteed!'}
          </span>
        </div>
      </div>
    </nav>
  );
};
