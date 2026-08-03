import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, MapPin, Phone, CreditCard, ShoppingBag, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useContactSettings } from '../context/ContactSettingsContext';
import { PAYMENT_METHODS, PaymentMethodInfo } from '../data/paymentMethods';
import { PaymentInstructionsModal } from '../components/PaymentInstructionsModal';
import { OrderInfo } from '../types';

const PAY_NOW_IDS = ['bkash', 'nagad', 'citybank', 'card', 'other'];

export const CheckoutSuccessPage: React.FC = () => {
  const { lang } = useApp();
  const { phone, phoneDisplay } = useContactSettings();
  const location = useLocation();
  const order = (location.state as { order?: OrderInfo } | null)?.order ?? null;

  const [activeMethod, setActiveMethod] = useState<PaymentMethodInfo | null>(null);

  if (!order) {
    return (
      <div className="py-20 min-h-full">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-slate-900">
            {lang === 'bn' ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No order found'}
          </h1>
          <p className="text-sm text-slate-500">
            {lang === 'bn' ? 'আপনি এখনো কোনো অর্ডার দেননি।' : 'You have not placed an order yet.'}
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-bismillah-primaryGreen text-white font-bold text-sm px-6 py-3 rounded-sharp"
          >
            <span>{lang === 'bn' ? 'কেনাকাটা করুন' : 'Go Shopping'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const selectedPaymentName =
    order.paymentMethod === 'cod'
      ? lang === 'bn'
        ? 'ক্যাশ অন ডেলিভারি'
        : 'Cash on Delivery'
      : order.paymentMethod === 'bkash'
      ? 'bKash'
      : 'Nagad';

  const amount = order.total;

  return (
    <div className="py-10 min-h-full">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* ORDER CONFIRMATION */}
        <div className="bg-white rounded-sharp border border-bismillah-borderLight overflow-hidden">
          <div className="bg-bismillah-primaryGreen px-5 py-4 text-white flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-lg font-black tracking-tight">
              {lang === 'bn' ? 'অর্ডার কনফার্মেশন' : 'Order Confirmation'}
            </h1>
            <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 text-white text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {lang === 'bn' ? 'অর্ডার সম্পন্ন' : 'Order Complete'}
            </span>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-bismillah-primaryGreen flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                {lang === 'bn' ? 'আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!' : 'Your order has been placed successfully!'}
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                {lang === 'bn' ? 'আপনার অর্ডার নম্বর:' : 'Your order Number is:'}{' '}
                <span className="font-black text-bismillah-primaryGreen text-base">#{order.orderId}</span>
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-sharp border border-bismillah-borderLight p-3.5 space-y-2">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {lang === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}
                </p>
                <div className="space-y-1 text-xs text-slate-700 font-medium">
                  <p className="font-bold text-slate-900">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    {order.customer.phone}
                  </p>
                  <p className="flex items-start gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      {order.customer.address}, {order.customer.thana}, {order.customer.district}
                    </span>
                  </p>
                  {order.customer.location && (
                    <p className="text-[10px] text-slate-400 font-mono">
                      {order.customer.location.lat.toFixed(6)}, {order.customer.location.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-sharp border border-bismillah-borderLight p-3.5 space-y-2">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {lang === 'bn' ? 'অর্ডার সামারি' : 'Order Summary'}
                </p>
                <div className="space-y-1 text-xs text-slate-700 font-medium">
                  <div className="flex justify-between">
                    <span>{lang === 'bn' ? 'আইটেম:' : 'Items:'}</span>
                    <span>{order.items.reduce((a, i) => a + i.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'bn' ? 'সাবটোটাল:' : 'Subtotal:'}</span>
                    <span>৳ {order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'bn' ? 'ডেলিভারি:' : 'Delivery:'}</span>
                    <span>৳ {order.deliveryCharge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-bismillah-borderLight font-black text-slate-900 text-sm">
                    <span>{lang === 'bn' ? 'সর্বমোট:' : 'Total:'}</span>
                    <span className="text-bismillah-primaryGreen">৳ {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COURIER TRACKING */}
        {order.courier && order.courier.status === 'created' && (
          <div className="bg-white rounded-sharp border border-bismillah-borderLight p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 border-b border-bismillah-borderLight pb-3">
              <Truck className="w-5 h-5 text-bismillah-primaryGreen" />
              <h2 className="text-base font-extrabold text-slate-900">
                {lang === 'bn' ? 'কুরিয়ার ট্র্যাকিং' : 'Courier Tracking'}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {lang === 'bn' ? 'ট্র্যাকিং কোড' : 'Tracking Code'}
                </p>
                {order.courier.trackingLink ? (
                  <a
                    href={order.courier.trackingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-black text-bismillah-primaryGreen text-lg underline underline-offset-2"
                  >
                    {order.courier.trackingCode}
                  </a>
                ) : (
                  <p className="font-black text-bismillah-primaryGreen text-lg">
                    {order.courier.trackingCode}
                  </p>
                )}
              </div>
              {order.courier.consignmentId && (
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {lang === 'bn' ? 'কনসাইনমেন্ট আইডি' : 'Consignment ID'}
                  </p>
                  <p className="font-bold text-slate-800">{order.courier.consignmentId}</p>
                </div>
              )}
            </div>
            {order.courier.trackingLink && (
              <a
                href={order.courier.trackingLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-bismillah-primaryGreen underline underline-offset-2"
              >
                {lang === 'bn'
                  ? 'ট্র্যাকিং পেজে যান (Steadfast)'
                  : 'Track your parcel on Steadfast'}
              </a>
            )}
            <p className="text-[11px] text-slate-500">
              {lang === 'bn'
                ? 'আপনার পণ্যটি শীঘ্রই কুরিয়ারে হস্তান্তর করা হবে।'
                : 'Your parcel will be handed to the courier shortly.'}
            </p>
          </div>
        )}

        {/* PAYMENT */}
        <div className="bg-white rounded-sharp border border-bismillah-borderLight p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-bismillah-borderLight pb-3">
            <CreditCard className="w-5 h-5 text-bismillah-primaryGreen" />
            <h2 className="text-base font-extrabold text-slate-900">
              {lang === 'bn' ? 'পেমেন্ট' : 'Payment'}
            </h2>
          </div>

          {/* Selected payment method */}
          <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-sharp px-4 py-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-bismillah-primaryGreen" />
              <div>
                <p className="text-sm font-extrabold text-slate-900">{selectedPaymentName}</p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {lang === 'bn' ? 'আপনার নির্বাচিত পেমেন্ট মেথড' : 'Your selected payment method'}
                </p>
              </div>
            </div>
            <span className="text-xl font-black text-bismillah-primaryGreen">৳{amount.toLocaleString()}</span>
          </div>

          {/* Or Pay Now */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-bismillah-borderLight" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              {lang === 'bn' ? 'অথবা এখন পেমেন্ট করুন' : 'Or Pay Now'}
            </span>
            <div className="flex-1 h-px bg-bismillah-borderLight" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PAYMENT_METHODS.filter((m) => PAY_NOW_IDS.includes(m.id)).map((method) => (
              <button
                key={method.id}
                onClick={() => setActiveMethod(method)}
                className="flex items-center gap-2.5 border border-bismillah-borderLight hover:border-bismillah-primaryGreen rounded-sharp px-3.5 py-3 text-left cursor-pointer transition-colors group"
              >
                <span
                  className="w-9 h-9 rounded-sharp flex items-center justify-center text-white font-black text-sm shrink-0"
                  style={{ backgroundColor: method.brandColor }}
                >
                  {method.name.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-extrabold text-slate-800 truncate">
                    {lang === 'bn' ? method.nameBn : method.name}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium truncate">
                    {lang === 'bn' ? method.categoryBn : method.category}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Phone className="w-3.5 h-3.5" />
            <span>
              {lang === 'bn'
                ? `প্রয়োজনে হেল্পলাইনে কল করুন: ${phoneDisplay}`
                : `Need help? Call us: ${phoneDisplay}`}
            </span>
          </p>
        </div>

        <Link
          to="/shop"
          className="w-full block bg-bismillah-bgDark hover:bg-emerald-900 text-white font-extrabold text-sm py-3.5 rounded-sharp text-center transition-colors"
        >
          {lang === 'bn' ? 'কেনাকাটা চালিয়ে যান' : 'Continue Shopping'}
        </Link>

        <p className="text-center text-[11px] text-slate-400">
          {lang === 'bn'
            ? 'আমাদের কাস্টমার কেয়ার টিম শীঘ্রই আপনার নম্বরে কল করে অর্ডার কনফার্ম করবে।'
            : 'Our support team will call your number shortly to confirm your order.'}
        </p>
      </div>

      <PaymentInstructionsModal
        open={!!activeMethod}
        onClose={() => setActiveMethod(null)}
        method={activeMethod}
        amount={amount}
        phone={phone}
        lang={lang}
      />
    </div>
  );
};
