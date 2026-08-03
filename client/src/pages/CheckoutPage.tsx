import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, Lock, ArrowRight, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SearchableSelect } from '../components/SearchableSelect';
import { LocationShareMap, SharedLocation } from '../components/LocationShareMap';
import { BD_DISTRICTS, getThanas } from '../data/bangladesh';
import { OrderInfo, PaymentMethodId } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, cartItems, cartTotal, clearCart } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [districtId, setDistrictId] = useState<string | null>(null);
  const [thanaId, setThanaId] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('cod');
  const [location, setLocation] = useState<SharedLocation | null>(null);
  const [formError, setFormError] = useState('');

  const selectedDistrict = useMemo(
    () => BD_DISTRICTS.find((d) => d.id === districtId) ?? null,
    [districtId]
  );
  const thanas = useMemo(
    () => (districtId ? getThanas(districtId) : []),
    [districtId]
  );
  const selectedThana = useMemo(
    () => thanas.find((t) => t.id === thanaId) ?? null,
    [thanas, thanaId]
  );

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const deliveryCharge = selectedDistrict
    ? selectedDistrict.name.toLowerCase().includes('dhaka')
      ? 80
      : 150
    : 150;
  const total = subtotal + deliveryCharge;

  if (cartItems.length === 0) {
    return (
      <div className="py-16 min-h-full">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-bismillah-textMuted">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-slate-900">
            {lang === 'bn' ? 'আপনার কার্ট খালি' : 'Your cart is empty'}
          </h1>
          <p className="text-sm text-slate-500">
            {lang === 'bn' ? 'চেকআউট করার জন্য একটি প্রোডাক্ট যোগ করুন।' : 'Add a product before proceeding to checkout.'}
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-bismillah-primaryGreen text-white font-bold text-sm px-6 py-3 rounded-sharp cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{lang === 'bn' ? 'কেনাকাটা করুন' : 'Go Shopping'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;
    if (!firstName.trim() || !lastName.trim()) {
      setFormError(lang === 'bn' ? 'আপনার নাম লিখুন।' : 'Please enter your full name.');
      return;
    }
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      setFormError(lang === 'bn' ? 'সঠিক মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।' : 'Please enter a valid mobile number (e.g. 017XXXXXXXX).');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError(lang === 'bn' ? 'সঠিক ইমেইল ঠিকানা লিখুন।' : 'Please enter a valid email address.');
      return;
    }
    if (!districtId) {
      setFormError(lang === 'bn' ? 'জেলা সিলেক্ট করুন।' : 'Please select your district.');
      return;
    }
    if (!thanaId) {
      setFormError(lang === 'bn' ? 'থানা সিলেক্ট করুন।' : 'Please select your thana.');
      return;
    }
    if (!address.trim()) {
      setFormError(lang === 'bn' ? 'সম্পূর্ণ ঠিকানা লিখুন।' : 'Please enter your delivery address.');
      return;
    }

    const order: OrderInfo = {
      orderId: `AF-${Math.floor(100000 + Math.random() * 900000)}`,
      total,
      subtotal,
      deliveryCharge,
      paymentMethod,
      customer: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        district: selectedDistrict ? (lang === 'bn' ? selectedDistrict.nameBn : selectedDistrict.name) : '',
        thana: selectedThana ? (lang === 'bn' ? selectedThana.nameBn : selectedThana.name) : '',
        address: address.trim(),
        location,
      },
      items: cartItems,
      placedAt: new Date().toISOString(),
    };

    clearCart();
    navigate('/checkout/success', { state: { order } });
  };

  const paymentOptions: { id: PaymentMethodId; name: string; nameBn: string; color: string }[] = [
    { id: 'cod', name: 'Cash on Delivery', nameBn: 'ক্যাশ অন ডেলিভারি', color: 'emerald' },
    { id: 'bkash', name: 'bKash', nameBn: 'বিকাশ', color: 'pink' },
    { id: 'nagad', name: 'Nagad', nameBn: 'নগদ', color: 'orange' },
  ];

  const inputClass =
    'w-full bg-white border border-slate-300 rounded-sharp px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-bismillah-primaryGreen focus:ring-2 focus:ring-bismillah-primaryGreen/20 transition-colors placeholder:text-slate-400';

  return (
    <div className="py-10 min-h-full">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 hover:text-bismillah-primaryGreen cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ফিরে যান' : 'Back'}</span>
          </button>
          <span className="text-slate-300">/</span>
          <span>{lang === 'bn' ? 'চেকআউট' : 'Checkout'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-bismillah-primaryGreen" />
          <h1 className="text-2xl font-black text-slate-900">
            {lang === 'bn' ? 'চেকআউট' : 'Checkout'}
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-6 items-start">
          {/* LEFT: FORM */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-sharp border border-bismillah-borderLight p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-bismillah-borderLight pb-3">
                <Truck className="w-5 h-5 text-bismillah-primaryGreen" />
                <h2 className="text-base font-extrabold text-slate-900">
                  {lang === 'bn' ? 'ডেলিভারি তথ্য' : 'Delivery Information'}
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === 'bn' ? 'নামের প্রথম অংশ' : 'First Name'} *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={lang === 'bn' ? 'যেমন: মোহাম্মদ' : 'e.g. Rahim'}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === 'bn' ? 'নামের শেষাংশ' : 'Last Name'} *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={lang === 'bn' ? 'যেমন: রহিম' : 'e.g. Chowdhury'}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === 'bn' ? 'ইমেইল' : 'Email'} {lang === 'bn' ? '(ঐচ্ছিক)' : '(Optional)'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <SearchableSelect
                  label={lang === 'bn' ? 'জেলা' : 'District'} 
                  placeholder={lang === 'bn' ? 'জেলা সিলেক্ট করুন' : 'Select district'}
                  value={districtId}
                  onChange={(id) => {
                    setDistrictId(id);
                    setThanaId(null);
                  }}
                  options={BD_DISTRICTS}
                  lang={lang}
                />
                <SearchableSelect
                  label={lang === 'bn' ? 'থানা / উপজেলা' : 'Thana / Upazila'} 
                  placeholder={lang === 'bn' ? 'থানা সিলেক্ট করুন' : 'Select thana'}
                  value={thanaId}
                  onChange={setThanaId}
                  options={thanas}
                  lang={lang}
                  disabled={!districtId}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === 'bn' ? 'সম্পূর্ণ ঠিকানা (বাসা/খামার নং, রাস্তা, এলাকা)' : 'Full Address (House/Farm No, Road, Area)'} *
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: গ্রাম/রাস্তা, এলাকা, জেলা...' : 'House, Road, Area, District...'}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === 'bn' ? 'মানচিত্রে আপনার লোকেশন শেয়ার করুন' : 'Share your location on the map'} {lang === 'bn' ? '(ঐচ্ছিক)' : '(Optional)'}
                </label>
                <LocationShareMap lang={lang} value={location} onChange={setLocation} />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-sharp border border-bismillah-borderLight p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-bismillah-borderLight pb-3">
                <ShieldCheck className="w-5 h-5 text-bismillah-primaryGreen" />
                <h2 className="text-base font-extrabold text-slate-900">
                  {lang === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Method'}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {paymentOptions.map((opt) => {
                  const active = paymentMethod === opt.id;
                  const activeClasses =
                    opt.color === 'emerald'
                      ? 'border-emerald-600 bg-emerald-50 text-bismillah-primaryGreen'
                      : opt.color === 'pink'
                      ? 'border-pink-600 bg-pink-50 text-pink-700'
                      : 'border-orange-600 bg-orange-50 text-orange-700';
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`p-3 rounded-sharp border text-center font-bold text-sm transition-all cursor-pointer ${
                        active ? activeClasses : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      {lang === 'bn' ? opt.nameBn : opt.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-sharp border border-bismillah-borderLight p-5 space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 border-b border-bismillah-borderLight pb-3">
                {lang === 'bn' ? 'অর্ডার সামারি' : 'Order Summary'} ({cartItems.length})
              </h2>

              <div className="divide-y divide-bismillah-borderLight max-h-72 overflow-y-auto">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="py-3 flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-sharp object-cover bg-slate-100 border border-bismillah-borderLight shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {lang === 'bn' ? product.titleBn : product.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">Qty: {quantity}</p>
                    </div>
                    <span className="text-xs font-extrabold text-slate-800 shrink-0">
                      ৳ {(product.price * quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between font-semibold text-slate-600">
                  <span>{lang === 'bn' ? 'সাবটোটাল:' : 'Subtotal:'}</span>
                  <span>৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-600">
                  <span>{lang === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery Charge:'}</span>
                  <span>৳ {deliveryCharge.toLocaleString()}</span>
                </div>
                {selectedDistrict && (
                  <p className="text-[10px] text-slate-400">
                    {lang === 'bn'
                      ? `(${selectedDistrict.nameBn} — ${deliveryCharge === 80 ? 'ঢাকার ভেতরে ৳৮০' : 'ঢাকার বাইরে ৳১৫০'})`
                      : `(${selectedDistrict.name} — ${deliveryCharge === 80 ? 'Inside Dhaka BDT 80' : 'Outside Dhaka BDT 150'})`}
                  </p>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-bismillah-borderLight">
                  <span>{lang === 'bn' ? 'সর্বমোট:' : 'Grand Total:'}</span>
                  <span className="text-bismillah-primaryGreen">৳ {total.toLocaleString()}</span>
                </div>
              </div>

              {formError && (
                <p className="text-xs text-rose-600 font-bold bg-rose-50 border border-rose-200 rounded-sharp p-2.5">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-extrabold text-sm py-3.5 rounded-sharp shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>{lang === 'bn' ? 'অর্ডার কনফার্ম করুন' : 'Place Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <Lock className="w-3 h-3" />
                <span>{lang === 'bn' ? 'আপনার তথ্য নিরাপদ ও গোপনীয়' : 'Your information is safe & secure'}</span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
