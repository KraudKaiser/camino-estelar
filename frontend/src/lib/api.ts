import { Service, Purchase, Coupon, SiteConfig } from "./types";

export const API_URL = typeof window === "undefined"
  ? (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000")
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000");

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return res.json();
}

// Public API
export async function getServices(): Promise<Service[]> {
  const res = await fetchApi<{ services: Service[] }>("/api/services");
  return res.services;
}

export async function getService(id: string): Promise<Service> {
  const res = await fetchApi<{ service: Service }>(`/api/services/${id}`);
  return res.service;
}

export async function validateCoupon(
  code: string,
  serviceId: string
): Promise<{ valid: boolean; discount?: number; discountType?: string }> {
  return fetchApi("/api/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, serviceId }),
  });
}

export async function createPurchase(data: {
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  couponCode?: string;
  paymentMethod: string;
}): Promise<{ purchase: Purchase; paymentUrl?: string }> {
  return fetchApi("/api/purchases", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getPurchase(id: string): Promise<Purchase> {
  const res = await fetchApi<{ purchase: Purchase }>(`/api/purchases/${id}`);
  return res.purchase;
}

export async function getWhatsAppConfig(): Promise<SiteConfig> {
  return fetchApi("/api/config/whatsapp");
}

// Admin API — Auth
export async function adminLogin(
  email: string,
  password: string
): Promise<{ token: string; admin: { id: string; email: string; name: string } }> {
  return fetchApi("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Admin API — Services
export async function getAdminServices(): Promise<Service[]> {
  const res = await fetchApi<{ services: Service[] }>("/api/admin/services");
  return res.services;
}

export async function createService(
  data: Omit<Service, "id" | "createdAt" | "updatedAt">
): Promise<Service> {
  const res = await fetchApi<{ service: Service }>("/api/admin/services", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.service;
}

export async function updateService(
  id: string,
  data: Partial<Service>
): Promise<Service> {
  const res = await fetchApi<{ service: Service }>(`/api/admin/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.service;
}

export async function deleteService(id: string): Promise<void> {
  await fetchApi(`/api/admin/services/${id}`, { method: "DELETE" });
}

// Admin API — Coupons
export async function getAdminCoupons(): Promise<Coupon[]> {
  const res = await fetchApi<{ coupons: Coupon[] }>("/api/admin/coupons");
  return res.coupons;
}

export async function createCoupon(
  data: Omit<Coupon, "id" | "createdAt" | "updatedAt" | "usedCount">
): Promise<Coupon> {
  const res = await fetchApi<{ coupon: Coupon }>("/api/admin/coupons", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.coupon;
}

export async function updateCoupon(
  id: string,
  data: Partial<Coupon>
): Promise<Coupon> {
  const res = await fetchApi<{ coupon: Coupon }>(`/api/admin/coupons/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.coupon;
}

export async function deleteCoupon(id: string): Promise<void> {
  await fetchApi(`/api/admin/coupons/${id}`, { method: "DELETE" });
}

// Admin API — Purchases
export async function getAdminPurchases(): Promise<Purchase[]> {
  const res = await fetchApi<{ purchases: Purchase[] }>("/api/admin/purchases");
  return res.purchases;
}

export async function updatePurchaseStatus(
  id: string,
  status: string,
  notes?: string
): Promise<Purchase> {
  const res = await fetchApi<{ purchase: Purchase }>(
    `/api/admin/purchases/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({ paymentStatus: status, adminNotes: notes }),
    }
  );
  return res.purchase;
}

// Admin API — Config
export async function getAdminConfig(): Promise<Record<string, string>> {
  const res = await fetchApi<{ config: Record<string, string> }>("/api/admin/config");
  return res.config;
}

export async function updateAdminConfig(
  config: Record<string, string>
): Promise<void> {
  await fetchApi("/api/admin/config", {
    method: "PUT",
    body: JSON.stringify({ config }),
  });
}
