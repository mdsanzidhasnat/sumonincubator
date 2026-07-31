import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { categories } from '../data/categories';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const {
    lang, products, handleAddToCart, handleToggleWishlist, handleToggleCompare,
    wishlistIds, compareIds, setQuickViewProduct,
  } = useApp();

  const category = categories.find((c) => c.id === categorySlug);
  const categoryProducts = categorySlug
    ? products.filter((p) => p.categoryId === categorySlug)
    : [];

  return (
    <div className="py-10 bg-slate-50 min-h-full">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-brand-600 transition-colors">
            {lang === 'bn' ? 'হোম' : 'Home'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-bold">
            {category
              ? (lang === 'bn' ? category.nameBn : category.name)
              : (lang === 'bn' ? 'ক্যাটাগরি' : 'Category')}
          </span>
        </nav>

        {/* Category header */}
        {category && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {lang === 'bn' ? category.nameBn : category.name}
            </h1>
            <p className="text-sm text-slate-600 font-medium">
              {lang === 'bn' ? category.descriptionBn : category.description}
            </p>
            <p className="text-xs font-bold text-brand-700">
              {categoryProducts.length} {lang === 'bn' ? 'টি প্রোডাক্ট পাওয়া গেছে' : 'products found'}
            </p>
          </div>
        )}

        {!category && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h1 className="text-2xl font-black text-slate-900">
              {lang === 'bn' ? 'ক্যাটাগরি পাওয়া যায়নি' : 'Category Not Found'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {lang === 'bn' ? 'এই ক্যাটাগরিটি বিদ্যমান নেই।' : 'This category does not exist.'}
            </p>
          </div>
        )}

        {/* Product grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
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
        ) : categorySlug && category ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-base font-bold text-slate-800">
              {lang === 'bn'
                ? 'এই ক্যাটাগরিতে কোনো প্রোডাক্ট পাওয়া যায়নি।'
                : 'No products found in this category.'}
            </p>
            <Link
              to="/shop"
              className="inline-block mt-4 bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              {lang === 'bn' ? 'সকল প্রোডাক্ট দেখুন' : 'View All Products'}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};
