import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.cookies?.admin_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Sesi tidak valid" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("CRITICAL: JWT_SECRET belum diatur di environment variable!");
    return res.status(500).json({ error: "Konfigurasi server otentikasi tidak lengkap" });
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    return res
      .status(401)
      .json({ error: "Unauthorized: Token kadaluarsa atau tidak valid" });
  }
};
