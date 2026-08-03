import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { MainHeader } from './MainHeader';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { QuickViewModal } from './QuickViewModal';
import { CompareModal } from './CompareModal';
import { AuthModal } from './AuthModal';
import { VideosModal } from './VideosModal';
import { WhatsAppWidget } from './WhatsAppWidget';
import { FloatingContactButtons } from './FloatingContactButtons';
import { useScrollBackground } from '../hooks/useScrollBackground';
import { useApp } from '../context/AppContext';

export const Layout: React.FC = () => {
  useScrollBackground();
  const {
    lang, setLang, compareIds, cartItems, handleAddToCart,
    handleToggleWishlist, handleToggleCompare, wishlistIds, compareProducts,
    handleUpdateQuantity, handleRemoveFromCart, handleRemoveCompare,
    isCartOpen, setIsCartOpen, isCompareOpen, setIsCompareOpen,
    isAuthOpen, setIsAuthOpen, isVideosOpen, setIsVideosOpen,
    quickViewProduct, setQuickViewProduct, cartTotal, cartCount,
    toastMessage, checkoutNonce,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans selection:bg-bismillah-primaryGreen selection:text-white bg-transparent">
      <TopBar
        lang={lang}
        setLang={setLang}
        compareCount={compareIds.length}
        wishlistCount={wishlistIds.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenWishlist={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <MainHeader
        lang={lang}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectProduct={(product) => setQuickViewProduct(product)}
      />

      <Navbar
        lang={lang}
        setLang={setLang}
        onOpenVideos={() => setIsVideosOpen(true)}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer
        lang={lang}
        onOpenVideos={() => setIsVideosOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        lang={lang}
        checkoutNonce={checkoutNonce}
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

      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-bismillah-bgDark text-white text-xs font-bold px-4 py-2.5 rounded-sm shadow-lg border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      <FloatingContactButtons lang={lang} />
      <WhatsAppWidget lang={lang} />
    </div>
  );
};
