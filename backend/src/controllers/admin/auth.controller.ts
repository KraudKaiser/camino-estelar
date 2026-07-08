import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../utils/prisma";
import { ValidationError, UnauthorizedError } from "../../utils/errors";
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  maxAge: 24 * 60 * 60 * 1000,
};

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    logger.warn("Login failed: unknown email", { email });
    throw new UnauthorizedError("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    logger.warn("Login failed: wrong password", { email });
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });

  res.cookie("token", token, TOKEN_COOKIE_OPTIONS);

  logger.info("Login success", { email, adminId: admin.id });

  res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("token", TOKEN_COOKIE_OPTIONS);
  res.json({ message: "Logged out" });
}

export async function getMe(req: AuthRequest, res: Response) {
  const admin = await prisma.admin.findUnique({
    where: { id: req.adminId! },
    select: { id: true, email: true, name: true },
  });

  res.json({ admin });
}
