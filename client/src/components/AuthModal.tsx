import React, { useState } from 'react';
import { X, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setAuthError(lang === 'bn' ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন' : 'Enter a valid 11-digit phone number');
      return;
    }
    setAuthError('');
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '1234' || otp.length === 4) {
      setAuthError('');
      setStep('success');
    } else {
      setAuthError(lang === 'bn' ? 'ওটিপি কোড টাইপ করুন: ১২৩৪' : 'Enter OTP code: 1234');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {lang === 'bn' ? 'সুমন অ্যাকাউন্ট লগইন / রেজিস্ট্রেশন' : 'Sumon Login / Register'}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {lang === 'bn'
              ? 'আপনার ১১ ডিজিটের মোবাইল নম্বর দিয়ে ওটিপি এর মাধ্যমে দ্রুত লগইন করুন'
              : 'Enter your 11-digit mobile number for instant SMS OTP verification'}
          </p>
        </div>

        {authError && (
          <div className="bg-rose-50 text-rose-600 font-bold text-xs p-2.5 rounded-xl border border-rose-200 text-center">
            {authError}
          </div>
        )}

        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'মোবাইল নম্বর (বাংলাদেশ)' : 'Mobile Number (BD)'}
              </label>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden focus-within:border-emerald-500">
                <span className="bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-600 border-r border-slate-200">
                  +88
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2.5 text-xs font-bold text-slate-900 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-md cursor-pointer transition-all"
            >
              {lang === 'bn' ? 'ওটিপি কোড পাঠান (SMS)' : 'Send SMS OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-amber-50 p-2.5 rounded-xl text-[11px] text-amber-800 font-semibold text-center border border-amber-200">
              {lang === 'bn'
                ? `ডেমো ওটিপি কোড: ১২৩৪ (পাঠানো হয়েছে ${phone} নম্বরে)`
                : `Demo OTP Code: 1234 (Sent to ${phone})`}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'bn' ? '৪ ডিজিটের ওটিপি দিন' : '4-Digit OTP Code'}
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                className="w-full text-center tracking-widest font-mono text-lg border border-slate-300 rounded-xl p-2.5 outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-md cursor-pointer transition-all"
            >
              {lang === 'bn' ? 'কোড যাচাই করুন' : 'Verify & Continue'}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-black text-slate-900">
              {lang === 'bn' ? 'লগইন সফল হয়েছে!' : 'Login Successful!'}
            </h4>
            <button
              onClick={onClose}
              className="bg-slate-900 text-white font-bold text-xs px-5 py-2 rounded-xl cursor-pointer"
            >
              {lang === 'bn' ? 'সম্পন্ন' : 'Done'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
