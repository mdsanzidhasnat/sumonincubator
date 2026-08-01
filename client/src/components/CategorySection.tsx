import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Egg, Cpu, Sliders, Zap } from 'lucide-react';
import { Product, Language } from '../types';
import { ProductCard } from './ProductCard';

interface CategorySectionProps {
  categoryId: 'incubators' | 'parts' | 'gadgets' | 'ips-ups' | 'battery';
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  iconName: string;
  products: Product[];
  lang: Language;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  wishlistIds: string[];
  compareIds: string[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categoryId,
  titleEn,
  titleBn,
  subtitleEn,
  subtitleBn,
  iconName,
  products,
  lang,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
  wishlistIds,
  compareIds,
}) => {
  const categoryProducts = products
    .filter((p) => p.categoryId === categoryId)
    .slice(0, 4);

  const getIcon = () => {
    switch (iconName) {
      case 'Egg':
        return <Egg className="w-5 h-5 text-emerald-600" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-amber-600" />;
      case 'Sliders':
        return <Sliders className="w-5 h-5 text-indigo-600" />;
      default:
        return <Zap className="w-5 h-5 text-blue-600" />;
    }
  };

  if (categoryProducts.length === 0) return null;

  return (
    <section className="py-10 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* HEADER WITH "MORE PRODUCT" PILL BUTTON ALIGNED ON RIGHT */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
              {getIcon()}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {lang === 'bn' ? titleBn : titleEn}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'bn' ? subtitleBn : subtitleEn}
              </p>
            </div>
          </div>

          {/* MORE PRODUCT PILL BUTTON */}
          <Link
            to={`/category/${categoryId}`}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-300 hover:border-emerald-600 font-bold text-xs px-4 py-2 rounded-full shadow-xs cursor-pointer transition-all self-start sm:self-center"
          >
            <span>{lang === 'bn' ? 'আরও প্রোডাক্ট দেখুন' : 'More Product'}</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
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
