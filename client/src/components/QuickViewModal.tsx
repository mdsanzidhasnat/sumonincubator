import React, { useState } from 'react';
import { X, Star, ShoppingBag, Zap, ShieldCheck, CheckCircle2, Phone, Heart, GitCompare, Plus, Minus } from 'lucide-react';
import { Product, Language } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  lang: Language;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  isInWishlist: boolean;
  isInCompare: boolean;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  lang,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
  isInWishlist,
  isInCompare,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('specs');

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg max-w-3xl w-full shadow-2xl border border-bismillah-borderLight overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* IMAGE COLUMN */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-square rounded-lg bg-slate-100 border border-bismillah-borderLight overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {product.discountPct > 0 && (
                <span className="absolute top-3 left-3 bg-bismillah-accentYellow text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg">
                  -{product.discountPct}% OFF
                </span>
              )}
            </div>

            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs text-bismillah-primaryGreen font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-bismillah-primaryGreen shrink-0" />
              <span>
                {lang === 'bn'
                  ? '১০০% অরিজিনাল ব্র্যান্ড নিউ টেস্টেড প্রোডাক্ট'
                  : '100% Original Factory Tested Quality'}
              </span>
            </div>
          </div>

          {/* DETAILS COLUMN */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-bismillah-primaryGreen bg-emerald-100 px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                {lang === 'bn' ? product.categoryBn : product.category}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-bismillah-bgDark leading-snug mt-1.5">
                {lang === 'bn' ? product.titleBn : product.title}
              </h2>

              <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1 text-bismillah-accentYellow">
                  <Star className="w-4 h-4 fill-bismillah-accentYellow" />
                  <span className="font-bold text-slate-800">{product.rating}</span>
                </div>
                <span>•</span>
                <span>{product.reviewCount} {lang === 'bn' ? 'রিভিউ' : 'Reviews'}</span>
                <span>•</span>
                <span className="text-bismillah-primaryGreen font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'স্টকে আছে (SKU: ' + product.sku + ')' : 'In Stock (SKU: ' + product.sku + ')'}
                </span>
              </div>
            </div>

            {/* PRICING */}
            <div className="bg-slate-50 p-3 rounded-lg border border-bismillah-borderLight flex items-baseline gap-3">
              <span className="text-2xl font-black text-bismillah-primaryGreen">
                ৳ {product.price.toLocaleString()}
              </span>
              {product.discountPct > 0 && (
                <span className="text-sm text-bismillah-textMuted line-through font-semibold">
                  ৳ {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* SPECIFICATIONS TABLE */}
            <div className="space-y-2">
              <div className="flex gap-2 border-b border-bismillah-borderLight text-xs font-bold">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'specs'
                      ? 'border-emerald-600 text-bismillah-primaryGreen'
                      : 'border-transparent text-bismillah-textMuted'
                  }`}
                >
                  {lang === 'bn' ? 'স্পেসিফিকেশন' : 'Specifications'}
                </button>
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'desc'
                      ? 'border-emerald-600 text-bismillah-primaryGreen'
                      : 'border-transparent text-bismillah-textMuted'
                  }`}
                >
                  {lang === 'bn' ? 'বিবরণ' : 'Description'}
                </button>
              </div>

              {activeTab === 'specs' ? (
                <div className="bg-slate-50 rounded-lg p-3 border border-bismillah-borderLight text-xs space-y-1.5 font-medium text-slate-700">
                  {product.specs.capacity && (
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-bold text-bismillah-bgDark">{lang === 'bn' ? 'ক্ষমতা:' : 'Capacity:'}</span>
                      <span className="col-span-2">{product.specs.capacity}</span>
                    </div>
                  )}
                  {product.specs.power && (
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-bold text-bismillah-bgDark">{lang === 'bn' ? 'পাওয়ার সাপ্লাই:' : 'Power:'}</span>
                      <span className="col-span-2">{product.specs.power}</span>
                    </div>
                  )}
                  {product.specs.controller && (
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-bold text-bismillah-bgDark">{lang === 'bn' ? 'কন্ট্রোলার:' : 'Controller:'}</span>
                      <span className="col-span-2">{product.specs.controller}</span>
                    </div>
                  )}
                  {product.specs.warranty && (
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-bold text-bismillah-bgDark">{lang === 'bn' ? 'ওয়ারেন্টি:' : 'Warranty:'}</span>
                      <span className="col-span-2 text-bismillah-primaryGreen font-bold">{product.specs.warranty}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-lg border border-bismillah-borderLight">
                  {lang === 'bn' ? product.descriptionBn : product.description}
                </p>
              )}
            </div>

            {/* QUANTITY & ADD TO CART */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-slate-200 text-slate-700 rounded-l-lg cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-bismillah-bgDark">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-slate-200 text-slate-700 rounded-r-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="flex-1 bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isInWishlist
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-rose-50'
                }`}
                title="Wishlist"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
