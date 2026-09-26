import type { Request, Response } from "express";
import { login } from "../services/auth.service.js";
import { AppError, fail, getErrorMessage, ok } from "../utils/apiResponse.util.js";

export async function loginController(req: Request, res: Response): Promise<void> {
  try {
    const data = await login(req.body ?? {});
    res.status(200).json(ok("Đăng nhập thành công", data));
  } catch (error: unknown) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json(fail(error.message));
      return;
    }
    res.status(500).json(fail(getErrorMessage(error)));
  }
}