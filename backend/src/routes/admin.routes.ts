import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { login, logout, getMe } from "../controllers/admin/auth.controller";
import { getServices, createService, updateService, deleteService } from "../controllers/admin/service.controller";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from "../controllers/admin/coupon.controller";
import { getPurchases, updatePurchase } from "../controllers/admin/purchase.controller";
import { getConfig, updateConfig } from "../controllers/admin/config.controller";

const router = Router();

// Auth
router.post("/login", asyncHandler(login));
router.post("/logout", authMiddleware, asyncHandler(logout));
router.get("/me", authMiddleware, asyncHandler(getMe));

// Services
router.get("/services", authMiddleware, asyncHandler(getServices));
router.post("/services", authMiddleware, asyncHandler(createService));
router.put("/services/:id", authMiddleware, asyncHandler(updateService));
router.delete("/services/:id", authMiddleware, asyncHandler(deleteService));

// Coupons
router.get("/coupons", authMiddleware, asyncHandler(getCoupons));
router.post("/coupons", authMiddleware, asyncHandler(createCoupon));
router.put("/coupons/:id", authMiddleware, asyncHandler(updateCoupon));
router.delete("/coupons/:id", authMiddleware, asyncHandler(deleteCoupon));

// Purchases
router.get("/purchases", authMiddleware, asyncHandler(getPurchases));
router.put("/purchases/:id", authMiddleware, asyncHandler(updatePurchase));

// Config
router.get("/config", authMiddleware, asyncHandler(getConfig));
router.put("/config", authMiddleware, asyncHandler(updateConfig));

export default router;
