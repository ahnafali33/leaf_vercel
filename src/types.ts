/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  approved: boolean;
  date: string;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug?: string;
  seo?: any;
}

export interface Product {
  id: string;
  name: string;
  scientificName: string;
  price: number;
  originalPrice: number;
  description: string;
  careGuide: string;
  difficulty: "Low Tech" | "Mid Tech" | "High Tech";
  light: "Low" | "Medium" | "High";
  co2: "None" | "Low" | "High";
  category: string;
  images: string[];
  stock: number;
  growthRate: "Slow" | "Medium" | "Fast";
  placement: "Foreground" | "Midground" | "Background";
  temperature: string;
  tankCompatibility: string;
  reviews: Review[];
  slug?: string;
  seo?: any;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  area: string;
  note?: string;
  items: OrderItem[];
  total: number;
  shippingCharge: number;
  status: "Pending" | "Payment Verification Pending" | "Payment Verified" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  paymentMethod?: string;
  paymentNumberUsed?: string;
  paymentTransactionId?: string;
  paymentAmount?: number;
  paymentScreenshot?: string;
  steadfastConsignmentId?: number | string;
  steadfastTrackingCode?: string;
  steadfastStatus?: string;
  steadfastError?: string;
  courierSentAt?: string;
}

export interface CourierSettings {
  apiKey?: string;
  secretKey?: string;
  baseUrl?: string;
  autoSendOnConfirm?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  image: string;
  date: string;
  faq?: FAQItem[];
  seoTitle?: string;
  seoDescription?: string;
  slug?: string;
  seo?: any;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  expiryDate: string;
}

export interface HeroBanner {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  text: string;
}

export interface PromoBanner {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  text: string;
}

export interface OfferBanner {
  text: string;
  link: string;
}

export interface WhatsAppSettings {
  phoneNumber: string;
  link: string;
  enabled: boolean;
  defaultMessage: string;
}

export interface BannerSettings {
  hero: HeroBanner;
  promo: PromoBanner;
  offer: OfferBanner;
  whatsapp?: WhatsAppSettings;
}

export interface LegalSettings {
  privacy: string;
  terms: string;
  refund: string;
  shipping: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PaymentSettings {
  bKashEnabled: boolean;
  bKashNumber: string;
  bKashAccountType: string;
  bKashInstruction: string;
  bKashLogo: string;
  nagadEnabled: boolean;
  nagadNumber: string;
  nagadAccountType: string;
  nagadInstruction: string;
  nagadLogo: string;
  accountHolderName: string;
  codEnabled: boolean;
  codAdvanceAmount: number;
  codInstruction: string;
  whatsappNumber: string;
  whatsappLink: string;
  whatsappDefaultMessage: string;
  shippingChargeDhaka?: number;
  shippingChargeOutside?: number;
}
