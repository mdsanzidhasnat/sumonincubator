import { Product } from '../types';

export const API_BASE = ((import.meta.env.VITE_API_BASE as string | undefined) ?? '').replace(/\/+$/, '');

export interface ApiProductDto {
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
  images: string[];
  stockQty: number;
  currency: string;
  isBestseller: boolean;
  isFeatured: boolean;
  inStock: boolean;
  specs: Record<string, string>;
  description: string;
  descriptionBn: string;
}

export interface ProductListResponse {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductQuery {
  category?: string;
  q?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  bestseller?: boolean;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface CategoryDto {
  id: string;
  key: string;
  name: string;
  nameBn: string;
  iconName: string;
  itemCount: number;
  description: string;
  descriptionBn: string;
}

function normalizeProduct(dto: ApiProductDto): Product {
  return {
    id: dto.id,
    sku: dto.sku,
    title: dto.title,
    titleBn: dto.titleBn,
    price: dto.price,
    originalPrice: dto.originalPrice,
    discountPct: dto.discountPct,
    category: dto.category,
    categoryId: dto.categoryId as Product['categoryId'],
    categoryBn: dto.categoryBn,
    rating: dto.rating,
    reviewCount: dto.reviewCount,
    image: dto.image,
    isBestseller: dto.isBestseller,
    isFeatured: dto.isFeatured,
    inStock: dto.inStock,
    specs: { ...dto.specs },
    description: dto.description,
    descriptionBn: dto.descriptionBn,
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}/api/v1${path}`, {
    headers: { Accept: 'application/json' },
    ...init,
  });
  if (!response.ok) {
    throw new Error(`API request failed (${response.status} ${response.statusText})`);
  }
  return response.json() as Promise<T>;
}

export async function getProducts(query: ProductQuery = {}): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  if (query.category) params.set('category', query.category);
  if (query.q) params.set('q', query.q);
  if (query.sort) params.set('sort', query.sort);
  if (query.bestseller !== undefined) params.set('bestseller', String(query.bestseller));
  if (query.featured !== undefined) params.set('featured', String(query.featured));
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  const queryString = params.toString();

  const response = await request<{ items: ApiProductDto[]; page: number; limit: number; total: number; totalPages: number }>(
    `/products${queryString ? `?${queryString}` : ''}`,
  );

  return {
    items: response.items.map(normalizeProduct),
    page: response.page,
    limit: response.limit,
    total: response.total,
    totalPages: response.totalPages,
  };
}

export async function getProduct(slugOrId: string): Promise<Product> {
  const dto = await request<ApiProductDto>(`/products/${encodeURIComponent(slugOrId)}`);
  return normalizeProduct(dto);
}

export async function getCategories(): Promise<CategoryDto[]> {
  return request<CategoryDto[]>('/categories');
}
