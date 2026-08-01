import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

export const CATEGORY_KEYS = [
  'incubators',
  'parts',
  'ips-ups',
  'battery',
  'agri-tools',
  'gadgets',
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export interface Category {
  id: string;
  key: CategoryKey;
  name: string;
  nameBn: string;
  iconName: string;
  itemCount: number;
  description: string;
  descriptionBn: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nameBn: { type: String, required: true },
    iconName: { type: String, default: '' },
    itemCount: { type: Number, default: 0 },
    description: { type: String, default: '' },
    descriptionBn: { type: String, default: '' },
  },
  { timestamps: true },
);

export type CategoryDoc = InferSchemaType<typeof categorySchema> & {
  _id: Types.ObjectId;
};

export const CategoryModel = model('Category', categorySchema);
