import React from 'react';
import { ProductGridSection } from '../components/ProductGridSection';
import { useApp } from '../context/AppContext';

export const ShopPage: React.FC = () => {
  const {
    lang, products, handleAddToCart, handleToggleWishlist, handleToggleCompare,
    wishlistIds, compareIds, setQuickViewProduct,
  } = useApp();

  return (
    <ProductGridSection
      products={products}
      lang={lang}
      onQuickView={(p) => setQuickViewProduct(p)}
      onAddToCart={handleAddToCart}
      onToggleWishlist={handleToggleWishlist}
      onToggleCompare={handleToggleCompare}
      wishlistIds={wishlistIds}
      compareIds={compareIds}
    />
  );
};
