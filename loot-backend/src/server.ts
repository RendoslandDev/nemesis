import app from "./app";
import pool from "./config/db";

const PORT = Number(process.env.PORT ?? 3001);

async function start() {
  // Test DB connection
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 DevLetter API running on http://localhost:${PORT}`);
    console.log(`   ENV: ${process.env.NODE_ENV ?? "production"}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await pool.end();
      console.log("Database pool closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
