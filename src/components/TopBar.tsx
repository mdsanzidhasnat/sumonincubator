import React from 'react';
import { GitCompare, Heart, User, Globe, PhoneCall } from 'lucide-react';
import { Language } from '../types';

interface TopBarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  compareCount: number;
  wishlistCount: number;
  onOpenCompare: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  lang,
  setLang,
  compareCount,
  wishlistCount,
  onOpenCompare,
  onOpenWishlist,
  onOpenAuth,
}) => {
  return (
    <div className="bg-slate-100 border-b border-slate-200 text-xs py-1.5 px-4 text-slate-600 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Left Bengali trust tagline */}
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>
            {lang === 'bn'
              ? 'বাংলা ভাষাভাষীদের জন্য একটি বিশ্বস্ত ও নিরাপদ অনলাইন প্লাটফর্ম'
              : 'A Trusted & Secure Online E-Commerce Platform for Egg Incubators'}
          </span>
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-4 sm:gap-6 font-medium text-slate-600">
          {/* Compare Link */}
          <button
            onClick={onOpenCompare}
            className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors cursor-pointer relative"
            title="Compare Products"
          >
            <GitCompare className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'bn' ? 'তুলনা করুন' : 'Compare'}</span>
            {compareCount > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {compareCount}
              </span>
            )}
          </button>

          {/* Wishlist Link */}
          <button
            onClick={onOpenWishlist}
            className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors cursor-pointer relative"
            title="Wishlist"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>{lang === 'bn' ? 'উইশলিস্ট' : 'Wishlist'}</span>
            {wishlistCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Login / Register */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'bn' ? 'লগইন / রেজিস্ট্রেশন' : 'Login / Register'}</span>
          </button>

          {/* Language Selector */}
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-300 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-600 font-semibold transition-all cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'bn' ? 'ENGLISH' : 'বাংলা'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
