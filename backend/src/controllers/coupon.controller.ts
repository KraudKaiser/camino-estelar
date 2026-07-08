import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { ValidationError, NotFoundError } from "../utils/errors";

export async function validateCoupon(req: Request, res: Response) {
  const { code, serviceId } = req.body;

  if (!code || !serviceId) {
    throw new ValidationError("Code and serviceId are required");
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon || !coupon.isActive) {
    return res.json({ valid: false, error: "Invalid coupon" });
  }

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) {
    return res.json({ valid: false, error: "Coupon expired" });
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return res.json({ valid: false, error: "Coupon usage limit reached" });
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw new NotFoundError("Service");
  }

  if (
    coupon.minPurchase &&
    Number(service.price) < Number(coupon.minPurchase)
  ) {
    return res.json({
      valid: false,
      error: "Minimum purchase not met",
    });
  }

  let discount: number;
  if (coupon.discountType === "PERCENTAGE") {
    discount = (Number(service.price) * Number(coupon.discountValue)) / 100;
  } else {
    discount = Number(coupon.discountValue);
  }

  res.json({
    valid: true,
    discount,
    discountType: coupon.discountType,
    code: coupon.code,
  });
}
