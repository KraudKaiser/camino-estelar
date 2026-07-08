import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

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
