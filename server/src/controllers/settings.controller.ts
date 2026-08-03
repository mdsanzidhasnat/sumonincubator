import type { Request, Response } from 'express';

import {
  DEFAULT_BRAND_SETTINGS,
  DEFAULT_CONTACT_SETTINGS,
  DEFAULT_HERO_SLIDES,
  SettingsModel,
  type HeroSlide,
} from '../models/settings.model.js';
import { asyncHandler } from '../middlewares/error.js';

const SETTING_FIELDS = [
  'phone',
  'phoneDisplay',
  'whatsappNumber',
  'whatsappDefaultMessage',
  'messengerPageId',
  'messengerPageUrl',
] as const;

export class SettingsController {
  getContact = asyncHandler(async (_req: Request, res: Response) => {
    const doc = await SettingsModel.findOne({ key: 'contact' }).lean();

    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json({ id: 'contact', ...DEFAULT_CONTACT_SETTINGS, ...doc });
  });

  updateContact = asyncHandler(async (req: Request, res: Response) => {
    const data: Partial<Record<(typeof SETTING_FIELDS)[number], string>> = {};
    for (const field of SETTING_FIELDS) {
      const value = (req.body as Record<string, unknown>)?.[field];
      if (typeof value === 'string') {
        data[field] = value.trim();
      }
    }

    const doc = await SettingsModel.findOneAndUpdate(
      { key: 'contact' },
      { $set: data },
      { new: true, upsert: true },
    );

    res.status(200).json({ id: 'contact', ...DEFAULT_CONTACT_SETTINGS, ...doc.toObject() });
  });

  getHero = asyncHandler(async (_req: Request, res: Response) => {
    const doc = await SettingsModel.findOne({ key: 'hero' }).lean();

    const slides: HeroSlide[] = doc?.heroSlides?.length
      ? (doc.heroSlides as HeroSlide[])
      : (DEFAULT_HERO_SLIDES as unknown as HeroSlide[]);

    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json({ id: 'hero', slides });
  });

  updateHero = asyncHandler(async (req: Request, res: Response) => {
    const rawSlides = ((req.body as { slides?: unknown }).slides ?? []) as HeroSlide[];
    const slides: HeroSlide[] = rawSlides.map((slide) => ({
      image: String(slide.image ?? '').trim(),
      titleEn: String(slide.titleEn ?? '').trim(),
      titleBn: String(slide.titleBn ?? '').trim(),
      badgeEn: String(slide.badgeEn ?? '').trim(),
      badgeBn: String(slide.badgeBn ?? '').trim(),
    }));

    const doc = await SettingsModel.findOneAndUpdate(
      { key: 'hero' },
      { $set: { heroSlides: slides } },
      { new: true, upsert: true },
    );

    res.status(200).json({ id: 'hero', slides: doc.heroSlides as HeroSlide[] });
  });

  getBrand = asyncHandler(async (_req: Request, res: Response) => {
    const doc = await SettingsModel.findOne({ key: 'brand' }).lean();

    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json({ id: 'brand', ...DEFAULT_BRAND_SETTINGS, ...doc });
  });

  updateBrand = asyncHandler(async (req: Request, res: Response) => {
    const body = (req.body ?? {}) as { logoUrl?: unknown; brandName?: unknown };
    const data = {
      logoUrl: typeof body.logoUrl === 'string' ? body.logoUrl.trim() : '',
      brandName: typeof body.brandName === 'string' ? body.brandName.trim() : DEFAULT_BRAND_SETTINGS.brandName,
    };

    const doc = await SettingsModel.findOneAndUpdate(
      { key: 'brand' },
      { $set: data },
      { new: true, upsert: true },
    );

    res.status(200).json({ id: 'brand', ...DEFAULT_BRAND_SETTINGS, ...doc.toObject() });
  });
}
