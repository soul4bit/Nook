import { getMigrations } from "better-auth/db";
import { auth, pool } from "./auth-instance.mjs";

try {
  const migrations = await getMigrations(auth.options);
  await migrations.runMigrations();
  console.log("Better Auth migrations applied.");
} finally {
  await pool.end();
}
