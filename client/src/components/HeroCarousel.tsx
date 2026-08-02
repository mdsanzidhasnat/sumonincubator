import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Zap, Award, ArrowRight, Play } from 'lucide-react';
import { Language } from '../types';

interface HeroCarouselProps {
  lang: Language;
  onShopNow: () => void;
  onOpenVideos: () => void;
}

const slides = [
  {
    id: 1,
    tagBn: 'হট সেলিং প্রোডাক্ট ২০২৬',
    tagEn: 'Hot Selling 2026',
    titleBn: 'সুমন অটোমেটিক ইনকিউবেটর — ডিম ফোটার ৯৮% পর্যন্ত নিশ্চয়তা!',
    titleEn: 'SUMON Automatic Egg Incubators — Up to 98% Hatch Rate Guarantee!',
    subtitleBn: 'লোডশেডিং থাকলেও চিন্তা নেই! এসি ও ব্যাটারি ডিসি দুই পাওয়ারেই অটো কাজ করবে।',
    subtitleEn: 'Seamless AC/DC dual power support keeps hatching going even during load shedding.',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80',
    priceBn: '৳ ৩,৮৫০',
    priceEn: 'BDT 3,850',
    origPriceBn: '৳ ৪,৫০০',
    origPriceEn: 'BDT 4,500',
    badgeBn: '১৫% ছাড়',
    badgeEn: '15% OFF',
    featuresBn: ['১২V ব্যাটারিতে অটো সুইচ', 'XM-18 ডিজিটাল কন্ট্রোলার', '১ বছর ওয়ারেন্টি'],
    featuresEn: ['Auto 12V Battery Switch', 'XM-18 Digital Controller', '1 Year Warranty']
  },
  {
    id: 2,
    tagBn: 'আইপিএস ও ইউপিএস সলিউশন',
    tagEn: 'IPS & UPS Solution',
    titleBn: 'স্মার্ট পিওর সাইন ওয়েভ আইপিএস ইনভার্টার ও টিউবুলার ব্যাটারি',
    titleEn: 'Smart Pure Sine Wave IPS Inverters & Deep Cycle Tubular Battery',
    subtitleBn: 'ঘরবাড়ি, খামার ও ইনকিউবেটরের জন্য নিরবচ্ছিন্ন নিরাপদ বিদ্যুৎ নিশ্চিত করুন।',
    subtitleEn: 'Uninterrupted power backup designed for Bangladeshi summer heat & farms.',
    image: 'https://images.unsplash.com/photo-1558441719-670b357024bf?auto=format&fit=crop&w=1200&q=80',
    priceBn: '৳ ১১,৫০০',
    priceEn: 'BDT 11,500',
    origPriceBn: '৳ ১৩,২০০',
    origPriceEn: 'BDT 13,200',
    badgeBn: 'হট ডিল',
    badgeEn: 'HOT DEAL',
    featuresBn: ['১০০০VA হেভি ব্যাকআপ', '২ বছর ফ্রি ওয়ারেন্টি', 'অটো চার্জিং প্রটেকশন'],
    featuresEn: ['1000VA Heavy Backup', '2 Years Full Warranty', 'Auto Charge Protection']
  },
  {
    id: 3,
    tagBn: 'ইনকিউবেটর পার্টস ও স্পেয়ার্স',
    tagEn: 'Incubator Spare Parts',
    titleBn: 'অরিজিনাল XM-18 কন্ট্রোলার, সেন্সর ও এগ টার্নিং মোটর',
    titleEn: 'Original XM-18 Controller Kits, Sensors & Automatic Egg Tray Motors',
    subtitleBn: 'নিজের হাতে নিখুঁত ইনকিউবেটর তৈরি করুন সবথেকে কম খরচে অরিজিনাল পার্টস দিয়ে।',
    subtitleEn: 'Build your own DIY high-performance incubator with high precision components.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    priceBn: '৳ ১,৩৫০',
    priceEn: 'BDT 1,350',
    origPriceBn: '৳ ১,৬০০',
    origPriceEn: 'BDT 1,600',
    badgeBn: 'বেস্ট সেলার',
    badgeEn: 'BESTSELLER',
    featuresBn: ['সুইস আর্দ্রতা সেন্সর', 'হাই একুরেসি রিডিং', 'ক্যাশ অন ডেলিভারি'],
    featuresEn: ['Swiss Humidity Sensor', 'High Precision Reading', 'Cash on Delivery']
  }
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  lang,
  onShopNow,
  onOpenVideos,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="relative bg-white overflow-hidden py-8 md:py-12 border-b border-bismillah-borderLight">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-7 space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sharp bg-bismillah-primaryGreen text-white text-xs font-extrabold tracking-wide">
              <Zap className="w-3.5 h-3.5 text-bismillah-accentYellow fill-bismillah-accentYellow" />
              <span>{lang === 'bn' ? slide.tagBn : slide.tagEn}</span>
              <span className="bg-bismillah-accentYellow text-slate-950 font-black px-2 py-0.2 rounded-full text-[10px]">
                {lang === 'bn' ? slide.badgeBn : slide.badgeEn}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              {lang === 'bn' ? slide.titleBn : slide.titleEn}
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-base text-slate-600 font-medium max-w-xl leading-relaxed">
              {lang === 'bn' ? slide.subtitleBn : slide.subtitleEn}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {(lang === 'bn' ? slide.featuresBn : slide.featuresEn).map(
                (feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-white border border-bismillah-borderLight px-3 py-1 rounded-sharp text-xs font-bold text-slate-700"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-bismillah-primaryGreen" />
                    {feat}
                  </span>
                )
              )}
            </div>

            {/* Pricing & CTA Row */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <div className="flex items-baseline gap-2 bg-white px-4 py-2 rounded-sharp border border-bismillah-borderLight">
                <span className="text-2xl font-black text-bismillah-primaryGreen">
                  {lang === 'bn' ? slide.priceBn : slide.priceEn}
                </span>
                <span className="text-sm text-slate-400 line-through font-semibold">
                  {lang === 'bn' ? slide.origPriceBn : slide.origPriceEn}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onShopNow}
                  className="border-2 border-black bg-transparent hover:bg-black text-black hover:text-white font-extrabold uppercase text-sm tracking-wider px-6 py-3 rounded-sharp flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>{lang === 'bn' ? 'অর্ডার করুন' : 'Shop Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenVideos}
                  className="bg-white hover:bg-slate-100 text-slate-800 border border-bismillah-borderLight font-bold text-sm px-4 py-3 rounded-sharp flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Play className="w-4 h-4 text-bismillah-primaryGreen fill-bismillah-primaryGreen" />
                  <span>{lang === 'bn' ? 'ভিডিও দেখুন' : 'Watch Video'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PRODUCT BANNER IMAGE COLUMN */}
          <div className="lg:col-span-5 relative group">
            <div className="relative mx-auto max-w-md lg:max-w-none overflow-hidden bg-white border border-bismillah-borderLight">
              <div className="relative h-72 sm:h-80 md:h-96 overflow-hidden bg-slate-100">
                <img
                  src={slide.image}
                  alt={slide.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>

                {/* Circular Discount Sticker */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-bismillah-accentYellow text-slate-950 flex flex-col items-center justify-center border-2 border-white shadow-md rotate-12">
                  <span className="text-[9px] font-bold uppercase leading-none">
                    {lang === 'bn' ? 'ছাড়' : 'OFF'}
                  </span>
                  <span className="text-sm font-black leading-none mt-0.5">
                    {lang === 'bn' ? slide.badgeBn.replace('ছাড়', '').trim() : slide.badgeEn.replace('OFF', '').trim()}
                  </span>
                </div>

                {/* Floating Trust Tag */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 p-3 rounded-sharp border border-bismillah-borderLight flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-bismillah-accentYellow" />
                    <div>
                      <p className="text-xs font-black text-slate-900">
                        SUMON Quality Certified
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {lang === 'bn' ? 'ফ্যাক্টরি টেস্টেড ও কোয়ালিটি চেকেড' : 'Factory Tested & Quality Checked'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-bismillah-primaryGreen bg-bismillah-primaryGreen/10 px-2.5 py-1 rounded-sharp">
                    In Stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CAROUSEL CONTROLS & PAGINATION */}
        <div className="flex items-center justify-between pt-8">
          <div className="flex items-center gap-2" role="tablist" aria-label="Slides">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'w-8 bg-bismillah-primaryGreen'
                    : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Go to slide ${idx + 1}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
              }
              aria-label="Previous slide"
              className="w-9 h-9 rounded-sharp bg-white border border-bismillah-borderLight flex items-center justify-center text-slate-700 hover:border-bismillah-primaryGreen hover:text-bismillah-primaryGreen cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % slides.length)
              }
              aria-label="Next slide"
              className="w-9 h-9 rounded-sharp bg-white border border-bismillah-borderLight flex items-center justify-center text-slate-700 hover:border-bismillah-primaryGreen hover:text-bismillah-primaryGreen cursor-pointer transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
