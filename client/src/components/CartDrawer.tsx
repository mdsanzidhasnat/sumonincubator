import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { CartItem, Language } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  lang: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  lang,
}) => {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const shippingCost = cartItems.length > 0 ? (deliveryArea === 'dhaka' ? 80 : 150) : 0;
  const freeShippingThreshold = 10000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'SUMON100') {
      setAppliedDiscount(100);
      setCouponError('');
    } else {
      setCouponError(lang === 'bn' ? 'অকার্যকর কুপন কোড (ট্রাই করুন: SUMON100)' : 'Invalid Coupon (Try: SUMON100)');
    }
  };

  const finalTotal = Math.max(0, subtotal + shippingCost - appliedDiscount);

  const handleProceedToCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-bismillah-borderLight animate-in slide-in-from-right duration-250">
          {/* HEADER */}
          <div className="p-4 bg-bismillah-bgDark text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-extrabold tracking-tight">
                {lang === 'bn' ? 'আপনার শপিং কার্ট' : 'Shopping Cart'} ({cartItems.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* FREE SHIPPING PROGRESS METER */}
          <div className="bg-emerald-50 p-3 border-b border-emerald-100 text-xs">
            <div className="flex justify-between font-bold text-bismillah-primaryGreen mb-1">
              <span>
                {subtotal >= freeShippingThreshold
                  ? lang === 'bn'
                    ? '🎉 অভিনন্দন! আপনি ফ্রি হোম ডেলিভারি পাচ্ছেন!'
                    : '🎉 Congrats! You earned FREE Home Delivery!'
                  : lang === 'bn'
                  ? `ফ্রি ডেলিভারির জন্য আরও ৳ ${(freeShippingThreshold - subtotal).toLocaleString()} টাকার কেনাকাটা করুন`
                  : `Add BDT ${(freeShippingThreshold - subtotal).toLocaleString()} more for Free Shipping`}
              </span>
            </div>
            <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-bismillah-primaryGreen transition-all duration-300 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* CART BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-bismillah-textMuted">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-700">
                  {lang === 'bn' ? 'আপনার কার্ট এখন খালি।' : 'Your cart is empty.'}
                </p>
                <button
                  onClick={onClose}
                  className="bg-bismillah-primaryGreen text-white font-bold text-xs px-5 py-2.5 rounded-lg cursor-pointer"
                >
                  {lang === 'bn' ? 'প্রোডাক্ট কেনাকাটা শুরু করুন' : 'Start Shopping'}
                </button>
              </div>
            ) : (
              <div className="divide-y divide-bismillah-borderLight">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="py-3 flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover bg-slate-100 border border-bismillah-borderLight shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-bismillah-bgDark truncate">
                        {lang === 'bn' ? product.titleBn : product.title}
                      </h4>
                      <p className="text-xs font-black text-bismillah-primaryGreen mt-0.5">
                        ৳ {product.price.toLocaleString()}
                      </p>

                      {/* Quantity selector */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                            className="p-1 hover:bg-slate-200 text-slate-700 rounded-l-lg cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-bismillah-bgDark">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                            className="p-1 hover:bg-slate-200 text-slate-700 rounded-r-lg cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="text-bismillah-textMuted hover:text-rose-600 p-1 cursor-pointer"
                          title={lang === 'bn' ? 'মুছুন' : 'Remove'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-bismillah-bgDark">
                        ৳ {(product.price * quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FOOTER TOTAL & CHECKOUT BUTTON */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-bismillah-borderLight space-y-3">
              {/* Delivery Zone Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-700 bg-white p-2 rounded-lg border border-bismillah-borderLight">
                <span>{lang === 'bn' ? 'ডেলিভারি এরিয়া:' : 'Delivery Area:'}</span>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setDeliveryArea('dhaka')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                      deliveryArea === 'dhaka'
                        ? 'bg-bismillah-primaryGreen text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {lang === 'bn' ? 'ঢাকার ভেতরে (৳৮০)' : 'Inside Dhaka (BDT 80)'}
                  </button>
                  <button
                    onClick={() => setDeliveryArea('outside')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                      deliveryArea === 'outside'
                        ? 'bg-bismillah-primaryGreen text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {lang === 'bn' ? 'ঢাকার বাইরে (৳১৫০)' : 'Outside Dhaka (BDT 150)'}
                  </button>
                </div>
              </div>

              {/* Promo code */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder={lang === 'bn' ? 'কুপন কোড (SUMON100)' : 'Coupon Code (SUMON100)'}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none uppercase font-bold text-slate-800"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-bismillah-bgDark text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-emerald-700"
                >
                  {lang === 'bn' ? 'প্রয়োগ করুন' : 'Apply'}
                </button>
              </div>
              {couponError && <p className="text-[10px] text-rose-600 font-bold">{couponError}</p>}

              {/* Total Calculation */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-slate-600">
                  <span>{lang === 'bn' ? 'পণ্যের মোট মূল্য:' : 'Subtotal:'}</span>
                  <span>৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-600">
                  <span>{lang === 'bn' ? 'কুরিয়ার ফি:' : 'Shipping Fee:'}</span>
                  <span>৳ {shippingCost}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between font-bold text-bismillah-primaryGreen">
                    <span>{lang === 'bn' ? 'কুপন ডিসকাউন্ট:' : 'Discount:'}</span>
                    <span>- ৳ {appliedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-bismillah-bgDark pt-2 border-t border-bismillah-borderLight">
                  <span>{lang === 'bn' ? 'সর্বমোট মূল্য:' : 'Grand Total:'}</span>
                  <span className="text-bismillah-primaryGreen">৳ {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-extrabold text-sm py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{lang === 'bn' ? 'চেকআউটে যান' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
