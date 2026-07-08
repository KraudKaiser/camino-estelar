import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createPurchase,
  getPurchase,
  uploadProof,
} from "../controllers/purchase.controller";

const router = Router();

router.post("/", asyncHandler(createPurchase));
router.get("/:id", asyncHandler(getPurchase));
router.post("/:id/proof", asyncHandler(uploadProof));

export default router;
