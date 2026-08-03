import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useApp } from '../context/AppContext';

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
  const navigate = useNavigate();
  const { handleBuyNow } = useApp();
  return (
    <div className="group bg-white rounded-sharp border border-bismillah-borderLight hover:border-bismillah-primaryGreen transition-colors duration-300 flex flex-col overflow-hidden relative">
      {/* PRODUCT IMAGE ZONE */}
      <div className="relative bg-slate-50 aspect-4/3 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {product.discountPct > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-bismillah-accentYellow text-slate-950 font-black text-[11px] px-2.5 py-1 rounded-sm shadow-sm">
            -{product.discountPct}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
          </span>
        )}

        {/* Wishlist Heart — hover only (desktop) */}
        <button
          onClick={() => onToggleWishlist(product)}
          className={`absolute top-3 right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-sharp bg-white border border-bismillah-borderLight shadow-sm flex items-center justify-center transition-all cursor-pointer opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 ${
            isInWishlist
              ? 'bg-rose-500 border-rose-500 text-white'
              : 'text-slate-600 hover:text-rose-500'
          }`}
          title={lang === 'bn' ? 'উইশলিস্টে রাখুন' : 'Add to Wishlist'}
          aria-label={lang === 'bn' ? 'উইশলিস্টে রাখুন' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-white' : ''}`} />
        </button>

        {/* Bestseller Strip */}
        {product.isBestseller && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-bismillah-primaryGreen text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-bismillah-accentYellow text-bismillah-accentYellow" />
            <span>{lang === 'bn' ? 'বেস্ট সেলার' : 'Bestseller'}</span>
          </div>
        )}

          {/* Hover Slide-Up Quick Actions (desktop only) */}
        <div className="absolute inset-x-0 bottom-0 z-10 bg-slate-900/70 backdrop-blur-[2px] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 p-2">
          <button
            onClick={() => onQuickView(product)}
            className="w-10 h-10 rounded-sharp bg-white text-slate-800 hover:bg-bismillah-primaryGreen hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title={lang === 'bn' ? 'কুইক ভিউ' : 'Quick View'}
            aria-label={lang === 'bn' ? 'কুইক ভিউ' : 'Quick View'}
          >
            <Eye className="w-4 h-4 stroke-[2.2]" />
          </button>

          <button
            onClick={() => onToggleCompare(product)}
            className={`w-10 h-10 rounded-sharp flex items-center justify-center transition-colors cursor-pointer ${
              isInCompare
                ? 'bg-bismillah-primaryGreen text-white'
                : 'bg-white text-slate-800 hover:bg-bismillah-primaryGreen hover:text-white'
            }`}
            title={lang === 'bn' ? 'তুলনা করুন' : 'Compare'}
            aria-label={lang === 'bn' ? 'তুলনা করুন' : 'Compare'}
          >
            <GitCompare className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* CARD BODY CONTENT */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col space-y-2.5">
        {/* Category Pill & Rating */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-bismillah-primaryGreen bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-sm truncate">
            {lang === 'bn' ? product.categoryBn : product.category}
          </span>

          <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 shrink-0">
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

        {/* Specs highlight (plain line) */}
        {product.specs.capacity && (
          <p className="text-[11px] text-slate-500 font-medium">
            <span className="font-bold text-slate-700">
              {lang === 'bn' ? 'ক্ষমতা:' : 'Cap:'}{' '}
            </span>
            {product.specs.capacity}
          </p>
        )}

        {/* Pricing */}
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

        {/* Stock Status */}
        <div className="flex items-center gap-1 text-[10px] font-semibold text-bismillah-primaryGreen">
          <CheckCircle2 className="w-3 h-3" />
          <span>{lang === 'bn' ? 'স্টকে আছে' : 'In Stock'}</span>
        </div>

        {/* Add To Cart + Buy Now */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-2 sm:px-4 py-2.5 rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>{lang === 'bn' ? 'কার্টে রাখুন' : 'Add to Cart'}</span>
          </button>
          <button
            onClick={() => {
              handleBuyNow(product);
              navigate('/checkout');
            }}
            className="flex-1 bg-bismillah-accentYellow hover:bg-yellow-400 text-slate-950 font-bold text-xs sm:text-sm px-2 sm:px-4 py-2.5 rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Zap className="w-4 h-4 shrink-0 fill-bismillah-accentYellow text-slate-950" />
            <span>{lang === 'bn' ? 'এখনই কিনুন' : 'Buy Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
