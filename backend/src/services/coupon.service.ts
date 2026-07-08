import { prisma } from "../utils/prisma";

export interface CouponValidationResult {
  valid: boolean;
  error?: string;
  discount?: number;
  discountType?: string;
  couponId?: string;
}

export async function validateCouponForService(
  code: string,
  serviceId: string
): Promise<CouponValidationResult> {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon || !coupon.isActive) {
    return { valid: false, error: "Invalid coupon" };
  }

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) {
    return { valid: false, error: "Coupon expired" };
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, error: "Coupon usage limit reached" };
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    return { valid: false, error: "Service not found" };
  }

  if (
    coupon.minPurchase &&
    Number(service.price) < Number(coupon.minPurchase)
  ) {
    return { valid: false, error: "Minimum purchase not met" };
  }

  let discount: number;
  if (coupon.discountType === "PERCENTAGE") {
    discount = (Number(service.price) * Number(coupon.discountValue)) / 100;
  } else {
    discount = Number(coupon.discountValue);
  }

  return {
    valid: true,
    discount,
    discountType: coupon.discountType,
    couponId: coupon.id,
  };
}
