import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validateCoupon } from "../controllers/coupon.controller";

const router = Router();

router.post("/validate", asyncHandler(validateCoupon));

export default router;
