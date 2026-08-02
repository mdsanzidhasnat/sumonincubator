import React from 'react';
import { Link } from 'react-router-dom';
import {
  Egg,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Facebook,
  Youtube,
  ArrowUp,
  Truck,
  CreditCard,
} from 'lucide-react';
import { Language } from '../types';
import { useContactSettings } from '../context/ContactSettingsContext';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

interface FooterProps {
  lang: Language;
  onOpenVideos: () => void;
  onOpenAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenVideos,
  onOpenAuth,
}) => {
  const { phoneDisplay, whatsappNumber, messengerPageId, messengerPageUrl } = useContactSettings();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-200 border-t border-slate-800 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* TOP 4 COLUMNS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* COLUMN 1: LOGO & CONTACT INFO */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-bismillah-primaryGreen flex items-center justify-center text-white">
                <Egg className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Sumon's<span className="text-bismillah-primaryGreen ml-1">World</span>
              </span>
            </Link>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {lang === 'bn'
                ? 'বাংলাদেশের নির্ভরযোগ্য অটোমেটিক ইনকিউবেটর, স্পেয়ার পার্টস ও আইপিএস ইনভার্টার প্রস্তুতকারক ও সরবরাহকারী।'
                : 'Bangladesh’s leading manufacturer and supplier of automatic egg incubators, spare parts & IPS inverters.'}
            </p>

            <div className="space-y-2 text-xs text-slate-300 font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-bismillah-primaryGreen shrink-0 mt-0.5" />
                <span>
                  {lang === 'bn'
                    ? 'চৌগাছা, যশোর, বাংলাদেশ'
                    : 'Chowgacha, Jessore, Bangladesh'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-bismillah-primaryGreen shrink-0" />
                <span>{phoneDisplay}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-bismillah-primaryGreen shrink-0" />
                <span>sumonsworld@gmail.com</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: CUSTOMER CARE */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-700 pb-2">
              {lang === 'bn' ? 'কাস্টমার কেয়ার' : 'Customer Care'}
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li>
                <a href="#" className="hover:text-bismillah-primaryGreen transition-colors">
                  {lang === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-bismillah-primaryGreen transition-colors">
                  {lang === 'bn' ? 'রিফান্ড ও রিটার্ন পলিসি' : 'Refund & Return Policy'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-bismillah-primaryGreen transition-colors">
                  {lang === 'bn' ? 'টার্মস ও কন্ডিশনস' : 'Terms & Conditions'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-bismillah-primaryGreen transition-colors">
                  {lang === 'bn' ? '১ বছর রিপ্লেসমেন্ট ওয়ারেন্টি' : 'Warranty Policy'}
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAuth}
                  className="hover:text-bismillah-accentYellow transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Order Tracking'}
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: CATEGORIES & QUICK LINKS */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-700 pb-2">
              {lang === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Quick Categories'}
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li>
                <Link
                  to="/category/incubators"
                  className="hover:text-bismillah-accentYellow transition-colors"
                >
                  {lang === 'bn' ? 'অটোমেটিক ইনকিউবেটর' : 'Automatic Egg Incubators'}
                </Link>
              </li>
              <li>
                <Link
                  to="/category/parts"
                  className="hover:text-bismillah-accentYellow transition-colors"
                >
                  {lang === 'bn' ? 'XM-18 পার্টস ও কন্ট্রোলার' : 'Incubator Parts & Kits'}
                </Link>
              </li>
              <li>
                <Link
                  to="/category/ips-ups"
                  className="hover:text-bismillah-accentYellow transition-colors"
                >
                  {lang === 'bn' ? 'হোম আইপিএস ও ইনভার্টার' : 'Home UPS & IPS'}
                </Link>
              </li>
              <li>
                <Link
                  to="/category/battery"
                  className="hover:text-bismillah-accentYellow transition-colors"
                >
                  {lang === 'bn' ? 'টিউবুলার ব্যাটারি' : 'IPS & Solar Battery'}
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenVideos}
                  className="hover:text-bismillah-accentYellow transition-colors cursor-pointer flex items-center gap-1 text-bismillah-accentYellow font-bold"
                >
                  <span>{lang === 'bn' ? 'ভিডিও টিউটোরিয়াল গ্যালারি' : 'Video Tutorials'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: ABOUT US & OFFICE HOURS */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-700 pb-2">
              {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Sumon\'s World'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {lang === 'bn'
                ? 'সুমনের ওয়ার্ল্ড দীর্ঘ ৮ বছর ধরে সততা ও বিশ্বস্ততার সাথে খামারিদের সেবা দিয়ে আসছে।'
                : 'Over 8 years of trusted service empowering poultry farmers across Bangladesh.'}
            </p>

            <div className="bg-white/10 p-3 rounded-sharp border border-slate-700/70 space-y-1">
              <p className="text-[11px] font-bold text-white">
                {lang === 'bn' ? 'অফিস খোলা:' : 'Office Hours:'}
              </p>
              <p className="text-xs text-slate-300">
                {lang === 'bn'
                  ? 'শনিবার - বৃহস্পতিবার (সকাল ৯টা - রাত ৯টা)'
                  : 'Saturday - Thursday (9:00 AM - 9:00 PM)'}
              </p>
              <p className="text-[11px] font-bold text-bismillah-accentYellow pt-1">
                bKash: 01332921116
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: PAYMENTS, COURIERS & SOCIALS */}
        <div className="border-t border-slate-700 pt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Payment Methods */}
            <div>
              <p className="text-[11px] font-extrabold text-bismillah-textMuted uppercase tracking-wider mb-2">
                {lang === 'bn' ? 'গৃহীত পেমেন্ট মাধ্যমসমূহ' : 'Accepted Payment Methods'}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-pink-600 text-white font-black text-[10px] px-2.5 py-1 rounded-sharp">
                  bKash
                </span>
                <span className="bg-orange-600 text-white font-black text-[10px] px-2.5 py-1 rounded-sharp">
                  Nagad
                </span>
                <span className="bg-purple-700 text-white font-black text-[10px] px-2.5 py-1 rounded-sharp">
                  Rocket
                </span>
                <span className="bg-blue-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-sharp">
                  VISA
                </span>
                <span className="bg-red-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-sharp">
                  Mastercard
                </span>
                <span className="bg-bismillah-primaryGreen text-white font-bold text-[10px] px-2.5 py-1 rounded-sharp">
                  Cash on Delivery
                </span>
              </div>
            </div>

            {/* Courier Partners */}
            <div>
              <p className="text-[11px] font-extrabold text-bismillah-textMuted uppercase tracking-wider mb-2">
                {lang === 'bn' ? 'ডেলিভারি পার্টনারসমূহ' : 'Delivery Partners'}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-white border border-bismillah-borderLight font-bold text-[11px] text-slate-800 px-2.5 py-1 rounded-sharp">
                  Steadfast Courier
                </span>
                <span className="bg-slate-800/80 border border-slate-700 font-bold text-[11px] text-red-400 px-2.5 py-1 rounded-sharp">
                  Pathao Courier
                </span>
                <span className="bg-white border border-bismillah-borderLight font-bold text-[11px] text-slate-800 px-2.5 py-1 rounded-sharp">
                  RedX
                </span>
                <span className="bg-slate-800/80 border border-slate-700 font-bold text-[11px] text-bismillah-accentYellow px-2.5 py-1 rounded-sharp">
                  Sundarban
                </span>
              </div>
            </div>

            {/* Social Media Circular Buttons */}
            <div className="flex items-center md:justify-end gap-3">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hidden sm:inline">
                {lang === 'bn' ? 'যুক্ত থাকুন:' : 'Follow Us:'}
              </span>

              <a
                href={messengerPageUrl || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                title="Facebook Page"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-red-400 hover:bg-red-600 hover:text-white transition-all"
                title="YouTube Channel"
              >
                <Youtube className="w-4 h-4 fill-current" />
              </a>

              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-bismillah-accentYellow hover:bg-bismillah-primaryGreen hover:text-white transition-all"
                title="WhatsApp Hotline"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>

              <button
                onClick={scrollToTop}
                className="w-9 h-9 rounded-full bg-bismillah-primaryGreen text-white flex items-center justify-center hover:bg-slate-800 transition-all cursor-pointer"
                title="Scroll to Top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Copyright line */}
          <div className="pt-4 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 font-medium">
            <p className="text-slate-400">
              © 2026 <span className="font-extrabold text-white">Sumon's World</span>. All rights reserved. Designed for Bangladesh Poultry Industry.
            </p>
            <p className="text-[11px] text-slate-500">
              {lang === 'bn'
                ? 'কারিগরি সহায়তায়: সুমন টেকনোলজি টিম'
                : 'Powered by Sumon Tech Engine'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
