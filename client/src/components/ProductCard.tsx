import React from 'react';
import {
  Heart,
  GitCompare,
  Eye,
  ShoppingBag,
  Star,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { Product, Language } from '../types';

interface ProductCardProps {
  product: Product;
  lang: Language;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  isInWishlist: boolean;
  isInCompare: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
  isInWishlist,
  isInCompare,
}) => {
  return (
    <div className="group bg-white rounded-sharp border border-bismillah-borderLight hover:border-bismillah-primaryGreen transition-colors duration-300 flex flex-col overflow-hidden relative">
      {/* CARD TOP BADGES */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Discount Badge */}
        {product.discountPct > 0 ? (
          <span className="bg-bismillah-accentYellow text-slate-950 font-black text-[11px] px-2.5 py-1 rounded-sm shadow-sm">
            -{product.discountPct}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
          </span>
        ) : (
          <span />
        )}

        {/* Bestseller Ribbon */}
        {product.isBestseller && (
          <span className="bg-bismillah-primaryGreen text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm flex items-center gap-1">
            <Zap className="w-3 h-3 fill-bismillah-accentYellow text-bismillah-accentYellow" />
            {lang === 'bn' ? 'বেস্ট সেলার' : 'Bestseller'}
          </span>
        )}
      </div>

      {/* PRODUCT IMAGE CONTAINER */}
      <div className="relative bg-slate-50 aspect-4/3 overflow-hidden p-4 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 rounded-sm"
        />

        {/* HOVER QUICK ACTION OVERLAY */}
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2">
          {/* Quick View */}
          <button
            onClick={() => onQuickView(product)}
            className="w-10 h-10 rounded-sm bg-white text-slate-800 hover:bg-bismillah-primaryGreen hover:text-white shadow-lg flex items-center justify-center transition-all cursor-pointer"
            title={lang === 'bn' ? 'কুইক ভিউ' : 'Quick View'}
          >
            <Eye className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => onToggleWishlist(product)}
            className={`w-10 h-10 rounded-sm shadow-lg flex items-center justify-center transition-all cursor-pointer ${
              isInWishlist
                ? 'bg-rose-500 text-white'
                : 'bg-white text-slate-800 hover:bg-rose-500 hover:text-white'
            }`}
            title={lang === 'bn' ? 'উইশলিস্টে রাখুন' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-white' : ''}`} />
          </button>

          {/* Compare */}
          <button
            onClick={() => onToggleCompare(product)}
            className={`w-10 h-10 rounded-sm shadow-lg flex items-center justify-center transition-all cursor-pointer ${
              isInCompare
                ? 'bg-bismillah-primaryGreen text-white'
                : 'bg-white text-slate-800 hover:bg-bismillah-primaryGreen hover:text-white'
            }`}
            title={lang === 'bn' ? 'তুলনা করুন' : 'Compare'}
          >
            <GitCompare className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* CARD BODY CONTENT */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Pill Tag & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-bismillah-primaryGreen bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-sm">
              {lang === 'bn' ? product.categoryBn : product.category}
            </span>

            <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
              <Star className="w-3.5 h-3.5 fill-bismillah-accentYellow text-bismillah-accentYellow" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title - 2 lines max */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-bismillah-primaryGreen transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {lang === 'bn' ? product.titleBn : product.title}
          </h3>
        </div>

        {/* Specs highlight summary */}
        {product.specs.capacity && (
          <div className="hidden sm:block text-[11px] text-slate-500 bg-slate-50 p-2 rounded-sm border border-bismillah-borderLight font-medium">
            <span className="font-bold text-slate-700">
              {lang === 'bn' ? 'ক্ষমতা:' : 'Cap:'}{' '}
            </span>
            {product.specs.capacity}
          </div>
        )}

        {/* Pricing & Add To Cart Button */}
        <div className="pt-2 border-t border-bismillah-borderLight flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-bismillah-primaryGreen">
                ৳ {product.price.toLocaleString()}
              </span>
              {product.discountPct > 0 && (
                <span className="text-xs text-slate-400 line-through font-semibold">
                  ৳ {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-bismillah-primaryGreen mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>{lang === 'bn' ? 'স্টকে আছে' : 'In Stock'}</span>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-bold text-xs px-2.5 sm:px-3.5 py-2 rounded-sm shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'bn' ? 'কার্টে রাখুন' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
