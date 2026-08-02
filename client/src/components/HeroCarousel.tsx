import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Language } from '../types';

interface HeroCarouselProps {
  lang: Language;
  onShopNow: () => void;
}

const slides = [
  {
    id: 1,
    titleBn: 'সুমন অটোমেটিক ইনকিউবেটর — ডিম ফোটার ৯৮% পর্যন্ত নিশ্চয়তা!',
    titleEn: 'SUMON Automatic Egg Incubators — Up to 98% Hatch Rate Guarantee!',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80',
    badgeBn: '১৫% ছাড়',
    badgeEn: '15% OFF',
  },
  {
    id: 2,
    titleBn: 'স্মার্ট পিওর সাইন ওয়েভ আইপিএস ইনভার্টার ও টিউবুলার ব্যাটারি',
    titleEn: 'Smart Pure Sine Wave IPS Inverters & Deep Cycle Tubular Battery',
    image: 'https://images.unsplash.com/photo-1558441719-670b357024bf?auto=format&fit=crop&w=1200&q=80',
    badgeBn: 'হট ডিল',
    badgeEn: 'HOT DEAL',
  },
  {
    id: 3,
    titleBn: 'অরিজিনাল XM-18 কন্ট্রোলার, সেন্সর ও এগ টার্নিং মোটর',
    titleEn: 'Original XM-18 Controller Kits, Sensors & Automatic Egg Tray Motors',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    badgeBn: 'বেস্ট সেলার',
    badgeEn: 'BESTSELLER',
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ lang, onShopNow }) => {
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
  const badge = lang === 'bn' ? slide.badgeBn : slide.badgeEn;
  const percentMatch = badge.match(/[\d%]+/);

  return (
    <section className="relative w-full bg-white overflow-hidden border-b border-bismillah-borderLight">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden">
      <img
        src={slide.image}
        alt={slide.titleEn}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent" />

      <button
        onClick={onShopNow}
        className="absolute left-2 md:left-6 bottom-3 md:bottom-6 z-10 border-2 border-white bg-transparent hover:bg-white hover:text-slate-950 text-white font-extrabold uppercase text-xs md:text-base tracking-widest px-6 md:px-10 py-2 md:py-3 rounded-none cursor-pointer transition-colors"
      >
        SHOP NOW
      </button>

      <div className="absolute right-[8%] md:right-[12%] top-1/2 -translate-y-1/2 z-10 w-16 h-16 md:w-24 md:h-24 rounded-full bg-bismillah-accentYellow text-slate-950 flex flex-col items-center justify-center border-2 border-white shadow-md rotate-12">
        {percentMatch ? (
          <>
            <span className="text-base md:text-2xl font-black leading-none">{percentMatch[0]}</span>
            <span className="text-[8px] md:text-[10px] font-bold uppercase leading-tight mt-0.5">
              {lang === 'bn' ? 'ছাড়' : 'OFF'}
            </span>
          </>
        ) : (
          <span className="text-[9px] md:text-xs font-black uppercase text-center leading-tight px-1">
            {badge}
          </span>
        )}
      </div>

      <button
        onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
        aria-label="Previous slide"
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white/70 flex items-center justify-center text-slate-900 cursor-pointer transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        aria-label="Next slide"
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white/70 flex items-center justify-center text-slate-900 cursor-pointer transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div
        className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2"
        role="tablist"
        aria-label="Slides"
      >
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
              currentSlide === idx
                ? 'w-8 bg-bismillah-accentYellow'
                : 'w-2.5 bg-white/50 hover:bg-white/80'
            }`}
            title={`Go to slide ${idx + 1}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
        </div>
      </div>
    </section>
  );
};
