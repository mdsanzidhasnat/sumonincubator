export type Language = 'bn' | 'en';

export interface ProductSpec {
  capacity?: string;
  power?: string;
  controller?: string;
  warranty?: string;
  dimension?: string;
  hatchRate?: string;
}

export interface Product {
  id: string;
  title: string;
  titleBn: string;
  price: number;
  originalPrice: number;
  discountPct: number;
  category: string;
  categoryId: 'incubators' | 'parts' | 'ips-ups' | 'battery' | 'agri-tools' | 'gadgets';
  categoryBn: string;
  rating: number;
  reviewCount: number;
  image: string;
  isBestseller?: boolean;
  isFeatured?: boolean;
  inStock: boolean;
  specs: ProductSpec;
  description: string;
  descriptionBn: string;
  sku: string;
}

export interface Category {
  id: 'incubators' | 'parts' | 'ips-ups' | 'battery' | 'agri-tools' | 'gadgets';
  name: string;
  nameBn: string;
  iconName: string;
  itemCount: number;
  description: string;
  descriptionBn: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BlogPost {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  categoryBn: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  excerpt: string;
  excerptBn: string;
  contentBn?: string[];
}

export interface TrustBadge {
  id: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  icon: string;
  colorBg: string;
  iconColor: string;
}

export interface VideoTutorial {
  id: string;
  title: string;
  titleBn: string;
  duration: string;
  views: string;
  thumbnail: string;
  youtubeId: string;
}

export type PaymentMethodId = 'cod' | 'bkash' | 'nagad';

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  districtId: string | null;
  thanaId: string | null;
  address: string;
  paymentMethod: PaymentMethodId;
  location: { lat: number; lng: number } | null;
}

export interface OrderInfo {
  orderId: string;
  total: number;
  subtotal: number;
  deliveryCharge: number;
  paymentMethod: PaymentMethodId;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    district: string;
    thana: string;
    address: string;
    location: { lat: number; lng: number } | null;
  };
  items: CartItem[];
  placedAt: string;
}
