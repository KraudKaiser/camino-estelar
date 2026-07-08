import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors";

export interface AuthRequest extends Request {
  adminId?: string;
}

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;

  if (!token) {
    return next(new UnauthorizedError());
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    req.adminId = decoded.id;
    next();
  } catch {
    next(new UnauthorizedError());
  }
}
