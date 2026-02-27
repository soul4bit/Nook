import nodemailer from "nodemailer";
import { getMailEnv } from "./env";
import {
  getResetPasswordEmailTemplate,
  getVerificationEmailTemplate,
} from "./templates";

type MailTransport = {
  sendMail(options: unknown): Promise<unknown>;
};

let cachedTransporter: MailTransport | null = null;

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const env = getMailEnv();

  cachedTransporter = nodemailer.createTransport({
    host: env.host,
    port: env.port,
    secure: env.secure,
    auth: {
      user: env.user,
      pass: env.password,
    },
  });

  return cachedTransporter;
}

async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const transporter = getTransporter();
  const env = getMailEnv();

  await transporter.sendMail({
    from: env.from,
    to,
    subject,
    text,
    html,
  });
}

export async function sendVerificationEmail(input: {
  email: string;
  name?: string | null;
  url: string;
}) {
  const template = getVerificationEmailTemplate(input);

  await sendMail({
    to: input.email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
}

export async function sendResetPasswordEmail(input: {
  email: string;
  name?: string | null;
  url: string;
}) {
  const template = getResetPasswordEmailTemplate(input);

  await sendMail({
    to: input.email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
}
