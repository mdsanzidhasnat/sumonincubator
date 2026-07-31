import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, X } from 'lucide-react';
import { Product, Language } from '../types';
import { categories } from '../data/categories';
import { products as allProducts } from '../data/products';

interface SearchBarProps {
  lang: Language;
  onSelectProduct: (p: Product) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ lang, onSelectProduct }) => {
  const navigate = useNavigate();
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

  const handleSelectProduct = (product: Product) => {
    onSelectProduct(product);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <div ref={searchContainerRef} className="relative w-full min-w-0">
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-white border border-white/60 rounded-full pl-2 sm:pl-3 pr-1 sm:pr-1.5 py-0.5 sm:py-1 focus-within:border-accent-300 focus-within:ring-2 focus-within:ring-accent-300/30 transition-all shadow-inner"
      >
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
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Search Submit Button */}
        <button
          type="submit"
          className="bg-accent-400 hover:bg-accent-300 text-slate-900 p-2 rounded-full cursor-pointer shadow-sm transition-all hover:scale-105 shrink-0"
        >
          <Search className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>

      {/* Search Suggestions Dropdown */}
      {isSearchFocused && matchingProducts.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 flex justify-between items-center">
            <span>
              {lang === 'bn' ? 'খুঁজে পাওয়া প্রোডাক্টসমূহ' : 'Matching Products'} ({matchingProducts.length})
            </span>
            <span className="text-[10px] text-brand-600 font-bold uppercase tracking-wider">
              Sumon Verified
            </span>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {matchingProducts.map((product: Product) => (
              <div
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className="p-3 hover:bg-brand-50/60 flex items-center gap-3 cursor-pointer transition-colors"
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
                  <span className="text-xs font-extrabold text-brand-600">
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
  );
};
