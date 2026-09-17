import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import type { DeliveryResult, NotificationChannel, NotificationMessage } from "../types";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT ?? "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
  });
  return transporter;
}

export const emailChannel: NotificationChannel = {
  name: "EMAIL",

  isEnabled() {
    return process.env.NOTIFY_EMAIL_ENABLED === "true" && Boolean(process.env.SMTP_HOST);
  },

  async send(message: NotificationMessage): Promise<DeliveryResult> {
    if (!message.recipient) return { status: "SKIPPED_NO_RECIPIENT" };
    if (!this.isEnabled()) {
      // Log-only mode: the attempt is still written to NotificationLog by the
      // dispatcher, so nothing is lost while SMTP credentials are pending.
      console.info(`[notify:email] (disabled) would send "${message.subject}" to ${message.recipient}`);
      return { status: "SKIPPED_DISABLED" };
    }

    try {
      await getTransporter().sendMail({
        from: process.env.SMTP_FROM ?? "Navigator Sea Land <no-reply@navigatorsealand.com>",
        to: message.recipient,
        subject: message.subject,
        text: message.body,
        html: message.html,
      });
      return { status: "SENT" };
    } catch (error) {
      const error_ = error instanceof Error ? error.message : String(error);
      console.error("[notify:email] send failed", error_);
      return { status: "FAILED", error: error_ };
    }
  },
};
