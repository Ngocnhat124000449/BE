import type { Request, Response } from "express";
import * as service from "../services/course.service.js";

import { ok, sendError } from "../utils/apiResponse.util.js";



export async function getAllCourses(_req: Request, res: Response): Promise<void> {
  try {
    res.status(200).json(ok("Lấy danh sách môn học thành công", await service.list()));
  } catch (error: unknown) {
    sendError(res, error);
  }
}

export async function getCourseById(req: Request, res: Response): Promise<void> {
  try {
    const id = service.parseId(String(req.params.id));
    res.status(200).json(ok("Lấy môn học thành công", await service.detail(id)));
  } catch (error: unknown) {
    sendError(res, error);
  }
}

export async function createCourse(req: Request, res: Response): Promise<void> {
  try {
    res.status(201).json(ok("Thêm môn học thành công", await service.createCourse(req.body ?? {})));
  } catch (error: unknown) {
    sendError(res, error);
  }
}

export async function updateCourse(req: Request, res: Response): Promise<void> {
  try {
    const id = service.parseId(String(req.params.id));
    res.status(200).json(ok("Cập nhật môn học thành công", await service.updateCourse(id, req.body ?? {})));
  } catch (error: unknown) {
    sendError(res, error);
  }
}

export async function deleteCourse(req: Request, res: Response): Promise<void> {
  try {
    const id = service.parseId(String(req.params.id));
    await service.deleteCourse(id);
    res.status(200).json(ok("Xóa môn học thành công"));
  } catch (error: unknown) {
    sendError(res, error);
  }
}
