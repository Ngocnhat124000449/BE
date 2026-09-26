import { Router } from "express";
import * as c from "../controllers/course.controller.js";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseInput:
 *       type: object
 *       required: [CourseCode, CourseName, Credits]
 *       properties:
 *         CourseCode: { type: string, example: IT101 }
 *         CourseName: { type: string, example: Lap trinh Backend }
 *         Credits: { type: integer, example: 3 }
 *         DepartmentId: { type: integer, example: 1 }
 *   parameters:
 *     CourseId:
 *       in: path
 *       name: id
 *       required: true
 *       schema: { type: integer }
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     tags: [Courses]
 *     summary: Lay danh sach mon hoc
 *     responses:
 *       200: { description: Thanh cong }
 *   post:
 *     tags: [Courses]
 *     summary: Them mon hoc (Admin)
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CourseInput' }
 *     responses:
 *       201: { description: Them thanh cong }
 *       400: { description: Du lieu khong hop le }
 *       401: { description: Token sai hoac het han }
 *       403: { description: Thieu token hoac khong phai Admin }
 *       409: { description: Trung ma mon hoc }
 */
router.get("/", c.getAllCourses);
router.post("/", verifyToken, isAdmin, c.createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     tags: [Courses]
 *     summary: Lay mon hoc theo id
 *     parameters: [{ $ref: '#/components/parameters/CourseId' }]
 *     responses:
 *       200: { description: Thanh cong }
 *       404: { description: Khong tim thay }
 *   put:
 *     tags: [Courses]
 *     summary: Cap nhat mon hoc (Admin)
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/CourseId' }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CourseInput' }
 *     responses:
 *       200: { description: Cap nhat thanh cong }
 *       404: { description: Khong tim thay }
 *   delete:
 *     tags: [Courses]
 *     summary: Xoa mon hoc (Admin)
 *     security: [{ BearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/CourseId' }]
 *     responses:
 *       200: { description: Xoa thanh cong }
 *       404: { description: Khong tim thay }
 *       409: { description: Mon hoc dang co lop hoc phan }
 */
router.get("/:id", c.getCourseById);
router.put("/:id", verifyToken, isAdmin, c.updateCourse);
router.delete("/:id", verifyToken, isAdmin, c.deleteCourse);

export default router;