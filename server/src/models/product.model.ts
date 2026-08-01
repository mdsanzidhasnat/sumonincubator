import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

import type { CategoryKey } from './category.model.js';

export interface ProductCategoryRef {
  id: string;
  key: CategoryKey;
  name: string;
  nameBn: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  title: string;
  titleBn: string;
  category: string;
  categoryRef?: ProductCategoryRef;
  priceCents: number;
  originalPriceCents: number | null;
  currency: string;
  stockQty: number;
  rating: number;
  reviewCount: number;
  images: string[];
  isBestseller: boolean;
  isFeatured: boolean;
  isActive: boolean;
  specs: Record<string, string>;
  description: string;
  descriptionBn: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCreateInput = Omit<
  Product,
  'id' | 'category' | 'categoryRef' | 'createdAt' | 'updatedAt' | 'isActive'
> & {
  category: string;
  isActive?: boolean;
};

export type ProductUpdateInput = Partial<ProductCreateInput>;

const productSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    titleBn: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    priceCents: { type: Number, required: true, min: 0 },
    originalPriceCents: { type: Number, min: 0 },
    currency: { type: String, default: 'BDT' },
    stockQty: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    isBestseller: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    specs: { type: Map, of: String, default: {} },
    description: { type: String, default: '' },
    descriptionBn: { type: String, default: '' },
  },
  { timestamps: true },
);

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isBestseller: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ priceCents: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ title: 'text', titleBn: 'text', description: 'text', descriptionBn: 'text' });

export type ProductDoc = InferSchemaType<typeof productSchema> & {
  _id: Types.ObjectId;
};

export const ProductModel = model('Product', productSchema);
