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
