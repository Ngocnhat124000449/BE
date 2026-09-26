import { Router } from "express";
import { loginController } from "../controllers/auth.controller.js";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Dang nhap, cap phat JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string, example: admin }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Dang nhap thanh cong, tra ve token
 *       400:
 *         description: Thieu username hoac password
 *       401:
 *         description: Sai tai khoan hoac mat khau
 */
router.post("/login", loginController);

export default router;