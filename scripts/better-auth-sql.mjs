import { getMigrations } from "better-auth/db";
import { auth, pool } from "./auth-instance.mjs";

try {
  const migrations = await getMigrations(auth.options);
  const sql = await migrations.compileMigrations();
  console.log(sql);
} finally {
  await pool.end();
}
