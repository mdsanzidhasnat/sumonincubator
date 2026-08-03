import type {
  CreateResult,
  DataProvider,
  DeleteManyResult,
  DeleteResult,
  GetListResult,
  GetManyResult,
  GetOneResult,
  UpdateManyResult,
  UpdateResult,
} from 'react-admin';

const apiBase = '';

interface ApiErrorBody {
  error?: { code?: string; message?: string };
  message?: string;
}

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBase}${url}`, {
    ...options,
    credentials: 'same-origin',
    headers:
      options.body instanceof FormData
        ? options.headers
        : { 'Content-Type': 'application/json', ...options.headers },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const json = (await response.json().catch(() => ({}))) as T & ApiErrorBody;
  if (!response.ok) {
    const message =
      json?.error?.message ?? json?.message ?? `Request failed with status ${response.status}`;
    const error = new Error(message) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  return json;
}

interface ProductDto {
  id: string;
  sku: string;
  slug?: string;
  title: string;
  titleBn: string;
  price: number;
  originalPrice: number;
  discountPct: number;
  priceCents: number;
  originalPriceCents: number;
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
  createdAt: string;
  updatedAt: string;
}

interface ProductListResponse {
  items: ProductDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface CategoryDto {
  id: string;
  key: string;
  name: string;
  nameBn: string;
  iconName: string;
  itemCount: number;
}

interface OrderDto {
  id: string;
  orderId: string;
  status: string;
  paymentMethod: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    district: string;
    thana: string;
    address: string;
  };
  items: Array<{
    productId: string;
    title: string;
    titleBn: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  courier: {
    status: string;
    consignmentId: string;
    trackingCode: string;
    trackingLink: string;
    invoice: string;
    error: string;
    attemptedAt: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

interface OrderListResponse {
  items: OrderDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Adds form-facing fields the REST DTO doesn't carry (priceCents, categoryKey). */
function toFormRecord(product: ProductDto): ProductDto {
  return { ...product, categoryKey: product.categoryId } as ProductDto;
}

function toSortParam(sort: { field: string; order: string } | undefined): string | undefined {
  if (!sort) return undefined;
  if (sort.field === 'price') return sort.order === 'ASC' ? 'price_asc' : 'price_desc';
  if (sort.field === 'rating') return 'rating';
  if (sort.field === 'createdAt' || sort.field === 'updatedAt' || sort.field === 'id') {
    return 'newest';
  }
  return undefined;
}

export const dataProvider: DataProvider = {
  async getList(resource, params): Promise<GetListResult> {
    if (resource === 'categories') {
      const categories = await fetchJson<CategoryDto[]>('/api/v1/categories');
      return { data: categories as never, total: categories.length };
    }

    if (resource === 'orders') {
      const { page, perPage } = params.pagination ?? { page: 1, perPage: 25 };
      const query = new URLSearchParams({
        page: String(page),
        limit: String(perPage),
      });
      const filter = (params.filter ?? {}) as Record<string, unknown>;
      if (filter.q) query.set('q', String(filter.q));
      if (filter.status) query.set('status', String(filter.status));
      const result = await fetchJson<OrderListResponse>(`/api/v1/orders?${query.toString()}`);
      return { data: result.items as never, total: result.total };
    }

    const { page, perPage } = params.pagination ?? { page: 1, perPage: 25 };
    const query = new URLSearchParams({
      page: String(page),
      limit: String(perPage),
    });

    const filter = (params.filter ?? {}) as Record<string, unknown>;
    if (filter.q) query.set('q', String(filter.q));
    if (filter.category) query.set('category', String(filter.category));
    if (filter.bestseller === true || filter.bestseller === 'true') query.set('bestseller', 'true');
    if (filter.bestseller === false || filter.bestseller === 'false') {
      query.set('bestseller', 'false');
    }
    if (filter.featured === true || filter.featured === 'true') query.set('featured', 'true');
    if (filter.featured === false || filter.featured === 'false') query.set('featured', 'false');

    const sort = toSortParam(params.sort);
    if (sort) query.set('sort', sort);

    const result = await fetchJson<ProductListResponse>(`/api/v1/products?${query.toString()}`);
    return { data: result.items as never, total: result.total };
  },

  async getOne(resource, params): Promise<GetOneResult> {
    if (resource === 'categories') {
      const categories = await fetchJson<CategoryDto[]>('/api/v1/categories');
      const category = categories.find((c) => c.key === params.id || c.id === params.id);
      return { data: category as never };
    }
    if (resource === 'settings') {
      const endpoint = params.id === 'hero' ? '/api/v1/settings/hero' : '/api/v1/settings/contact';
      const settings = await fetchJson<Record<string, unknown>>(endpoint);
      return { data: settings as never };
    }
    if (resource === 'orders') {
      const order = await fetchJson<OrderDto>(`/api/v1/orders/${params.id}`);
      return { data: order as never };
    }
    const product = await fetchJson<ProductDto>(`/api/v1/products/${params.id}`);
    return { data: toFormRecord(product) as never };
  },

  async getMany(resource, params): Promise<GetManyResult> {
    const data = await Promise.all(
      params.ids.map((id) =>
        this.getOne(resource, { id } as never).then((result) => result.data),
      ),
    );
    return { data: data as never };
  },

  async getManyReference(resource, params): Promise<GetListResult> {
    return this.getList(resource, {
      pagination: params.pagination,
      sort: params.sort,
      filter: { ...(params.filter ?? {}), [params.target]: params.id },
    } as never) as Promise<GetListResult>;
  },

  async create(resource, params): Promise<CreateResult> {
    const product = await fetchJson<ProductDto>('/api/v1/products', {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
    return { data: toFormRecord(product) as never };
  },

  async update(resource, params): Promise<UpdateResult> {
    if (resource === 'settings') {
      const { id, ...data } = params.data as Record<string, unknown>;
      const endpoint = id === 'hero' ? '/api/v1/settings/hero' : '/api/v1/settings/contact';
      const settings = await fetchJson<Record<string, unknown>>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return { data: settings as never };
    }
    if (resource === 'orders') {
      const { status } = params.data as { status?: string };
      const order = await fetchJson<OrderDto>(`/api/v1/orders/${params.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return { data: order as never };
    }
    const { id, ...data } = params.data as Record<string, unknown>;
    const product = await fetchJson<ProductDto>(`/api/v1/products/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return { data: toFormRecord(product) as never };
  },

  async updateMany(resource, params): Promise<UpdateManyResult> {
    await Promise.all(
      params.ids.map((id) =>
        this.update(resource, { id, data: params.data } as never).catch(() => undefined),
      ),
    );
    return { data: params.ids };
  },

  async delete(resource, params): Promise<DeleteResult> {
    await fetchJson<void>(`/api/v1/products/${params.id}`, { method: 'DELETE' });
    return { data: { id: params.id } as never };
  },

  async deleteMany(resource, params): Promise<DeleteManyResult> {
    await Promise.all(
      params.ids.map((id) => this.delete(resource, { id } as never).catch(() => undefined)),
    );
    return { data: params.ids };
  },
};
