import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Product, Language } from '../types';
import { ProductCard } from './ProductCard';
import { SectionHeaderBlock } from './SectionHeaderBlock';

interface CategorySectionProps {
  categoryId: 'incubators' | 'parts' | 'gadgets' | 'ips-ups' | 'battery';
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
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

  if (categoryProducts.length === 0) return null;

  return (
    <section className="py-10 border-b border-bismillah-borderLight bg-transparent">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <SectionHeaderBlock
          title={lang === 'bn' ? titleBn : titleEn}
          subtitle={lang === 'bn' ? subtitleBn : subtitleEn}
        >
          <Link
            to={`/category/${categoryId}`}
            className="inline-flex items-center gap-1.5 bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-t-sharp cursor-pointer transition-colors"
          >
            <span>{lang === 'bn' ? 'আরও প্রোডাক্ট দেখুন' : 'More Product'}</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </SectionHeaderBlock>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
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
