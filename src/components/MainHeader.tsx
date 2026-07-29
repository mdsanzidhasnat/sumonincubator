import React, { useState, useRef, useEffect } from 'react';
import { Search, Phone, ShoppingBag, Egg, ChevronDown, X, Sparkles } from 'lucide-react';
import { Product, Language } from '../types';
import { categories } from '../data/categories';

interface MainHeaderProps {
  lang: Language;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  products: Product[];
  onSelectProduct: (p: Product) => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  lang,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  cartCount,
  cartTotal,
  onOpenCart,
  products,
  onSelectProduct,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter products for search auto-suggest
  const matchingProducts = searchQuery.trim()
    ? products.filter((p) => {
        const matchesCategory =
          selectedCategory === 'all' || p.categoryId === selectedCategory;
        const matchesQuery =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.titleBn.includes(searchQuery) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesQuery;
      }).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        {/* LOGO AREA */}
        <a href="#" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Egg className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Sumon<span className="text-emerald-600">Incubator</span>
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 -mt-1 tracking-wider uppercase">
              {lang === 'bn' ? 'ইনকিউবেটর ও ইলেকট্রনিক্স' : 'Electronics & Poultry Tech'}
            </p>
          </div>
        </a>

        {/* CENTER SEARCH BAR WITH PILL SHAPE & AUTO-SUGGEST */}
        <div
          ref={searchContainerRef}
          className="relative flex-1 max-w-2xl mx-2 order-last md:order-none w-full md:w-auto"
        >
          <div className="flex items-center bg-slate-100/90 border border-slate-200 rounded-full pl-3 pr-1.5 py-1 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-inner">
            {/* Category Dropdown inside Search */}
            <div className="relative border-r border-slate-300/70 pr-2 mr-2 hidden sm:block shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-transparent py-1.5 pl-1 pr-6 outline-none cursor-pointer appearance-none"
              >
                <option value="all">{lang === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {lang === 'bn' ? cat.nameBn : cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Input box */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={
                lang === 'bn'
                  ? 'ইনকিউবেটর, কন্ট্রোলার, ব্যাটারি বা প্রোডাক্ট খুঁজুন...'
                  : 'Search for incubators, controllers, batteries, or parts...'
              }
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none px-2 py-1 font-medium"
            />

            {/* Clear icon */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Search Submit Button */}
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full cursor-pointer shadow-sm transition-all hover:scale-105 shrink-0">
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Search Suggestions Dropdown */}
          {isSearchFocused && matchingProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2.5 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 flex justify-between items-center">
                <span>
                  {lang === 'bn' ? 'খুঁজে পাওয়া প্রোডাক্টসমূহ' : 'Matching Products'} ({matchingProducts.length})
                </span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                  Sumon Verified
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {matchingProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      setIsSearchFocused(false);
                    }}
                    className="p-3 hover:bg-emerald-50/60 flex items-center gap-3 cursor-pointer transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {lang === 'bn' ? product.titleBn : product.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'bn' ? product.categoryBn : product.category}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-emerald-600">
                        ৳ {product.price.toLocaleString()}
                      </span>
                      {product.discountPct > 0 && (
                        <p className="text-[10px] text-slate-400 line-through">
                          ৳ {product.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT ACTION BUTTONS: PHONE CALL & CART */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          {/* Phone Helpline */}
          <a
            href="tel:+8801700000000"
            className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/30 transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {lang === 'bn' ? 'হটলাইন কল করুন' : 'Hotline Call'}
              </p>
              <p className="text-xs font-bold text-slate-900 tracking-tight">
                01700-000000
              </p>
            </div>
          </a>

          {/* Cart Icon & Subtotal Drawer Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 bg-slate-900 hover:bg-emerald-700 text-white px-4 py-2 rounded-full cursor-pointer shadow-md shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 font-black text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-slate-900 shadow-sm animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[9px] font-medium text-slate-300 leading-tight">
                {lang === 'bn' ? 'আমার কার্ট' : 'My Cart'}
              </p>
              <p className="text-xs font-extrabold text-amber-400 leading-tight">
                ৳ {cartTotal.toLocaleString()}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
