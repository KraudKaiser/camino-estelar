import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getServices, getService } from "../controllers/service.controller";

const router = Router();

router.get("/", asyncHandler(getServices));
router.get("/:id", asyncHandler(getService));

export default router;
