import sql from "mssql";
import { getPool } from "../config/db.config.js";
import type { IEnrollmentDTO } from "../dtos/enrollment.dto.js";

export async function enroll(studentId: string, classId: number): Promise<IEnrollmentDTO> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("StudentId", sql.UniqueIdentifier, studentId)
    .input("ClassId", sql.Int, classId)
    .execute<IEnrollmentDTO>("dbo.sp_DangKyHocPhan");
  return result.recordset[0];
}