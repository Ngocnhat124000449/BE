import * as repo from "../repositories/enrollment.repository.js";
import { AppError, getErrorMessage, sqlErrorNumber } from "../utils/apiResponse.util.js";
import type { IEnrollmentDTO, IEnrollReq } from "../dtos/enrollment.dto.js";

export async function enrollClass(
  studentId: string | undefined,
  body: Partial<IEnrollReq>,
): Promise<IEnrollmentDTO> {
  if (!studentId) throw new AppError(403, "Không có token");

  const classId = Number(body.ClassId);
  if (!Number.isInteger(classId) || classId <= 0) {
    throw new AppError(400, "ClassId không hợp lệ");
  }

  try {
    return await repo.enroll(studentId, classId);
  } catch (error: unknown) {
    const n = sqlErrorNumber(error);
    if (n !== undefined && n >= 50001 && n <= 50003) throw new AppError(400, getErrorMessage(error));
    if (n === 2627 || n === 2601) throw new AppError(400, "Bạn đã đăng ký lớp học này rồi");
    throw error;
  }
}