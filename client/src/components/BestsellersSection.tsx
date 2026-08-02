import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { Product, Language } from '../types';
import { ProductCard } from './ProductCard';

interface BestsellersSectionProps {
  products: Product[];
  lang: Language;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  wishlistIds: string[];
  compareIds: string[];
}

export const BestsellersSection: React.FC<BestsellersSectionProps> = ({
  products,
  lang,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
  wishlistIds,
  compareIds,
}) => {
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <section className="py-12 bg-white border-y border-bismillah-borderLight">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-bismillah-bgDark uppercase tracking-widest bg-bismillah-accentYellow px-3 py-1 rounded-sharp mb-2">
              <Flame className="w-3.5 h-3.5 text-bismillah-bgDark fill-bismillah-bgDark" />
              <span>
                {lang === 'bn' ? 'সবথেকে বেশি বিক্রিত' : 'Top Customer Choice'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-bismillah-bgDark tracking-tight">
              {lang === 'bn' ? 'আমাদের সেরা বেস্টসেলার' : 'OUR BESTSELLERS'}
            </h2>
            <p className="text-xs sm:text-sm text-bismillah-textMuted font-medium mt-1">
              {lang === 'bn'
                ? 'বাংলাদেশের পোল্ট্রি খামারিদের প্রথম পছন্দের ৯৮% হ্যাচিং ইনকিউবেটর ও গ্যাজেট'
                : 'Most trusted products chosen by Bangladeshi poultry farmers & homeowners'}
            </p>
          </div>
        </div>

        {/* BESTSELLER GRID */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {bestsellers.map((product) => (
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
      </div>
    </section>
  );
};
