import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { Pool } from "pg";

function getAuthEnv() {
  const databaseUrl = process.env.DATABASE_URL;
  const secret = process.env.BETTER_AUTH_SECRET;
  const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

  if (!databaseUrl || !secret) {
    throw new Error(
      "Better Auth env vars missing: DATABASE_URL and BETTER_AUTH_SECRET"
    );
  }

  return {
    databaseUrl,
    secret,
    baseUrl,
  };
}

const { databaseUrl, secret, baseUrl } = getAuthEnv();

export const pool = new Pool({
  connectionString: databaseUrl,
});

export const auth = betterAuth({
  database: pool,
  secret,
  baseURL: baseUrl,
  basePath: "/api/auth",
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  plugins: [admin(), nextCookies()],
});
