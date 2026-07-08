import { Request, Response, NextFunction } from "express";
import { AppError, handleZodError } from "../utils/errors";
import { Prisma } from "@prisma/client";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error("Error:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Record not found" });
    }
    return res.status(400).json({ error: "Database error" });
  }

  return res.status(500).json({ error: "Internal server error" });
}
