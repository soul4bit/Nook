import { getMigrations } from "better-auth/db";
import { auth } from "../src/lib/auth/server";

const migrations = await getMigrations(auth.options);

await migrations.runMigrations();

console.log("Better Auth migrations applied.");