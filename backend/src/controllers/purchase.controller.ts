import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { ValidationError, NotFoundError } from "../utils/errors";
import {
  sendEmail,
  purchaseConfirmationEmail,
  adminNotificationEmail,
} from "../services/email.service";
import { validateCouponForService } from "../services/coupon.service";
import { logger } from "../utils/logger";

export async function createPurchase(req: Request, res: Response) {
  const {
    serviceId,
    customerName,
    customerEmail,
    customerPhone,
    couponCode,
    paymentMethod,
  } = req.body;

  if (!serviceId || !customerName || !customerEmail || !paymentMethod) {
    throw new ValidationError("Missing required fields");
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service || !service.isActive) {
    throw new NotFoundError("Service");
  }

  let discountAmount = 0;
  let couponId: string | undefined;

  if (couponCode) {
    const result = await validateCouponForService(couponCode, serviceId);
    if (result.valid) {
      discountAmount = result.discount!;
      couponId = result.couponId;
    }
  }

  const originalPrice = Number(service.price);
  const finalPrice = originalPrice - discountAmount;

  const purchase = await prisma.purchase.create({
    data: {
      serviceId,
      couponId,
      customerName,
      customerEmail,
      customerPhone,
      originalPrice,
      discountAmount,
      finalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === "WHATSAPP_ONLY" ? "COMPLETED" : "PENDING",
    },
    include: { service: true },
  });

  if (couponId) {
    await prisma.coupon.update({
      where: { id: couponId },
      data: { usedCount: { increment: 1 } },
    });
  }

  const emailData = {
    customerName,
    serviceName: service.name,
    finalPrice,
    paymentMethod,
    purchaseId: purchase.id,
  };

  await sendEmail({
    ...purchaseConfirmationEmail(emailData),
    to: customerEmail,
  });

  await sendEmail(
    adminNotificationEmail({
      customerName,
      customerEmail,
      serviceName: service.name,
      finalPrice,
      paymentMethod,
    })
  );

  let paymentUrl: string | undefined;
  if (paymentMethod === "MERCADOPAGO") {
    // TODO: Integrate with MercadoPago SDK
    paymentUrl = `https://www.mercadopago.com/checkout/v1/redirect?pref_id=${purchase.id}`;
  }

  logger.info("Purchase created", {
    purchaseId: purchase.id,
    service: service.name,
    amount: Number(finalPrice),
    paymentMethod,
    customerEmail,
  });

  res.status(201).json({ purchase, paymentUrl });
}

export async function getPurchase(req: Request, res: Response) {
  const id = String(req.params.id);

  const purchase = await prisma.purchase.findUnique({
    where: { id },
    include: { service: true, coupon: true },
  });

  if (!purchase) {
    throw new NotFoundError("Purchase");
  }

  res.json({ purchase });
}
