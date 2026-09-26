import { Router } from "express";
import { enrollClass } from "../controllers/enrollment.controller.js";
import { isStudent, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     tags: [Enrollments]
 *     summary: Sinh vien dang ky lop hoc phan
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ClassId]
 *             properties:
 *               ClassId: { type: integer, example: 1 }
 *     responses:
 *       201: { description: Dang ky thanh cong }
 *       400: { description: Lop dong, day si so, hoac da dang ky }
 *       401: { description: Token sai hoac het han }
 *       403: { description: Thieu token hoac khong phai Sinh vien }
 */
router.post("/", verifyToken, isStudent, enrollClass);

export default router;