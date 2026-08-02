import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Phone, ShoppingBag, Egg, ChevronDown, X } from 'lucide-react';
import { Product, Language } from '../types';
import { categories } from '../data/categories';
import { products as allProducts } from '../data/products';
import { useContactSettings } from '../context/ContactSettingsContext';

interface MainHeaderProps {
  lang: Language;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onSelectProduct: (p: Product) => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  lang,
  cartCount,
  cartTotal,
  onOpenCart,
  onSelectProduct,
}) => {
  const navigate = useNavigate();
  const { phone, phoneDisplay } = useContactSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsSearchFocused(false);
    }
  };

  // Filter products for search auto-suggest
  const matchingProducts = searchQuery.trim()
    ? allProducts.filter((p: Product) => {
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

  // Reset searchQuery when navigating to a product detail
  const handleSelectProduct = (product: Product) => {
    onSelectProduct(product);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-bismillah-borderLight transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        {/* LOGO AREA */}
        <a href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 bg-bismillah-bgDark flex items-center justify-center text-bismillah-accentYellow group-hover:bg-bismillah-primaryGreen transition-colors">
            <Egg className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                SUMON<span className="text-bismillah-primaryGreen">INCUBATOR</span>
              </span>
            </div>
            <p className="text-[10px] font-semibold text-bismillah-textMuted -mt-1 tracking-wider uppercase">
              {lang === 'bn' ? 'ইনকিউবেটর ও ইলেকট্রনিক্স' : 'Electronics & Poultry Tech'}
            </p>
          </div>
        </a>

        {/* CENTER SEARCH BAR WITH PILL SHAPE & AUTO-SUGGEST */}
        <div
          ref={searchContainerRef}
          className="relative flex-1 max-w-2xl mx-2 order-last md:order-none w-full md:w-auto"
        >
          <form onSubmit={handleSearch} className="flex items-center bg-white border border-bismillah-borderLight rounded-sharp pl-3 pr-1.5 py-1 focus-within:border-bismillah-primaryGreen focus-within:ring-2 focus-within:ring-bismillah-primaryGreen/20 transition-all">
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
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-sm cursor-pointer mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Search Submit Button */}
            <button
              type="submit"
              className="bg-bismillah-primaryGreen hover:bg-emerald-700 text-white p-2 rounded-sharp cursor-pointer transition-colors shrink-0"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Search Suggestions Dropdown */}
          {isSearchFocused && matchingProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-sharp shadow-lg border border-bismillah-borderLight overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2.5 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 flex justify-between items-center">
                <span>
                  {lang === 'bn' ? 'খুঁজে পাওয়া প্রোডাক্টসমূহ' : 'Matching Products'} ({matchingProducts.length})
                </span>
                <span className="text-[10px] text-bismillah-primaryGreen font-bold uppercase tracking-wider">
                  Sumon Verified
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {matchingProducts.map((product: Product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="p-3 hover:bg-bismillah-primaryGreen/5 flex items-center gap-3 cursor-pointer transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-sm object-cover border border-slate-200 bg-slate-100 shrink-0"
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
                      <span className="text-xs font-extrabold text-bismillah-primaryGreen">
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
            href={`tel:${phone}`}
            className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-sharp border border-bismillah-borderLight hover:border-bismillah-primaryGreen/50 transition-all"
          >
            <div className="w-9 h-9 bg-bismillah-primaryGreen/10 text-bismillah-primaryGreen flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-bismillah-textMuted uppercase tracking-wider">
                {lang === 'bn' ? 'হটলাইন কল করুন' : 'Hotline Call'}
              </p>
              <p className="text-xs font-bold text-slate-900 tracking-tight">
                {phoneDisplay.replace(/^\+880\s*/, '0')}
              </p>
            </div>
          </a>

          {/* Cart Icon & Subtotal Drawer Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 bg-bismillah-primaryGreen hover:bg-emerald-700 text-white px-4 py-2 rounded-sharp cursor-pointer transition-colors"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-bismillah-accentYellow text-slate-950 font-black text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-bismillah-primaryGreen">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[9px] font-medium text-white/80 leading-tight">
                {lang === 'bn' ? 'আমার কার্ট' : 'My Cart'}
              </p>
              <p className="text-xs font-extrabold text-white leading-tight">
                ৳ {cartTotal.toLocaleString()}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
