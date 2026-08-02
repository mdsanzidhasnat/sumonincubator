import type { Request, Response } from 'express';

import { DEFAULT_CONTACT_SETTINGS, SettingsModel } from '../models/settings.model.js';
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
}
