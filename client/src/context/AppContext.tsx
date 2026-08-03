import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product, CartItem, Language } from '../types';
import { products as fallbackProducts } from '../data/products';
import { getProducts } from '../lib/api';

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  cartItems: CartItem[];
  handleAddToCart: (product: Product, quantity?: number) => void;
  handleBuyNow: (product: Product) => void;
  checkoutNonce: number;
  handleUpdateQuantity: (productId: string, quantity: number) => void;
  handleRemoveFromCart: (productId: string) => void;
  wishlistIds: string[];
  handleToggleWishlist: (product: Product) => void;
  compareIds: string[];
  handleToggleCompare: (product: Product) => void;
  handleRemoveCompare: (id: string) => void;
  cartTotal: number;
  cartCount: number;
  compareProducts: Product[];
  products: Product[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isVideosOpen: boolean;
  setIsVideosOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('bn');
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutNonce, setCheckoutNonce] = useState(0);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVideosOpen, setIsVideosOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProducts({ limit: 50 })
      .then((response) => {
        if (!cancelled && response.items.length > 0) {
          setProducts(response.items);
        }
      })
      .catch(() => {
        // Keep the bundled fallback products when the API is unreachable.
      });
    return () => {
      cancelled = true;
    };
  }, []);


  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const handleAddToCart = useCallback((product: Product, quantity = 1) => {
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
  }, []);

  const handleBuyNow = useCallback((product: Product) => {
    setCheckoutNonce((n) => n + 1);
    handleAddToCart(product, 1);
  }, [handleAddToCart]);

  const handleUpdateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const handleRemoveFromCart = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const handleToggleWishlist = useCallback((product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  }, []);

  const handleToggleCompare = useCallback((product: Product) => {
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
  }, [lang, showToast]);

  const handleRemoveCompare = useCallback((id: string) => {
    setCompareIds((prev) => prev.filter((pId) => pId !== id));
  }, []);

  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [cartItems]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const compareProducts = useMemo(
    () => products.filter((p) => compareIds.includes(p.id)),
    [products, compareIds]
  );

  const value = useMemo<AppContextType>(() => ({
    lang, setLang,
    cartItems, handleAddToCart, handleBuyNow, checkoutNonce, handleUpdateQuantity, handleRemoveFromCart,
    wishlistIds, handleToggleWishlist,
    compareIds, handleToggleCompare, handleRemoveCompare,
    cartTotal, cartCount, compareProducts,
    products,
    isCartOpen, setIsCartOpen,
    isCompareOpen, setIsCompareOpen,
    isAuthOpen, setIsAuthOpen,
    isVideosOpen, setIsVideosOpen,
    quickViewProduct, setQuickViewProduct,
    toastMessage, showToast,
  }), [
    lang, cartItems, handleAddToCart, handleBuyNow, checkoutNonce, handleUpdateQuantity, handleRemoveFromCart,
    wishlistIds, handleToggleWishlist,
    compareIds, handleToggleCompare, handleRemoveCompare,
    cartTotal, cartCount, compareProducts, products,
    isCartOpen, isCompareOpen, isAuthOpen, isVideosOpen, quickViewProduct,
    toastMessage, showToast,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
