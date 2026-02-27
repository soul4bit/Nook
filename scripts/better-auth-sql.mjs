import { getMigrations } from "better-auth/db";
import { auth } from "../src/lib/auth/server";

const migrations = await getMigrations(auth.options);
const sql = await migrations.compileMigrations();

console.log(sql);