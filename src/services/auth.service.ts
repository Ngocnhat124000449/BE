import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findByUsername } from "../repositories/auth.repository.js";
import { AppError } from "../utils/apiResponse.util.js";
import type { IJwtPayload, ILoginReq, ILoginRes } from "../dtos/auth.dto.js";

export async function login(body: Partial<ILoginReq>): Promise<ILoginRes> {
  const { username, password } = body;
  if (!username || !password) {
    throw new AppError(400, "Vui lòng nhập username và password");
  }

  const user = await findByUsername(username);
  if (!user || !(await bcrypt.compare(password, user.PasswordHash))) {
    throw new AppError(401, "Sai tài khoản hoặc mật khẩu");
  }
  if (!user.IsActive) {
    throw new AppError(403, "Tài khoản đã bị khóa");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError(500, "Thiếu cấu hình JWT_SECRET");

  const payload: IJwtPayload = { UserId: user.UserId, RoleId: user.RoleId };
  return { token: jwt.sign(payload, secret, { expiresIn: "2h" }) };
}