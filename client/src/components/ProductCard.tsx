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
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* CARD TOP BADGES */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Discount Badge */}
        {product.discountPct > 0 ? (
          <span className="bg-amber-500 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded-lg shadow-sm">
            -{product.discountPct}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
          </span>
        ) : (
          <span />
        )}

        {/* Bestseller Ribbon */}
        {product.isBestseller && (
          <span className="bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
            <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
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
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 rounded-xl"
        />

        {/* HOVER QUICK ACTION OVERLAY */}
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2">
          {/* Quick View */}
          <button
            onClick={() => onQuickView(product)}
            className="w-10 h-10 rounded-xl bg-white text-slate-800 hover:bg-emerald-600 hover:text-white shadow-lg flex items-center justify-center transition-all cursor-pointer transform hover:scale-110"
            title={lang === 'bn' ? 'কুইক ভিউ' : 'Quick View'}
          >
            <Eye className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => onToggleWishlist(product)}
            className={`w-10 h-10 rounded-xl shadow-lg flex items-center justify-center transition-all cursor-pointer transform hover:scale-110 ${
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
            className={`w-10 h-10 rounded-xl shadow-lg flex items-center justify-center transition-all cursor-pointer transform hover:scale-110 ${
              isInCompare
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-800 hover:bg-emerald-600 hover:text-white'
            }`}
            title={lang === 'bn' ? 'তুলনা করুন' : 'Compare'}
          >
            <GitCompare className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* CARD BODY CONTENT */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Pill Tag & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
              {lang === 'bn' ? product.categoryBn : product.category}
            </span>

            <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title - 2 lines max */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {lang === 'bn' ? product.titleBn : product.title}
          </h3>
        </div>

        {/* Specs highlight summary */}
        {product.specs.capacity && (
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium">
            <span className="font-bold text-slate-700">
              {lang === 'bn' ? 'ক্ষমতা:' : 'Cap:'}{' '}
            </span>
            {product.specs.capacity}
          </div>
        )}

        {/* Pricing & Add To Cart Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-emerald-600">
                ৳ {product.price.toLocaleString()}
              </span>
              {product.discountPct > 0 && (
                <span className="text-xs text-slate-400 line-through font-semibold">
                  ৳ {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{lang === 'bn' ? 'স্টকে আছে' : 'In Stock'}</span>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'কার্টে রাখুন' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
