import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { NotFoundError } from "../utils/errors";

export async function getServices(_req: Request, res: Response) {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    include: { features: { orderBy: { order: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  res.json({ services });
}

export async function getService(req: Request, res: Response) {
  const id = String(req.params.id);

  const service = await prisma.service.findUnique({
    where: { id },
    include: { features: { orderBy: { order: "asc" } } },
  });

  if (!service) {
    throw new NotFoundError("Service");
  }

  res.json({ service });
}
