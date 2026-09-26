import type { Request, Response } from "express";
import { enrollClass as enroll } from "../services/enrollment.service.js";
import { ok, sendError } from "../utils/apiResponse.util.js";

export async function enrollClass(req: Request, res: Response): Promise<void> {
  try {
    const data = await enroll(req.user?.UserId, req.body ?? {});
    res.status(201).json(ok("Đăng ký thành công", data));
  } catch (error: unknown) {
    sendError(res, error);
  }
}