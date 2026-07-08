import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createPurchase, getPurchase } from "../controllers/purchase.controller";

const router = Router();

router.post("/", asyncHandler(createPurchase));
router.get("/:id", asyncHandler(getPurchase));

export default router;
