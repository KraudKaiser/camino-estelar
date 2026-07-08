import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export async function getCoupons(_req: Request, res: Response) {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json({ coupons });
}

export async function createCoupon(req: Request, res: Response) {
  const { code, discountType, discountValue, minPurchase, maxUses, validFrom, validUntil } =
    req.body;

  const coupon = await prisma.coupon.create({
    data: {
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minPurchase,
      maxUses,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
    },
  });

  res.status(201).json({ coupon });
}

export async function updateCoupon(req: Request, res: Response) {
  const id = String(req.params.id);
  const { code, discountType, discountValue, minPurchase, maxUses, validFrom, validUntil, isActive } =
    req.body;

  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      code: code?.toUpperCase(),
      discountType,
      discountValue,
      minPurchase,
      maxUses,
      validFrom: validFrom ? new Date(validFrom) : undefined,
      validUntil: validUntil ? new Date(validUntil) : undefined,
      isActive,
    },
  });

  res.json({ coupon });
}

export async function deleteCoupon(req: Request, res: Response) {
  const id = String(req.params.id);
  await prisma.coupon.delete({ where: { id } });
  res.status(204).send();
}
