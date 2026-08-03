import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

export const DEFAULT_HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80',
    titleEn: 'SUMON Automatic Egg Incubators — Up to 98% Hatch Rate Guarantee!',
    titleBn: 'সুমন অটোমেটিক ইনকিউবেটর — ডিম ফোটার ৯৮% পর্যন্ত নিশ্চয়তা!',
    badgeEn: '15% OFF',
    badgeBn: '১৫% ছাড়',
  },
  {
    image: 'https://images.unsplash.com/photo-1558441719-670b357024bf?auto=format&fit=crop&w=1200&q=80',
    titleEn: 'Smart Pure Sine Wave IPS Inverters & Deep Cycle Tubular Battery',
    titleBn: 'স্মার্ট পিওর সাইন ওয়েভ আইপিএস ইনভার্টার ও টিউবুলার ব্যাটারি',
    badgeEn: 'HOT DEAL',
    badgeBn: 'হট ডিল',
  },
  {
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    titleEn: 'Original XM-18 Controller Kits, Sensors & Automatic Egg Tray Motors',
    titleBn: 'অরিজিনাল XM-18 কন্ট্রোলার, সেন্সর ও এগ টার্নিং মোটর',
    badgeEn: 'BESTSELLER',
    badgeBn: 'বেস্ট সেলার',
  },
] as const;

export const DEFAULT_CONTACT_SETTINGS = {
  phone: '+8801786132611',
  phoneDisplay: '+880 1786-132611',
  whatsappNumber: '8801786132611',
  whatsappDefaultMessage: 'Salam, I want to inquire about Sumon Egg Incubator.',
  messengerPageId: 'Codeaptor',
  messengerPageUrl: 'https://www.facebook.com/Codeaptor',
} as const;

export const DEFAULT_BRAND_SETTINGS = {
  logoUrl: '',
  brandName: "Sumon's World",
} as const;

const heroSlideSchema = new Schema(
  {
    image: { type: String, default: '' },
    titleEn: { type: String, default: '' },
    titleBn: { type: String, default: '' },
    badgeEn: { type: String, default: '' },
    badgeBn: { type: String, default: '' },
  },
  { _id: false },
);

const settingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'contact' },
    phone: { type: String, default: '' },
    phoneDisplay: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    whatsappDefaultMessage: { type: String, default: '' },
    messengerPageId: { type: String, default: '' },
    messengerPageUrl: { type: String, default: '' },
    heroSlides: { type: [heroSlideSchema], default: [] },
    logoUrl: { type: String, default: '' },
    brandName: { type: String, default: "Sumon's World" },
  },
  { timestamps: true },
);

export type HeroSlide = {
  image: string;
  titleEn: string;
  titleBn: string;
  badgeEn: string;
  badgeBn: string;
};

export type ContactSettingsDoc = InferSchemaType<typeof settingsSchema> & {
  _id: Types.ObjectId;
};

export const SettingsModel = model('Settings', settingsSchema);
