import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, ShoppingBag, Heart, GitCompare, CheckCircle2, ShieldCheck, Truck, Zap, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const {
    lang, products, handleAddToCart, handleToggleWishlist, handleToggleCompare,
    wishlistIds, compareIds, setQuickViewProduct,
  } = useApp();

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-black text-slate-900">
          {lang === 'bn' ? 'প্রোডাক্ট পাওয়া যায়নি' : 'Product Not Found'}
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          {lang === 'bn' ? 'এই প্রোডাক্টটি বিদ্যমান নেই।' : 'This product does not exist.'}
        </p>
        <Link to="/shop" className="inline-block mt-4 bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-xl">
          {lang === 'bn' ? 'শপে ফিরে যান' : 'Back to Shop'}
        </Link>
      </div>
    );
  }

  const categorySlug = product.categoryId;
  const categoryName = lang === 'bn' ? product.categoryBn : product.category;
  const isInWishlist = wishlistIds.includes(product.id);
  const isInCompare = compareIds.includes(product.id);

  return (
    <div className="py-10 bg-slate-50 min-h-full">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 flex-wrap">
          <Link to="/" className="hover:text-brand-600 transition-colors">
            {lang === 'bn' ? 'হোম' : 'Home'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to={`/category/${categorySlug}`} className="hover:text-brand-600 transition-colors">
            {categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-bold truncate max-w-[100px] xs:max-w-[200px]">
            {lang === 'bn' ? product.titleBn : product.title}
          </span>
        </nav>

        {/* Product detail card */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image section */}
            <div className="bg-slate-50 p-4 sm:p-8 flex items-center justify-center min-h-[200px] sm:min-h-[300px] lg:min-h-[450px]">
              <img
                src={product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[250px] sm:max-h-[400px] object-contain rounded-2xl"
              />
            </div>

            {/* Details section */}
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-4 sm:space-y-6">
              <div className="space-y-4">
                {product.discountPct > 0 && (
                  <span className="inline-block bg-gradient-to-r from-discount-500 to-discount-600 text-white font-black text-xs px-3 py-1 rounded-md">
                    -{product.discountPct}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
                  </span>
                )}

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {lang === 'bn' ? product.titleBn : product.title}
                </h1>

                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent-400 text-accent-400" />
                    <span className="font-bold text-slate-800">{product.rating}</span>
                  </div>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 font-medium">
                    {product.reviewCount} {lang === 'bn' ? 'রিভিউ' : 'reviews'}
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-brand-600">
                    ৳ {product.price.toLocaleString()}
                  </span>
                  {product.discountPct > 0 && (
                    <span className="text-lg text-slate-400 line-through font-semibold">
                      ৳ {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {lang === 'bn' ? product.descriptionBn : product.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-2 rounded-xl border border-brand-200/60">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>{lang === 'bn' ? 'স্টকে আছে' : 'In Stock'}</span>
                </div>

                {/* Specs */}
                {product.specs && Object.keys(product.specs).length > 0 && (
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-200">
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      {lang === 'bn' ? 'স্পেসিফিকেশন' : 'Specifications'}
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      {product.specs.capacity && (
                        <>
                          <span className="font-bold text-slate-600">{lang === 'bn' ? 'ক্ষমতা' : 'Capacity'}</span>
                          <span className="text-slate-800">{product.specs.capacity}</span>
                        </>
                      )}
                      {product.specs.power && (
                        <>
                          <span className="font-bold text-slate-600">{lang === 'bn' ? 'পাওয়ার' : 'Power'}</span>
                          <span className="text-slate-800">{product.specs.power}</span>
                        </>
                      )}
                      {product.specs.controller && (
                        <>
                          <span className="font-bold text-slate-600">{lang === 'bn' ? 'কন্ট্রোলার' : 'Controller'}</span>
                          <span className="text-slate-800">{product.specs.controller}</span>
                        </>
                      )}
                      {product.specs.warranty && (
                        <>
                          <span className="font-bold text-slate-600">{lang === 'bn' ? 'ওয়ারেন্টি' : 'Warranty'}</span>
                          <span className="text-slate-800">{product.specs.warranty}</span>
                        </>
                      )}
                      {product.specs.hatchRate && (
                        <>
                          <span className="font-bold text-slate-600">{lang === 'bn' ? 'হ্যাচ রেট' : 'Hatch Rate'}</span>
                          <span className="text-slate-800">{product.specs.hatchRate}</span>
                        </>
                      )}
                      {product.specs.dimension && (
                        <>
                          <span className="font-bold text-slate-600">{lang === 'bn' ? 'মাপ' : 'Dimension'}</span>
                          <span className="text-slate-800">{product.specs.dimension}</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 sm:flex-none bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span>{lang === 'bn' ? 'কার্টে রাখুন' : 'Add to Cart'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleWishlist(product)}
                    className={`p-2.5 sm:p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isInWishlist
                        ? 'bg-rose-50 border-rose-300 text-rose-600'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-600'
                    }`}
                    title={lang === 'bn' ? 'উইশলিস্ট' : 'Wishlist'}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleToggleCompare(product)}
                    className={`p-2.5 sm:p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isInCompare
                        ? 'bg-brand-50 border-brand-300 text-brand-600'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600'
                    }`}
                    title={lang === 'bn' ? 'তুলনা' : 'Compare'}
                  >
                    <GitCompare className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Trust features */}
              <div className="border-t border-slate-100 pt-4 grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="space-y-1">
                  <Truck className="w-5 h-5 text-brand-600 mx-auto" />
                  <p className="text-[11px] font-bold text-slate-700">
                    {lang === 'bn' ? 'সারাদেশে ডেলিভারি' : 'Nationwide Delivery'}
                  </p>
                </div>
                <div className="space-y-1">
                  <ShieldCheck className="w-5 h-5 text-brand-600 mx-auto" />
                  <p className="text-[11px] font-bold text-slate-700">
                    {lang === 'bn' ? '১ বছর ওয়ারেন্টি' : '1 Year Warranty'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Zap className="w-5 h-5 text-brand-600 mx-auto" />
                  <p className="text-[11px] font-bold text-slate-700">
                    {lang === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to shop link */}
        <div className="text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'bn' ? 'সকল প্রোডাক্ট দেখুন' : 'Back to All Products'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
