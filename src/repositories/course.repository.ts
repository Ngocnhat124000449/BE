import sql from "mssql";
import { getPool } from "../config/db.config.js";
import type { ICourseDTO, ICourseReq } from "../dtos/course.dto.js";

function withBody(request: sql.Request, body: ICourseReq): sql.Request {
  return request
    .input("CourseCode", sql.VarChar(20), body.CourseCode)
    .input("CourseName", sql.NVarChar(150), body.CourseName)
    .input("Credits", sql.Int, body.Credits)
    .input("DepartmentId", sql.Int, body.DepartmentId ?? null);
}

export async function getAll(): Promise<ICourseDTO[]> {
  const pool = await getPool();
  const result = await pool.request().execute<ICourseDTO>("dbo.sp_MonHoc_LayDanhSach");
  return result.recordset;
}

export async function getById(id: number): Promise<ICourseDTO | null> {
  const pool = await getPool();
  const result = await pool.request()
    .input("CourseId", sql.Int, id)
    .execute<ICourseDTO>("dbo.sp_MonHoc_LayTheoId");
  return result.recordset[0] ?? null;
}

export async function create(body: ICourseReq): Promise<ICourseDTO> {
  const pool = await getPool();
  const result = await withBody(pool.request(), body).execute<ICourseDTO>("dbo.sp_MonHoc_Them");
  return result.recordset[0];
}

export async function update(id: number, body: ICourseReq): Promise<ICourseDTO | null> {
  const pool = await getPool();
  const result = await withBody(pool.request().input("CourseId", sql.Int, id), body)
    .execute<ICourseDTO>("dbo.sp_MonHoc_CapNhat");
  return result.recordset[0] ?? null;
}

export async function remove(id: number): Promise<number> {
  const pool = await getPool();
  const result = await pool.request()
    .input("CourseId", sql.Int, id)
    .execute<{ SoDongDaXoa: number }>("dbo.sp_MonHoc_Xoa");
  return result.recordset[0].SoDongDaXoa;
}