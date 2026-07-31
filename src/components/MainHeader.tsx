import React from 'react';
import { Phone, ShoppingBag, Egg, Menu } from 'lucide-react';
import { Product, Language } from '../types';
import { SearchBar } from './SearchBar';

interface MainHeaderProps {
  lang: Language;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onSelectProduct: (p: Product) => void;
  onOpenMobileMenu: () => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  lang,
  cartCount,
  cartTotal,
  onOpenCart,
  onSelectProduct,
  onOpenMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-brand-800 border-b border-white/10 shadow-xs transition-all">
      {/* MOBILE & TABLET: hamburger | centered logo | cart */}
      <div className="md:hidden max-w-7xl mx-auto px-3 pt-2.5 pb-2 grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
          aria-label={lang === 'bn' ? 'মেনু খুলুন' : 'Open menu'}
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        <a href="/" className="flex items-center justify-center gap-1.5 sm:gap-2 min-w-0 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center text-brand-600 shadow-md shadow-black/10 shrink-0">
            <Egg className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-white truncate">
            Sumon<span className="text-accent-300">Incubator</span>
          </span>
        </a>

        <button
          type="button"
          onClick={onOpenCart}
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0 relative"
          aria-label={lang === 'bn' ? 'কার্ট খুলুন' : 'Open cart'}
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-accent-400 text-slate-950 font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* MOBILE & TABLET SEARCH ROW */}
      <div className="md:hidden max-w-7xl mx-auto px-3 pb-2.5">
        <SearchBar lang={lang} onSelectProduct={onSelectProduct} />
      </div>

      {/* DESKTOP & TABLET: logo | search | phone + cart */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 py-3.5 items-center justify-between gap-4">
        {/* LOGO AREA */}
        <a href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-600 shadow-md shadow-black/10 group-hover:scale-105 transition-transform">
            <Egg className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="block">
            <div className="flex items-center gap-1">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Sumon<span className="text-accent-300">Incubator</span>
              </span>
            </div>
            <p className="text-[10px] font-semibold text-white/70 -mt-1 tracking-wider uppercase hidden sm:block">
              {lang === 'bn' ? 'ইনকিউবেটর ও ইলেকট্রনিক্স' : 'Electronics & Poultry Tech'}
            </p>
          </div>
        </a>

        {/* CENTER SEARCH BAR WITH PILL SHAPE & AUTO-SUGGEST */}
        <div className="flex-1 max-w-2xl min-w-0 mx-4">
          <SearchBar lang={lang} onSelectProduct={onSelectProduct} />
        </div>

        {/* RIGHT ACTION BUTTONS: PHONE CALL & CART */}
        <div className="flex items-center gap-3 lg:gap-5 shrink-0">
          {/* Phone Helpline */}
          <a
            href="tel:+8801700000000"
            className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-xl border border-white/25 hover:border-white/60 hover:bg-white/10 transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-white/15 text-accent-300 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">
                {lang === 'bn' ? 'হটলাইন কল করুন' : 'Hotline Call'}
              </p>
              <p className="text-xs font-bold text-white tracking-tight">
                01700-000000
              </p>
            </div>
          </a>

          {/* Cart Icon & Subtotal Drawer Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-1.5 sm:gap-2.5 bg-white hover:bg-slate-100 text-slate-900 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full cursor-pointer shadow-md shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-400 text-slate-950 font-black text-[10px] min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[9px] font-medium text-slate-500 leading-tight">
                {lang === 'bn' ? 'আমার কার্ট' : 'My Cart'}
              </p>
              <p className="text-[11px] sm:text-xs font-extrabold text-accent-600 leading-tight">
                ৳ {cartTotal.toLocaleString()}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
