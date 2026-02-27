export function getAuthEnv() {
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