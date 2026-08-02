import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Language } from '../types';
import { useApp } from '../context/AppContext';

interface TrendingProductsProps {
  lang: Language;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  wishlistIds: string[];
  compareIds: string[];
}

export const TrendingProducts: React.FC<TrendingProductsProps> = ({
  lang,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
  wishlistIds,
  compareIds,
}) => {
  const { products } = useApp();

  const trending = products
    .filter((p) => p.isFeatured || p.isBestseller || p.discountPct > 0)
    .slice(0, 12);

  const duplicated = [...trending, ...trending];

  return (
    <section className="py-10 border-y border-bismillah-borderLight bg-transparent">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-bismillah-bgDark tracking-tight">
          {lang === 'bn' ? 'জনপ্রিয় পণ্য' : 'Trending Products'}
        </h2>

        <div className="relative overflow-hidden">
          <div className="flex w-max animate-scroll gap-4 sm:gap-6 md:gap-8 pb-4">
            {duplicated.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="w-[220px] sm:w-[260px] flex-shrink-0 group"
              >
                <div className="bg-white rounded-sharp border border-bismillah-borderLight overflow-hidden hover:border-bismillah-primaryGreen transition-colors duration-300">
                  <div className="relative bg-slate-50 aspect-4/3 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.discountPct > 0 && (
                      <span className="absolute top-3 left-3 z-10 bg-bismillah-accentYellow text-slate-950 font-black text-[11px] px-2.5 py-1 rounded-sm shadow-sm">
                        -{product.discountPct}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
                      </span>
                    )}
                  </div>

                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-bismillah-primaryGreen bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-sm truncate">
                        {lang === 'bn' ? product.categoryBn : product.category}
                      </span>

                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 shrink-0">
                        <svg className="w-3.5 h-3.5 fill-bismillah-accentYellow text-bismillah-accentYellow" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-.91L12 2z"/>
                        </svg>
                        <span>{product.rating}</span>
                        <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => onQuickView(product)}
                      className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-bismillah-primaryGreen transition-colors line-clamp-2 cursor-pointer leading-snug"
                    >
                      {lang === 'bn' ? product.titleBn : product.title}
                    </h3>

                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-bismillah-primaryGreen">
                        ৳ {product.price.toLocaleString()}
                      </span>
                      {product.discountPct > 0 && (
                        <span className="text-xs text-slate-400 line-through font-semibold">
                          ৳ {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      className="mt-auto w-full bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.197 1.73.707 1.73H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      <span>{lang === 'bn' ? 'কার্টে রাখুন' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <style>
            {`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll {
              animation: scroll 30s linear infinite;
            }
            .animate-scroll:hover {
              animation-play-state: paused;
            }
            `}
          </style>
        </div>
      </div>
    </section>
  );
};
