import { Pool, QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const query = async <T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number | null }> => {
  const result: QueryResult = await pool.query(text, params);
  return result as unknown as { rows: T[]; rowCount: number | null };
};

export const getClient = () => pool.connect();

export default pool;
