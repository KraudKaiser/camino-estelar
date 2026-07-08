import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: adminPassword,
      name: "Administrador",
    },
  });

  // Create sample services
  const services = [
    {
      name: "Radiografia Basica",
      description:
        "Estudio radiografico convencional para diagnosticar fracturas, lesiones o patologias óseas. Incluye asesoramiento personalizado y entrega de resultados en formato digital.",
      shortDesc: "Estudio radiografico convencional",
      price: 2500,
      originalPrice: 3500,
      duration: 30,
      sortOrder: 1,
      features: [
        "Resultado digital en el dia",
        "Asesoramiento personalizado",
        "Equipamiento de ultima generacion",
      ],
    },
    {
      name: "Radiografia Premium",
      description:
        "Estudio radiografico de alta resolucion con tecnologia digital avanzada. Incluye informe detallado, asesoramiento y segunda opinion profesional.",
      shortDesc: "Alta resolucion con informe detallado",
      price: 4000,
      duration: 45,
      sortOrder: 2,
      features: [
        "Alta resolucion digital",
        "Informe detallado incluido",
        "Segunda opinion profesional",
        "Prioridad en resultados",
      ],
    },
    {
      name: "Consulta General",
      description:
        "Consulta medica general con evaluacion completa. Ideal para pacientes que requieren orientacion sobre su estado de salud o derivacion a estudios complementarios.",
      shortDesc: "Evaluacion medica completa",
      price: 3000,
      originalPrice: 3800,
      duration: 60,
      sortOrder: 3,
      features: [
        "Evaluacion completa",
        "Orientacion personalizada",
        "Derivacion si es necesario",
      ],
    },
  ];

  for (const service of services) {
    const { features, ...serviceData } = service;
    const created = await prisma.service.upsert({
      where: { id: service.name.toLowerCase().replace(/\s/g, "-") },
      update: {},
      create: {
        ...serviceData,
        id: service.name.toLowerCase().replace(/\s/g, "-"),
      },
    });

    // Create features
    for (const feature of features) {
      await prisma.serviceFeature.create({
        data: {
          serviceId: created.id,
          text: feature,
          order: features.indexOf(feature),
        },
      });
    }
  }

  // Create sample coupons
  await prisma.coupon.upsert({
    where: { code: "BIENVENIDO10" },
    update: {},
    create: {
      code: "BIENVENIDO10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      maxUses: 100,
    },
  });

  // Create site config
  const configs = [
    { key: "site_name", value: "Camino Estelar" },
    { key: "whatsapp_number", value: "5491112345678" },
    { key: "whatsapp_enabled", value: "true" },
    { key: "bank_transfer_enabled", value: "true" },
    { key: "bank_name", value: "Banco Nacion" },
    { key: "account_holder", value: "Camino Estelar S.R.L." },
    { key: "account_number", value: "12345678901234" },
    { key: "cbu", value: "0110123432101234567890" },
    { key: "alias", value: "CAMINOESTELAR" },
  ];

  for (const config of configs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
