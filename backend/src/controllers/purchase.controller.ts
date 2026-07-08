import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { ValidationError, NotFoundError } from "../utils/errors";
import {
  sendEmail,
  purchaseConfirmationEmail,
  adminNotificationEmail,
} from "../services/email.service";
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
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.toUpperCase() },
    });

    if (coupon && coupon.isActive) {
      const now = new Date();
      if (now >= coupon.validFrom && now <= coupon.validUntil) {
        if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
          if (
            !coupon.minPurchase ||
            Number(service.price) >= Number(coupon.minPurchase)
          ) {
            if (coupon.discountType === "PERCENTAGE") {
              discountAmount =
                (Number(service.price) * Number(coupon.discountValue)) / 100;
            } else {
              discountAmount = Number(coupon.discountValue);
            }
            couponId = coupon.id;
          }
        }
      }
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

  // Send emails
  const emailData = {
    customerName,
    serviceName: service.name,
    finalPrice,
    paymentMethod,
    purchaseId: purchase.id,
  };

  // Send confirmation to customer
  await sendEmail({
    ...purchaseConfirmationEmail(emailData),
    to: customerEmail,
  });

  // Notify admin
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

export async function uploadProof(req: Request, res: Response) {
  const id = String(req.params.id);

  const purchase = await prisma.purchase.findUnique({
    where: { id },
  });

  if (!purchase) {
    throw new NotFoundError("Purchase");
  }

  if (purchase.paymentMethod !== "BANK_TRANSFER") {
    throw new ValidationError("This purchase does not accept bank transfer");
  }

  // In MVP, we'll just store a placeholder URL
  // In production, handle file upload with multer
  const proofUrl = req.body.proofUrl || "proof-uploaded";

  const updated = await prisma.purchase.update({
    where: { id },
    data: { bankTransferProof: proofUrl },
  });

  res.json({ purchase: updated });
}
