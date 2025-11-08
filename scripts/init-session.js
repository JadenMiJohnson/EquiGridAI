// scripts/init-session.js
import pg from "pg";
const { Client } = pg;

if (!process.env.DATABASE_URL) {
  console.error("❌ Missing DATABASE_URL in environment.");
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const DDL = `
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar PRIMARY KEY,
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS "session_expire_idx" ON "session" ("expire");
`;

(async () => {
  try {
    await client.connect();
    await client.query(DDL);
    console.log("✅ session table ensured.");
  } catch (e) {
    console.error("❌ Failed creating session table:", e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
