import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { MainHeader } from './components/MainHeader';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { TrustBadges } from './components/TrustBadges';
import { ProductGridSection } from './components/ProductGridSection';
import { BestsellersSection } from './components/BestsellersSection';
import { CategorySection } from './components/CategorySection';
import { BlogSection } from './components/BlogSection';
import { Footer } from './components/Footer';

import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { CompareModal } from './components/CompareModal';
import { AuthModal } from './components/AuthModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { VideosModal } from './components/VideosModal';
import { AboutContactViews } from './components/AboutContactViews';

import { products } from './data/products';
import { Product, CartItem, Language } from './types';

export default function App() {
  const [lang, setLang] = useState<Language>('bn');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'blog' | 'about' | 'contact' | 'videos'>('home');

  // Cart state initialized with 1 default bestseller item so the user sees live total immediately
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: products[0], quantity: 1 },
    { product: products[3], quantity: 1 },
  ]);

  const [wishlistIds, setWishlistIds] = useState<string[]>(['prod-01']);
  const [compareIds, setCompareIds] = useState<string[]>(['prod-01', 'prod-02']);

  // Modals & Toast state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVideosOpen, setIsVideosOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart actions
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  // Compare toggle
  const handleToggleCompare = (product: Product) => {
    setCompareIds((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      }
      if (prev.length >= 3) {
        showToast(lang === 'bn' ? 'সর্বোচ্চ ৩টি প্রোডাক্ট একসাথে তুলনা করতে পারবেন।' : 'You can compare up to 3 products at a time.');
        return prev;
      }
      return [...prev, product.id];
    });
  };

  const handleRemoveCompare = (id: string) => {
    setCompareIds((prev) => prev.filter((pId) => pId !== id));
  };

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const compareProducts = products.filter((p) => compareIds.includes(p.id));

  const handleSeeMoreCategory = (catId: string) => {
    setSelectedCategory(catId);
    setActiveTab('shop');
    const elem = document.getElementById('all-products');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. TOP UTILITY BAR */}
      <TopBar
        lang={lang}
        setLang={setLang}
        compareCount={compareIds.length}
        wishlistCount={wishlistIds.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenWishlist={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* 2. MAIN HEADER */}
      <MainHeader
        lang={lang}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        products={products}
        onSelectProduct={(product) => setQuickViewProduct(product)}
      />

      {/* 3. NAVIGATION BAR */}
      <Navbar
        lang={lang}
        activeCategory={selectedCategory}
        setActiveCategory={(cat) => {
          setSelectedCategory(cat);
          if (activeTab !== 'home' && activeTab !== 'shop') {
            setActiveTab('shop');
          }
        }}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'videos') {
            setIsVideosOpen(true);
          } else if (tab === 'blog') {
            const blogElem = document.getElementById('blog-section');
            if (blogElem) blogElem.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenVideos={() => setIsVideosOpen(true)}
      />

      {/* VIEW CONDITIONAL ROUTING */}
      {activeTab === 'about' || activeTab === 'contact' ? (
        <main className="flex-1">
          <AboutContactViews view={activeTab} lang={lang} />
        </main>
      ) : (
        <main className="flex-1 space-y-0">
          {/* 4. HERO SECTION (Only on Home view) */}
          {activeTab === 'home' && (
            <HeroCarousel
              lang={lang}
              onShopNow={() => {
                setActiveTab('shop');
                const elem = document.getElementById('all-products');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenVideos={() => setIsVideosOpen(true)}
            />
          )}

          {/* 5. TRUST BADGES ROW */}
          <TrustBadges lang={lang} />

          {/* 6. "OUR ALL PRODUCTS" SECTION */}
          <ProductGridSection
            products={products}
            lang={lang}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onToggleCompare={handleToggleCompare}
            wishlistIds={wishlistIds}
            compareIds={compareIds}
          />

          {/* 7. "OUR BESTSELLERS" SECTION */}
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

          {/* 8. CATEGORY SECTIONS (Incubators / Incubator Parts / Electronic Gadgets) */}
          <CategorySection
            categoryId="incubators"
            titleEn="AUTOMATIC EGG INCUBATORS"
            titleBn="অটোমেটিক ডিম ইনকিউবেটর সিরিজ"
            subtitleEn="High hatch rate incubators built for Bangladeshi climate & dual AC/DC power."
            subtitleBn="৯৮% হ্যাচিং গ্যারান্টি ও এসি/ডিসি পাওয়ার সাপোর্ট সহ ডিজিটাল ইনকিউবেটর।"
            iconName="Egg"
            products={products}
            lang={lang}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onToggleCompare={handleToggleCompare}
            onSeeMoreCategory={handleSeeMoreCategory}
            wishlistIds={wishlistIds}
            compareIds={compareIds}
          />

          <CategorySection
            categoryId="parts"
            titleEn="INCUBATOR PARTS & SPARE KITS"
            titleBn="ইনকিউবেটর পার্টস ও স্পেয়ার কিটস"
            subtitleEn="XM-18 controllers, humidity foggers, sensors & egg turning motors."
            subtitleBn="ডিজিটাল থার্মোস্ট্যাট, আর্দ্রতা ফগার, প্রোভ সেন্সর ও ডিম ঘুরানোর মোটর।"
            iconName="Cpu"
            products={products}
            lang={lang}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onToggleCompare={handleToggleCompare}
            onSeeMoreCategory={handleSeeMoreCategory}
            wishlistIds={wishlistIds}
            compareIds={compareIds}
          />

          <CategorySection
            categoryId="gadgets"
            titleEn="ELECTRONIC GADGETS & TIMERS"
            titleBn="ইলেকট্রনিক্স গ্যাজেট ও টাইমার সকেট"
            subtitleEn="Voltage protectors, digital socket timers and automatic power switches."
            subtitleBn="ভোল্টেজ প্রটেক্টর, সকেট টাইমার ও ডিজিটাল পাওয়ার গার্ড গ্যাজেট।"
            iconName="Sliders"
            products={products}
            lang={lang}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onToggleCompare={handleToggleCompare}
            onSeeMoreCategory={handleSeeMoreCategory}
            wishlistIds={wishlistIds}
            compareIds={compareIds}
          />

          {/* 9. BLOG SECTION */}
          <BlogSection lang={lang} />
        </main>
      )}

      {/* 10. FOOTER */}
      <Footer
        lang={lang}
        onOpenVideos={() => setIsVideosOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSelectCategory={handleSeeMoreCategory}
      />

      {/* INTERACTIVE DRAWERS & MODALS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        lang={lang}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        lang={lang}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onToggleCompare={handleToggleCompare}
        isInWishlist={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        isInCompare={quickViewProduct ? compareIds.includes(quickViewProduct.id) : false}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        compareProducts={compareProducts}
        onRemoveCompare={handleRemoveCompare}
        onAddToCart={handleAddToCart}
        lang={lang}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        lang={lang}
      />

      <VideosModal
        isOpen={isVideosOpen}
        onClose={() => setIsVideosOpen(false)}
        lang={lang}
      />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FLOATING WHATSAPP CHAT WIDGET */}
      <WhatsAppWidget lang={lang} />
    </div>
  );
}
