import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

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

export async function getPublicConfig(_req: Request, res: Response) {
  const configs = await prisma.siteConfig.findMany({
    where: { key: { in: ["whatsapp_number", "whatsapp_enabled"] } },
  });
  const config = configs.reduce(
    (acc, { key, value }) => ({ ...acc, [key]: value }),
    {} as Record<string, string>
  );
  res.json(config);
}
