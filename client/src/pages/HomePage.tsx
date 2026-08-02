import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroCarousel } from '../components/HeroCarousel';
import { TrustBadges } from '../components/TrustBadges';
import { ProductGridSection } from '../components/ProductGridSection';
import { BestsellersSection } from '../components/BestsellersSection';
import { CategorySection } from '../components/CategorySection';
import { BlogSection } from '../components/BlogSection';
import { useApp } from '../context/AppContext';

export const HomePage: React.FC = () => {
  const {
    lang, products, handleAddToCart, handleToggleWishlist, handleToggleCompare,
    wishlistIds, compareIds, setQuickViewProduct, setIsVideosOpen,
  } = useApp();

  const navigate = useNavigate();

  return (
    <div className="space-y-0">
      <HeroCarousel
        lang={lang}
        onShopNow={() => navigate('/shop')}
        onOpenVideos={() => setIsVideosOpen(true)}
      />

      <TrustBadges lang={lang} />

      <ProductGridSection
        products={products}
        lang={lang}
        onQuickView={(p) => setQuickViewProduct(p)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onToggleCompare={handleToggleCompare}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
        limit={8}
        viewAllLink="/shop"
      />

      <BestsellersSection
        products={products}
        lang={lang}
        onQuickView={(p) => setQuickViewProduct(p)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onToggleCompare={handleToggleCompare}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
      />

      <CategorySection
        categoryId="incubators"
        titleEn="AUTOMATIC EGG INCUBATORS"
        titleBn="অটোমেটিক ডিম ইনকিউবেটর সিরিজ"
        subtitleEn="High hatch rate incubators built for Bangladeshi climate & dual AC/DC power."
        subtitleBn="৯৮% হ্যাচিং গ্যারান্টি ও এসি/ডিসি পাওয়ার সাপোর্ট সহ ডিজিটাল ইনকিউবেটর।"
        products={products}
        lang={lang}
        onQuickView={(p) => setQuickViewProduct(p)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onToggleCompare={handleToggleCompare}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
      />

      <CategorySection
        categoryId="parts"
        titleEn="INCUBATOR PARTS & SPARE KITS"
        titleBn="ইনকিউবেটর পার্টস ও স্পেয়ার কিটস"
        subtitleEn="XM-18 controllers, humidity foggers, sensors & egg turning motors."
        subtitleBn="ডিজিটাল থার্মোস্ট্যাট, আর্দ্রতা ফগার, প্রোভ সেন্সর ও ডিম ঘুরানোর মোটর।"
        products={products}
        lang={lang}
        onQuickView={(p) => setQuickViewProduct(p)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onToggleCompare={handleToggleCompare}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
      />

      <CategorySection
        categoryId="gadgets"
        titleEn="ELECTRONIC GADGETS & TIMERS"
        titleBn="ইলেকট্রনিক্স গ্যাজেট ও টাইমার সকেট"
        subtitleEn="Voltage protectors, digital socket timers and automatic power switches."
        subtitleBn="ভোল্টেজ প্রটেক্টর, সকেট টাইমার ও ডিজিটাল পাওয়ার গার্ড গ্যাজেট।"
        products={products}
        lang={lang}
        onQuickView={(p) => setQuickViewProduct(p)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onToggleCompare={handleToggleCompare}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
      />

      <BlogSection lang={lang} />
    </div>
  );
};
