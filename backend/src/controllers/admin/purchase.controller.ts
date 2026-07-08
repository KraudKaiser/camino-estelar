import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export async function getPurchases(_req: Request, res: Response) {
  const purchases = await prisma.purchase.findMany({
    include: { service: true, coupon: true },
    orderBy: { createdAt: "desc" },
  });

  res.json({ purchases });
}

export async function updatePurchase(req: Request, res: Response) {
  const id = String(req.params.id);
  const { paymentStatus, adminNotes } = req.body;

  const purchase = await prisma.purchase.update({
    where: { id },
    data: { paymentStatus, adminNotes },
    include: { service: true },
  });

  res.json({ purchase });
}
