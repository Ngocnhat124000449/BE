import * as repo from "../repositories/course.repository.js";

import type { ICourseDTO, ICourseReq } from "../dtos/course.dto.js";
import { AppError, sqlErrorNumber } from "../utils/apiResponse.util.js";



export function parseId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw new AppError(400, "Id không hợp lệ");
  return id;
}

function validate(body: Partial<ICourseReq>): ICourseReq {
  const { CourseCode, CourseName, Credits, DepartmentId } = body;
  if (!CourseCode || !CourseName) throw new AppError(400, "Thiếu CourseCode hoặc CourseName");
  if (!Number.isInteger(Credits) || Number(Credits) < 1 || Number(Credits) > 10) {
    throw new AppError(400, "Số tín chỉ phải là số nguyên từ 1 đến 10");
  }
  return { CourseCode, CourseName, Credits: Number(Credits), DepartmentId: DepartmentId ?? null };
}

async function write<T>(action: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error: unknown) {
    const n = sqlErrorNumber(error);
    if (n === 2627 || n === 2601) throw new AppError(409, "Mã môn học đã tồn tại");
    if (n === 547) throw new AppError(409, "Vi phạm ràng buộc khóa ngoại (Khoa không tồn tại hoặc môn đang có lớp học phần)");
    throw error;
  }
}

export const list = (): Promise<ICourseDTO[]> => repo.getAll();

export async function detail(id: number): Promise<ICourseDTO> {
  const course = await repo.getById(id);
  if (!course) throw new AppError(404, `Không tìm thấy môn học có id ${id}`);
  return course;
}

export function createCourse(body: Partial<ICourseReq>): Promise<ICourseDTO> {
  const data = validate(body);
  return write(() => repo.create(data));
}

export async function updateCourse(id: number, body: Partial<ICourseReq>): Promise<ICourseDTO> {
  const data = validate(body);
  const course = await write(() => repo.update(id, data));
  if (!course) throw new AppError(404, `Không tìm thấy môn học có id ${id}`);
  return course;
}

export async function deleteCourse(id: number): Promise<void> {
  const deleted = await write(() => repo.remove(id));
  if (deleted === 0) throw new AppError(404, `Không tìm thấy môn học có id ${id}`);
}