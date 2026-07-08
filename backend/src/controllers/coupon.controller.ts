import { Request, Response } from "express";
import { ValidationError } from "../utils/errors";
import { validateCouponForService } from "../services/coupon.service";

export async function validateCoupon(req: Request, res: Response) {
  const { code, serviceId } = req.body;

  if (!code || !serviceId) {
    throw new ValidationError("Code and serviceId are required");
  }

  const result = await validateCouponForService(code, serviceId);

  if (result.valid) {
    res.json({
      valid: true,
      discount: result.discount,
      discountType: result.discountType,
      code: code.toUpperCase(),
    });
  } else {
    res.json({ valid: false, error: result.error });
  }
}
