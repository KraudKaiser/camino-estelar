import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/error.middleware";
import serviceRoutes from "./routes/service.routes";
import purchaseRoutes from "./routes/purchase.routes";
import couponRoutes from "./routes/coupon.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/services", serviceRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/admin", adminRoutes);

// Config endpoint
app.get("/api/config/whatsapp", async (_req, res) => {
  const { prisma } = await import("./utils/prisma");
  const configs = await prisma.siteConfig.findMany({
    where: { key: { in: ["whatsapp_number", "whatsapp_enabled"] } },
  });
  const config = configs.reduce(
    (acc, { key, value }) => ({ ...acc, [key]: value }),
    {} as Record<string, string>
  );
  res.json(config);
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
