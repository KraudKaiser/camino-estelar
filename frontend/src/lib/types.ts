export interface Service {
  id: string;
  name: string;
  description: string;
  shortDesc: string | null;
  price: number;
  originalPrice: number | null;
  duration: number;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  features?: ServiceFeature[];
}

export interface ServiceFeature {
  id: string;
  text: string;
  order: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minPurchase: number | null;
  maxUses: number | null;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface Purchase {
  id: string;
  serviceId: string;
  couponId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  paymentMethod: "MERCADOPAGO" | "BANK_TRANSFER" | "WHATSAPP_ONLY";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  externalPaymentId: string | null;
  bankTransferProof: string | null;
  adminNotes: string | null;
  createdAt: string;
  service?: Service;
  coupon?: Coupon;
}

export interface SiteConfig {
  [key: string]: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  code?: string;
}
