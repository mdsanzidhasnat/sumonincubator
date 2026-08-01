import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { Product, Language } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridSectionProps {
  products: Product[];
  lang: Language;
  selectedCategory?: string;
  setSelectedCategory?: (cat: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  wishlistIds: string[];
  compareIds: string[];
  limit?: number;
  viewAllLink?: string;
}

export const ProductGridSection: React.FC<ProductGridSectionProps> = ({
  products,
  lang,
  selectedCategory: externalCategory,
  setSelectedCategory: externalSetCategory,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
  wishlistIds,
  compareIds,
  limit,
  viewAllLink,
}) => {
  const [internalCategory, setInternalCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const selectedCategory = externalCategory ?? internalCategory;
  const setSelectedCategory = externalSetCategory ?? setInternalCategory;

  const isPreview = limit !== undefined && limit > 0;

  const filterTabs = [
    { id: 'all', labelBn: 'সকল প্রোডাক্ট', labelEn: 'All Products' },
    { id: 'incubators', labelBn: 'ইনকিউবেটর', labelEn: 'Incubators' },
    { id: 'parts', labelBn: 'পার্টস ও স্পেয়ার্স', labelEn: 'Parts & Kits' },
    { id: 'ips-ups', labelBn: 'হোম আইপিএস', labelEn: 'UPS & IPS' },
    { id: 'battery', labelBn: 'ব্যাটারি', labelEn: 'Batteries' },
    { id: 'gadgets', labelBn: 'ইলেকট্রনিক্স', labelEn: 'Gadgets' },
  ];

  // Filter products by category
  let filtered = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.categoryId === selectedCategory);

  // Apply sorting
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  // Limit for preview mode
  const displayed = isPreview ? filtered.slice(0, limit) : filtered;

  return (
    <section id="all-products" className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* SECTION HEADER WITH TABS & SORT */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 uppercase tracking-widest bg-emerald-100/60 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {lang === 'bn' ? 'সুমন ক্যাটালগ' : 'SUMON Verified Catalog'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {lang === 'bn' ? 'আমাদের সকল প্রোডাক্টস' : 'OUR ALL PRODUCTS'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {lang === 'bn'
                ? 'সেরা দামে অরিজিনাল ইনকিউবেটর, স্পেয়ার পার্টস ও আইপিএস ইনভার্টার'
                : 'Original egg incubators, spare parts & IPS inverters at factory rates'}
            </p>
          </div>

          {/* FILTER TABS & SORT SELECTOR */}
          {!isPreview && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === tab.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {lang === 'bn' ? tab.labelBn : tab.labelEn}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent outline-none cursor-pointer text-slate-800 font-bold"
                >
                  <option value="featured">
                    {lang === 'bn' ? 'ফিচার্ড প্রোডাক্ট' : 'Featured First'}
                  </option>
                  <option value="price-asc">
                    {lang === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}
                  </option>
                  <option value="price-desc">
                    {lang === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}
                  </option>
                  <option value="rating">
                    {lang === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Top Rated'}
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* PRODUCT CARD GRID (4 COLUMNS DESKTOP) */}
        {displayed.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayed.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  onToggleCompare={onToggleCompare}
                  isInWishlist={wishlistIds.includes(product.id)}
                  isInCompare={compareIds.includes(product.id)}
                />
              ))}
            </div>
            {/* View All link for preview mode */}
            {isPreview && viewAllLink && (
              <div className="text-center pt-4">
                <Link
                  to={viewAllLink}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-full shadow-lg shadow-emerald-600/25 transition-all hover:scale-105"
                >
                  <span>{lang === 'bn' ? 'সকল প্রোডাক্ট দেখুন' : 'View All Products'}</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <p className="text-base font-bold text-slate-800">
              {lang === 'bn'
                ? 'এই ক্যাটাগরিতে কোনো প্রোডাক্ট পাওয়া যায়নি।'
                : 'No products found in this category.'}
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              {lang === 'bn' ? 'সকল প্রোডাক্ট দেখুন' : 'Show All Products'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
