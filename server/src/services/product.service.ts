import { ProductRepository, type ProductFilter, type ProductSort } from '../repositories/product.repository.js';
import { CategoryModel } from '../models/category.model.js';
import type { Product } from '../models/product.model.js';
import { AppError } from '../errors/app-error.js';

export interface ProductListInput {
  categoryKey?: string;
  q?: string;
  sort?: ProductSort;
  bestseller?: boolean;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface ProductDto {
  id: string;
  sku: string;
  title: string;
  titleBn: string;
  price: number;
  originalPrice: number;
  discountPct: number;
  category: string;
  categoryId: string;
  categoryBn: string;
  rating: number;
  reviewCount: number;
  image: string;
  isBestseller: boolean;
  isFeatured: boolean;
  inStock: boolean;
  specs: Record<string, string>;
  description: string;
  descriptionBn: string;
}

export interface ProductListResponse {
  items: ProductDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductStatsDto {
  totals: {
    products: number;
    stockQty: number;
    outOfStock: number;
    lowStock: number;
    bestsellers: number;
    featured: number;
    active: number;
    avgRating: number;
    avgDiscountPct: number;
  };
  price: { min: number; avg: number; max: number };
  byCategory: Array<{ key: string; name: string; nameBn: string; count: number }>;
  recent: Array<{
    id: string;
    sku: string;
    title: string;
    price: number;
    image: string;
    stockQty: number;
    createdAt: Date;
  }>;
}

export interface ProductCreateInput {
  sku: string;
  title: string;
  titleBn: string;
  categoryKey: string;
  priceCents: number;
  originalPriceCents?: number;
  currency?: string;
  stockQty?: number;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  isBestseller?: boolean;
  isFeatured?: boolean;
  specs?: Record<string, string>;
  description?: string;
  descriptionBn?: string;
}

export type ProductUpdateInput = Partial<ProductCreateInput>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
}

function toDto(product: Product): ProductDto {
  const discountPct =
    product.originalPriceCents && product.originalPriceCents > product.priceCents
      ? Math.round((1 - product.priceCents / product.originalPriceCents) * 100)
      : 0;

  return {
    id: product.id,
    sku: product.sku,
    title: product.title,
    titleBn: product.titleBn,
    price: product.priceCents / 100,
    originalPrice: product.originalPriceCents ? product.originalPriceCents / 100 : product.priceCents / 100,
    discountPct,
    category: product.categoryRef?.name ?? product.category,
    categoryId: product.categoryRef?.key ?? '',
    categoryBn: product.categoryRef?.nameBn ?? '',
    rating: product.rating,
    reviewCount: product.reviewCount,
    image: product.images[0] ?? '',
    isBestseller: product.isBestseller,
    isFeatured: product.isFeatured,
    inStock: product.stockQty > 0,
    specs: product.specs,
    description: product.description,
    descriptionBn: product.descriptionBn,
  };
}

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async list(input: ProductListInput): Promise<ProductListResponse> {
    const page = input.page && input.page > 0 ? Math.floor(input.page) : 1;
    const limit = input.limit && input.limit > 0 ? Math.min(Math.floor(input.limit), 50) : 12;

    const filter: ProductFilter = {
      categoryKey: input.categoryKey,
      q: input.q,
      sort: input.sort,
      bestseller: input.bestseller,
      featured: input.featured,
      page,
      limit,
    };

    const { items, total } = await this.repository.list(filter);

    return {
      items: items.map(toDto),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getBySlugOrId(slugOrId: string): Promise<ProductDto> {
    const product = await this.repository.findBySlugOrId(slugOrId);
    if (!product) throw new AppError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
    return toDto(product);
  }

  async create(input: ProductCreateInput): Promise<ProductDto> {
    const category = await CategoryModel.findOne({ key: input.categoryKey });
    if (!category) {
      throw new AppError(400, `Unknown category: ${input.categoryKey}`, 'CATEGORY_NOT_FOUND');
    }

    const slug = await this.uniqueSlug(slugify(input.title));
    if (await this.repository.findBySku(input.sku)) {
      throw new AppError(409, `SKU already exists: ${input.sku}`, 'SKU_CONFLICT');
    }

    const product = await this.repository.create({
      sku: input.sku,
      slug,
      title: input.title,
      titleBn: input.titleBn,
      category: category._id.toString(),
      priceCents: input.priceCents,
      originalPriceCents: input.originalPriceCents ?? null,
      currency: input.currency ?? 'BDT',
      stockQty: input.stockQty ?? 0,
      rating: input.rating ?? 0,
      reviewCount: input.reviewCount ?? 0,
      images: input.images ?? [],
      isBestseller: input.isBestseller ?? false,
      isFeatured: input.isFeatured ?? false,
      specs: input.specs ?? {},
      description: input.description ?? '',
      descriptionBn: input.descriptionBn ?? '',
    });

    return toDto(product);
  }

  async update(id: string, input: ProductUpdateInput): Promise<ProductDto> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError(404, 'Product not found', 'PRODUCT_NOT_FOUND');

    if (input.sku && input.sku !== existing.sku && (await this.repository.findBySku(input.sku))) {
      throw new AppError(409, `SKU already exists: ${input.sku}`, 'SKU_CONFLICT');
    }
    if (input.title && (await this.repository.slugExists(slugify(input.title), id))) {
      throw new AppError(409, 'A product with this slug already exists', 'SLUG_CONFLICT');
    }

    let category: string | undefined;
    if (input.categoryKey) {
      const doc = await CategoryModel.findOne({ key: input.categoryKey });
      if (!doc) throw new AppError(400, `Unknown category: ${input.categoryKey}`, 'CATEGORY_NOT_FOUND');
      category = doc._id.toString();
    }

    const updated = await this.repository.update(id, {
      ...input,
      slug: input.title ? slugify(input.title) : undefined,
      category,
    });
    if (!updated) throw new AppError(404, 'Product not found', 'PRODUCT_NOT_FOUND');

    return toDto(updated);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new AppError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
  }

  async getStats(): Promise<ProductStatsDto> {
    const { facet, recent } = await this.repository.getStats();

    const categoryIds = facet.byCategory.map((c) => c._id);
    const categories = await CategoryModel.find({ _id: { $in: categoryIds } }).lean();
    const catById = new Map(categories.map((c) => [c._id.toString(), c]));

    const byCategory = facet.byCategory
      .map((c) => {
        const cat = catById.get(c._id.toString());
        return {
          key: cat?.key ?? 'unknown',
          name: cat?.name ?? 'Unknown',
          nameBn: cat?.nameBn ?? '',
          count: c.count,
        };
      })
      .sort((a, b) => b.count - a.count);

    return {
      totals: {
        products: facet.total[0]?.count ?? 0,
        stockQty: facet.stockQty[0]?.sum ?? 0,
        outOfStock: facet.outOfStock[0]?.count ?? 0,
        lowStock: facet.lowStock[0]?.count ?? 0,
        bestsellers: facet.bestsellers[0]?.count ?? 0,
        featured: facet.featured[0]?.count ?? 0,
        active: facet.active[0]?.count ?? 0,
        avgRating: Math.round((facet.rating[0]?.avg ?? 0) * 10) / 10,
        avgDiscountPct: Math.round((facet.discount[0]?.avg ?? 0) * 10) / 10,
      },
      price: {
        min: (facet.price[0]?.min ?? 0) / 100,
        avg: Math.round((facet.price[0]?.avg ?? 0)) / 100,
        max: (facet.price[0]?.max ?? 0) / 100,
      },
      byCategory,
      recent: recent.map((p) => ({
        id: p.id,
        sku: p.sku,
        title: p.title,
        price: p.priceCents / 100,
        image: p.images[0] ?? '',
        stockQty: p.stockQty,
        createdAt: p.createdAt,
      })),
    };
  }

  private async uniqueSlug(base: string): Promise<string> {
    if (!(await this.repository.slugExists(base))) return base;
    for (let i = 2; i < 1000; i++) {
      const candidate = `${base}-${i}`;
      if (!(await this.repository.slugExists(candidate))) return candidate;
    }
    throw new AppError(409, 'Could not generate a unique slug', 'SLUG_CONFLICT');
  }
}
