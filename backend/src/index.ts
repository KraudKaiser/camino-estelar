import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/error.middleware";
import { logger } from "./utils/logger";
import serviceRoutes from "./routes/service.routes";
import purchaseRoutes from "./routes/purchase.routes";
import couponRoutes from "./routes/coupon.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(cookieParser());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const originalEnd = res.end;
  res.end = function (...args: any[]) {
    const duration = Date.now() - start;
    logger.info("Request", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
    return (originalEnd as any).apply(this, args);
  };
  next();
});

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
  logger.info("Server started", {
    port: PORT,
    nodeEnv: process.env.NODE_ENV || "development",
    frontendUrl: process.env.FRONTEND_URL || "NOT SET",
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasMpToken: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
    hasSmtp: !!process.env.SMTP_HOST,
  });
});

export default app;
