import "dotenv/config";
import sql from "mssql";

const config: sql.config = {
  server: process.env.DB_SERVER ?? "localhost",
  port: Number(process.env.DB_PORT ?? 1433),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: { encrypt: false, trustServerCertificate: true },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

async function connect(): Promise<sql.ConnectionPool> {
  try {
    const pool = await new sql.ConnectionPool(config).connect();
    console.log("Connected to SQL Server");
    return pool;
  } catch (error: unknown) {
    poolPromise = null;
    console.error("Ket noi SQL Server that bai:", error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export function getPool(): Promise<sql.ConnectionPool> {
  if (!poolPromise) poolPromise = connect();
  return poolPromise;
}