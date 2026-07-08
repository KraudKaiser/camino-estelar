import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { handleZodError } from "../utils/errors";

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error.errors) {
        next(handleZodError(error));
      } else {
        next(error);
      }
    }
  };
}
