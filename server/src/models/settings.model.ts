import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

export const DEFAULT_CONTACT_SETTINGS = {
  phone: '+8801786132611',
  phoneDisplay: '+880 1786-132611',
  whatsappNumber: '8801786132611',
  whatsappDefaultMessage: 'Salam, I want to inquire about Sumon Egg Incubator.',
  messengerPageId: 'Codeaptor',
  messengerPageUrl: 'https://www.facebook.com/Codeaptor',
} as const;

const settingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'contact' },
    phone: { type: String, default: '' },
    phoneDisplay: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    whatsappDefaultMessage: { type: String, default: '' },
    messengerPageId: { type: String, default: '' },
    messengerPageUrl: { type: String, default: '' },
  },
  { timestamps: true },
);

export type ContactSettingsDoc = InferSchemaType<typeof settingsSchema> & {
  _id: Types.ObjectId;
};

export const SettingsModel = model('Settings', settingsSchema);
