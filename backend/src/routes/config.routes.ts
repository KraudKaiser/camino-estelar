import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getPublicConfig } from "../controllers/admin/config.controller";

const router = Router();

router.get("/whatsapp", asyncHandler(getPublicConfig));

export default router;
