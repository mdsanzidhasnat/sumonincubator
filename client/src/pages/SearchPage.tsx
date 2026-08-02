import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const {
    lang, products, handleAddToCart, handleToggleWishlist, handleToggleCompare,
    wishlistIds, compareIds, setQuickViewProduct,
  } = useApp();

  const filtered = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.titleBn.includes(query) ||
          p.category.toLowerCase().includes(q) ||
          p.categoryBn.includes(query)
        );
      })
    : [];

  return (
    <div className="py-10 bg-slate-50 min-h-full">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-bismillah-textMuted">
          <Link to="/" className="hover:text-bismillah-primaryGreen transition-colors">
            {lang === 'bn' ? 'হোম' : 'Home'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-bismillah-textMuted" />
          <span className="text-slate-800 font-bold">
            {lang === 'bn' ? 'সার্চ ফলাফল' : 'Search Results'}
          </span>
        </nav>

        {/* Search header */}
        <div className="bg-white rounded-sharp border border-bismillah-borderLight p-6 space-y-3">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-bismillah-primaryGreen" />
            <h1 className="text-2xl sm:text-3xl font-black text-bismillah-bgDark">
              {lang === 'bn' ? 'সার্চ ফলাফল' : 'Search Results'}
            </h1>
          </div>

          {query && (
            <p className="text-sm text-slate-600 font-medium">
              {lang === 'bn'
                ? `"${query}" এর জন্য ${filtered.length} টি প্রোডাক্ট পাওয়া গেছে`
                : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${query}"`}
            </p>
          )}
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                lang={lang}
                onQuickView={(p) => setQuickViewProduct(p)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onToggleCompare={handleToggleCompare}
                isInWishlist={wishlistIds.includes(product.id)}
                isInCompare={compareIds.includes(product.id)}
              />
            ))}
          </div>
        ) : query ? (
          <div className="bg-white rounded-sharp p-12 text-center border border-bismillah-borderLight space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-sharp flex items-center justify-center mx-auto">
              <X className="w-8 h-8 text-bismillah-textMuted" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800">
                {lang === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No Results Found'}
              </p>
              <p className="text-sm text-bismillah-textMuted mt-1">
                {lang === 'bn'
                  ? `"${query}" এর সাথে মিলে এমন কোনো প্রোডাক্ট নেই।`
                  : `No products found matching "${query}".`}
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-block bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-sharp transition-colors"
            >
              {lang === 'bn' ? 'সকল প্রোডাক্ট ব্রাউজ করুন' : 'Browse All Products'}
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-sharp p-12 text-center border border-bismillah-borderLight">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-bold text-slate-800">
              {lang === 'bn' ? 'কিছু সার্চ করুন' : 'Search for Products'}
            </p>
            <p className="text-sm text-bismillah-textMuted mt-1">
              {lang === 'bn'
                ? 'ইনকিউবেটর, কন্ট্রোলার, ব্যাটারি বা প্রোডাক্টের নাম লিখে সার্চ করুন।'
                : 'Type a product name, category, or keyword to search.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
