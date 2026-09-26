import sql from "mssql";
import { getPool } from "../config/db.config.js";
import type { INguoiDungRecord } from "../dtos/auth.dto.js";

export async function findByUsername(username: string): Promise<INguoiDungRecord | null> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("Username", sql.VarChar(50), username)
    .execute<INguoiDungRecord>("dbo.sp_LayNguoiDungTheoUsername");
  return result.recordset[0] ?? null;
}