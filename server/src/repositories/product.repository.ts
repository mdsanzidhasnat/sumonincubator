import mongoose, { type SortOrder, type Types } from 'mongoose';

import {
  ProductModel,
  type Product,
  type ProductCreateInput,
  type ProductDoc,
  type ProductUpdateInput,
} from '../models/product.model.js';
import { CategoryModel, type CategoryDoc, type CategoryKey } from '../models/category.model.js';

export type ProductSort = 'price_asc' | 'price_desc' | 'rating' | 'newest';

export interface ProductFilter {
  categoryKey?: string;
  q?: string;
  sort?: ProductSort;
  bestseller?: boolean;
  featured?: boolean;
  page: number;
  limit: number;
}

export interface ProductListResult {
  items: Product[];
  total: number;
}

export const LOW_STOCK_THRESHOLD = 10;

export interface ProductStatsFacet {
  total: Array<{ count: number }>;
  stockQty: Array<{ sum: number }>;
  outOfStock: Array<{ count: number }>;
  lowStock: Array<{ count: number }>;
  bestsellers: Array<{ count: number }>;
  featured: Array<{ count: number }>;
  active: Array<{ count: number }>;
  rating: Array<{ avg: number }>;
  price: Array<{ min: number; max: number; avg: number }>;
  discount: Array<{ avg: number }>;
  byCategory: Array<{ _id: Types.ObjectId; count: number }>;
}

export interface RecentProductStat {
  id: string;
  sku: string;
  title: string;
  priceCents: number;
  images: string[];
  stockQty: number;
  createdAt: Date;
}

interface ProductQuery {
  isActive: true;
  category?: Types.ObjectId;
  isBestseller?: true;
  isFeatured?: true;
  $text?: { $search: string };
  slug?: string;
  sku?: string;
  _id?: { $ne: string };
}

interface PopulatedProductDoc extends Omit<ProductDoc, 'category'> {
  category: CategoryDoc;
}

const sortMap: Record<ProductSort, Record<string, SortOrder>> = {
  price_asc: { priceCents: 1 },
  price_desc: { priceCents: -1 },
  rating: { rating: -1 },
  newest: { createdAt: -1 },
};

function toCategoryRef(doc: CategoryDoc) {
  return {
    id: doc._id.toString(),
    key: doc.key as CategoryKey,
    name: doc.name,
    nameBn: doc.nameBn,
  };
}

function toProduct(doc: PopulatedProductDoc): Product {
  return {
    id: doc._id.toString(),
    sku: doc.sku,
    slug: doc.slug,
    title: doc.title,
    titleBn: doc.titleBn,
    category: doc.category._id.toString(),
    categoryRef: toCategoryRef(doc.category),
    priceCents: doc.priceCents,
    originalPriceCents: doc.originalPriceCents ?? null,
    currency: doc.currency,
    stockQty: doc.stockQty,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
    images: doc.images,
    isBestseller: doc.isBestseller,
    isFeatured: doc.isFeatured,
    isActive: doc.isActive,
    specs: doc.specs instanceof Map ? Object.fromEntries(doc.specs) : (doc.specs ?? {}),
    description: doc.description,
    descriptionBn: doc.descriptionBn,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class ProductRepository {
  async list(filter: ProductFilter): Promise<ProductListResult> {
    const query: ProductQuery = { isActive: true };

    if (filter.categoryKey) {
      const category = await CategoryModel.findOne({ key: filter.categoryKey }).select('_id').lean();
      if (!category) return { items: [], total: 0 };
      query.category = category._id;
    }
    if (filter.bestseller) query.isBestseller = true;
    if (filter.featured) query.isFeatured = true;
    if (filter.q) query.$text = { $search: filter.q };

    const sort = sortMap[filter.sort ?? 'newest'];
    const skip = (filter.page - 1) * filter.limit;

    const [docs, total] = await Promise.all([
      ProductModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(filter.limit)
        .populate<{ category: CategoryDoc }>('category')
        .lean(),
      ProductModel.countDocuments(query),
    ]);

    return {
      items: docs.map((doc) => toProduct(doc as unknown as PopulatedProductDoc)),
      total,
    };
  }

  async findById(id: string): Promise<Product | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await ProductModel.findById(id).populate<{ category: CategoryDoc }>('category').lean();
    return doc ? toProduct(doc as unknown as PopulatedProductDoc) : null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const doc = await ProductModel.findOne({ slug }).populate<{ category: CategoryDoc }>('category').lean();
    return doc ? toProduct(doc as unknown as PopulatedProductDoc) : null;
  }

  async findBySlugOrId(slugOrId: string): Promise<Product | null> {
    return mongoose.isValidObjectId(slugOrId) ? this.findById(slugOrId) : this.findBySlug(slugOrId);
  }

  async findBySku(sku: string): Promise<Product | null> {
    const doc = await ProductModel.findOne({ sku }).populate<{ category: CategoryDoc }>('category').lean();
    return doc ? toProduct(doc as unknown as PopulatedProductDoc) : null;
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const query: Partial<ProductQuery> = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const result = await ProductModel.exists(query);
    return result != null;
  }

  async create(input: ProductCreateInput): Promise<Product> {
    const doc = await ProductModel.create(input);
    const populated = await doc.populate<{ category: CategoryDoc }>('category');
    return toProduct(populated.toObject() as unknown as PopulatedProductDoc);
  }

  async update(id: string, input: ProductUpdateInput): Promise<Product | null> {
    const doc = await ProductModel.findByIdAndUpdate(id, input, { new: true })
      .populate<{ category: CategoryDoc }>('category')
      .lean();
    return doc ? toProduct(doc as unknown as PopulatedProductDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProductModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async getStats(): Promise<{ facet: ProductStatsFacet; recent: RecentProductStat[] }> {
    const facetPipeline = [
      {
        $facet: {
          total: [{ $count: 'count' }],
          stockQty: [{ $group: { _id: null, sum: { $sum: '$stockQty' } } }],
          outOfStock: [{ $match: { stockQty: 0 } }, { $count: 'count' }],
          lowStock: [
            { $match: { stockQty: { $gt: 0, $lt: LOW_STOCK_THRESHOLD } } },
            { $count: 'count' },
          ],
          bestsellers: [{ $match: { isBestseller: true } }, { $count: 'count' }],
          featured: [{ $match: { isFeatured: true } }, { $count: 'count' }],
          active: [{ $match: { isActive: true } }, { $count: 'count' }],
          rating: [{ $group: { _id: null, avg: { $avg: '$rating' } } }],
          price: [
            {
              $group: {
                _id: null,
                min: { $min: '$priceCents' },
                max: { $max: '$priceCents' },
                avg: { $avg: '$priceCents' },
              },
            },
          ],
          discount: [
            {
              $project: {
                d: {
                  $cond: [
                    {
                      $and: [
                        { $gt: ['$originalPriceCents', '$priceCents'] },
                        { $gt: ['$originalPriceCents', 0] },
                      ],
                    },
                    {
                      $multiply: [
                        { $subtract: [1, { $divide: ['$priceCents', '$originalPriceCents'] }] },
                        100,
                      ],
                    },
                    0,
                  ],
                },
              },
            },
            { $group: { _id: null, avg: { $avg: '$d' } } },
          ],
          byCategory: [{ $group: { _id: '$category', count: { $sum: 1 } } }],
        },
      },
    ];

    const [facets, recentDocs] = await Promise.all([
      ProductModel.aggregate<ProductStatsFacet>(facetPipeline),
      ProductModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('sku title priceCents images stockQty createdAt')
        .lean(),
    ]);

    return {
      facet: facets[0] ?? {
        total: [],
        stockQty: [],
        outOfStock: [],
        lowStock: [],
        bestsellers: [],
        featured: [],
        active: [],
        rating: [],
        price: [],
        discount: [],
        byCategory: [],
      },
      recent: (recentDocs as unknown as Array<{
        _id: Types.ObjectId;
        sku: string;
        title: string;
        priceCents: number;
        images: string[];
        stockQty: number;
        createdAt: Date;
      }>).map((doc) => ({
        id: doc._id.toString(),
        sku: doc.sku,
        title: doc.title,
        priceCents: doc.priceCents,
        images: doc.images,
        stockQty: doc.stockQty,
        createdAt: doc.createdAt,
      })),
    };
  }
}
