import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";
import { ValidationError, UnauthorizedError } from "../utils/errors";
import { AuthRequest } from "../middleware/auth.middleware";
import { logger } from "../utils/logger";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    logger.warn("Login failed: unknown email", { email });
    throw new UnauthorizedError("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    logger.warn("Login failed: wrong password", { email });
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  logger.info("Login success", { email, adminId: admin.id });

  res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ message: "Logged out" });
}

export async function getMe(req: AuthRequest, res: Response) {
  const admin = await prisma.admin.findUnique({
    where: { id: req.adminId },
    select: { id: true, email: true, name: true },
  });

  res.json({ admin });
}

// Service management
export async function getServices(_req: Request, res: Response) {
  const services = await prisma.service.findMany({
    include: { features: { orderBy: { order: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  res.json({ services });
}

export async function createService(req: Request, res: Response) {
  const { name, description, shortDesc, price, originalPrice, duration, imageUrl, isActive, sortOrder, features } =
    req.body;

  const service = await prisma.service.create({
    data: {
      name,
      description,
      shortDesc,
      price,
      originalPrice,
      duration,
      imageUrl,
      isActive,
      sortOrder,
      features: features
        ? {
            create: features.map((text: string, index: number) => ({
              text,
              order: index,
            })),
          }
        : undefined,
    },
    include: { features: true },
  });

  res.status(201).json({ service });
}

export async function updateService(req: Request, res: Response) {
  const id = String(req.params.id);
  const { name, description, shortDesc, price, originalPrice, duration, imageUrl, isActive, sortOrder, features } =
    req.body;

  // Update features if provided
  if (features !== undefined) {
    await prisma.serviceFeature.deleteMany({ where: { serviceId: id } });
    await prisma.serviceFeature.createMany({
      data: features.map((text: string, index: number) => ({
        serviceId: id,
        text,
        order: index,
      })),
    });
  }

  const service = await prisma.service.update({
    where: { id },
    data: {
      name,
      description,
      shortDesc,
      price,
      originalPrice,
      duration,
      imageUrl,
      isActive,
      sortOrder,
    },
    include: { features: { orderBy: { order: "asc" } } },
  });

  res.json({ service });
}

export async function deleteService(req: Request, res: Response) {
  const id = String(req.params.id);
  await prisma.service.delete({ where: { id } });
  res.status(204).send();
}

// Coupon management
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

// Purchase management
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

// Config management
export async function getConfig(_req: Request, res: Response) {
  const configs = await prisma.siteConfig.findMany();
  const configMap = configs.reduce(
    (acc, { key, value }) => ({ ...acc, [key]: value }),
    {} as Record<string, string>
  );

  res.json({ config: configMap });
}

export async function updateConfig(req: Request, res: Response) {
  const { config } = req.body;

  for (const [key, value] of Object.entries(config)) {
    await prisma.siteConfig.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }

  res.json({ message: "Config updated" });
}
