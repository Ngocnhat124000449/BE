import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { IJwtPayload } from "../dtos/auth.dto.js";
import { fail } from "../utils/apiResponse.util.js";

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(403).json(fail("Không có token"));
    return;
  }
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET ?? "");
    if (typeof decoded === "string") throw new Error("Payload không hợp lệ");
    req.user = { UserId: String(decoded.UserId), RoleId: Number(decoded.RoleId) };
    next();
  } catch {
    res.status(401).json(fail("Token không hợp lệ hoặc đã hết hạn"));
  }
}

function requireRole(roleId: number, message: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.RoleId !== roleId) {
      res.status(403).json(fail(message));
      return;
    }
    next();
  };
}

export const isAdmin = requireRole(1, "Yêu cầu quyền Quản trị viên");
export const isStudent = requireRole(3, "Yêu cầu quyền Sinh viên");