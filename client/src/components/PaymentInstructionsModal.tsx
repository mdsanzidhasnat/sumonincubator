import React from 'react';
import { X, CreditCard, Info } from 'lucide-react';
import { Language } from '../types';
import { PaymentMethodInfo } from '../data/paymentMethods';

interface PaymentInstructionsModalProps {
  open: boolean;
  onClose: () => void;
  method: PaymentMethodInfo | null;
  amount: number;
  phone: string;
  lang: Language;
}

export const PaymentInstructionsModal: React.FC<PaymentInstructionsModalProps> = ({
  open,
  onClose,
  method,
  amount,
  phone,
  lang,
}) => {
  if (!open || !method) return null;

  const amountText = `৳${amount.toLocaleString()}`;
  const phoneClean = phone.replace(/^\+880\s*/, '+880').replace(/\s/g, '');

  const replacePlaceholders = (template: string) =>
    template
      .replace(/\{amount\}/g, amountText)
      .replace(/\{phone\}/g, phoneClean);

  const instruction = lang === 'bn'
    ? replacePlaceholders(method.instructionBn)
    : replacePlaceholders(method.instructionEn);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ backgroundColor: method.brandColor }}
        >
          <div className="flex items-center gap-2.5 text-white">
            <CreditCard className="w-5 h-5" />
            <h3 className="text-base font-extrabold tracking-tight">
              {lang === 'bn' ? method.nameBn : method.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-slate-50 border border-bismillah-borderLight rounded-sharp p-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              {lang === 'bn' ? 'প্রদেয় পরিমাণ' : 'Amount to Pay'}
            </span>
            <span className="text-lg font-black text-bismillah-primaryGreen">
              {amountText}
            </span>
          </div>

          <div className="bg-bismillah-primaryGreen/5 border border-bismillah-primaryGreen/20 rounded-sharp p-3.5 text-sm text-slate-700 leading-relaxed font-medium">
            {instruction}
          </div>

          <div className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              {lang === 'bn'
                ? 'পেমেন্ট করার পর আমাদের সাথে যোগাযোগ করুন যেন আপনার অর্ডার দ্রুত প্রসেস হয়।'
                : 'After paying, please contact us so we can process your order quickly.'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-bold py-2.5 rounded-sharp cursor-pointer transition-colors"
          >
            {lang === 'bn' ? 'ঠিক আছে' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};
