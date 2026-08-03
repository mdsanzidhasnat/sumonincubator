import { z } from 'zod';

export const contactSettingsSchema = z.object({
  body: z.object({
    phone: z.string().trim().max(30).optional(),
    phoneDisplay: z.string().trim().max(30).optional(),
    whatsappNumber: z.string().trim().max(30).optional(),
    whatsappDefaultMessage: z.string().trim().max(500).optional(),
    messengerPageId: z.string().trim().max(200).optional(),
    messengerPageUrl: z.string().trim().max(300).optional(),
  }),
});

const heroSlideSchema = z.object({
  image: z.string().trim().max(500),
  titleEn: z.string().trim().max(200).optional().default(''),
  titleBn: z.string().trim().max(200).optional().default(''),
  badgeEn: z.string().trim().max(60).optional().default(''),
  badgeBn: z.string().trim().max(60).optional().default(''),
});

export const heroSettingsSchema = z.object({
  body: z.object({
    slides: z.array(heroSlideSchema).min(1).max(10),
  }),
});
