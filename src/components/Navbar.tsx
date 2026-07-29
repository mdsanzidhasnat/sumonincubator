import React, { useState, useRef, useEffect } from 'react';
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
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeTab: 'home' | 'shop' | 'blog' | 'about' | 'contact' | 'videos';
  setActiveTab: (tab: 'home' | 'shop' | 'blog' | 'about' | 'contact' | 'videos') => void;
  onOpenVideos: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  activeCategory,
  setActiveCategory,
  activeTab,
  setActiveTab,
  onOpenVideos,
}) => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Icon mapping helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Egg':
        return <Egg className="w-4 h-4 text-emerald-600" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-amber-600" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-blue-600" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-4 h-4 text-teal-600" />;
      case 'Sprout':
        return <Sprout className="w-4 h-4 text-green-600" />;
      case 'Sliders':
        return <Sliders className="w-4 h-4 text-indigo-600" />;
      default:
        return <Egg className="w-4 h-4 text-emerald-600" />;
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

  return (
    <nav className="bg-slate-900 text-white shadow-md relative z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* LEFT: MEGA MENU BUTTON FOR CATEGORIES */}
        <div className="relative" ref={megaMenuRef}>
          <button
            onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
            className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-3.5 cursor-pointer transition-colors"
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
            <span>{lang === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Browse Categories'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isMegaMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Mega Menu Dropdown */}
          {isMegaMenuOpen && (
            <div className="absolute top-full left-0 w-72 bg-white rounded-b-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'bn' ? 'সকল বিভাগ' : 'All Departments'}
              </div>
              <div className="divide-y divide-slate-50">
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setIsMegaMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-emerald-50/80 transition-colors cursor-pointer ${
                    activeCategory === 'all' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold">
                      {lang === 'bn' ? 'সকল প্রোডাক্ট' : 'All Products'}
                    </span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-full">
                    150+
                  </span>
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setIsMegaMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-emerald-50/80 transition-colors cursor-pointer ${
                      activeCategory === cat.id ? 'bg-emerald-50 text-emerald-700 font-bold' : ''
                    }`}
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
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CENTER: HORIZONTAL MENU LINKS */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold tracking-wide">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-3.5 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'হোম' : 'Home'}</span>
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`px-3.5 py-3.5 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'shop'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'শপ' : 'Shop'}</span>
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`px-3.5 py-3.5 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'blog'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'আমাদের ব্লগ' : 'Our Blog'}</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-3.5 py-3.5 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3.5 py-3.5 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'contact'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}</span>
          </button>

          <button
            onClick={onOpenVideos}
            className="px-3.5 py-3.5 border-b-2 border-transparent text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{lang === 'bn' ? 'আমাদের ভিডিও' : 'Our Videos'}</span>
          </button>
        </div>

        {/* RIGHT: SPECIAL HIGHLIGHT / PROMO TAG */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/60 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-200 font-medium">
            {lang === 'bn'
              ? '৮৮টি ডিমে ৯৮% হ্যাচিং গ্যারান্টি!'
              : '98% Hatch Rate Guaranteed!'}
          </span>
        </div>
      </div>
    </nav>
  );
};
