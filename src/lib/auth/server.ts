import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { getAuthEnv } from "./env";

declare global {
  var nookPgPool: Pool | undefined;
}

const { databaseUrl, secret, baseUrl } = getAuthEnv();

const pool =
  globalThis.nookPgPool ??
  new Pool({
    connectionString: databaseUrl,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.nookPgPool = pool;
}

export const auth = betterAuth({
  database: pool,
  secret,
  baseURL: baseUrl,
  basePath: "/api/auth",
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});