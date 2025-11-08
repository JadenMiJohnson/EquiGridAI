// scripts/seed.js
import fs from "fs";
import pg from "pg";

const { Client } = pg;

const sql = fs.readFileSync("seed.sql", "utf8");

if (!process.env.DATABASE_URL) {
  console.error("❌ Missing DATABASE_URL in environment.");
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    await client.connect();
    console.log("Connected to database...");
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
    console.log("✅ Seed complete!");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    try { await client.query("ROLLBACK"); } catch {}
  } finally {
    await client.end();
  }
})();
