import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors";
import { logger } from "../utils/logger";

export interface AuthRequest extends Request {
  adminId?: string;
}

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const cookieToken = req.cookies.token;
  const headerToken = req.headers.authorization?.replace("Bearer ", "");
  const token = cookieToken || headerToken;

  if (!token) {
    logger.debug("Auth failed: no token provided", {
      path: req.path,
      method: req.method,
    });
    return next(new UnauthorizedError());
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    req.adminId = decoded.id;
    logger.debug("Auth success", {
      adminId: decoded.id,
      source: cookieToken ? "cookie" : "header",
      path: req.path,
    });
    next();
  } catch (err) {
    logger.warn("Auth failed: invalid token", {
      path: req.path,
      method: req.method,
    });
    next(new UnauthorizedError());
  }
}
