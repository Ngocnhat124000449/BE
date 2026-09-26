import express, { type Request, type Response } from "express";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { getPool } from "./config/db.config.js";
import { swaggerSpec } from "./config/swagger.config.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [System]
 *     summary: Kiem tra ket noi SQL Server
 *     responses:
 *       200:
 *         description: Ket noi thanh cong
 *       500:
 *         description: Ket noi that bai
 */
app.get("/health", async (_req: Request, res: Response) => {
  try {
    const pool = await getPool();
    await pool.request().query("SELECT 1");
    res.status(200).json({ status: "Connected to SQL Server" });
  } catch (error: unknown) {
    res.status(500).json({
      status: "Disconnected",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  getPool().catch(() => undefined);
});