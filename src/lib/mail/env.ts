export function getMailEnv() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.MAIL_FROM ?? user;
  const port = Number.parseInt(process.env.SMTP_PORT ?? "465", 10);
  const secure = (process.env.SMTP_SECURE ?? "true").toLowerCase() === "true";

  if (!host || !user || !password || !from || Number.isNaN(port)) {
    throw new Error(
      "SMTP env vars missing: SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD and MAIL_FROM"
    );
  }

  return {
    host,
    port,
    secure,
    user,
    password,
    from,
  };
}
