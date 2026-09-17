/**
 * A single interface every channel implements. Email is live today; WhatsApp
 * and SMS are stubs that log and report SKIPPED_DISABLED. Turning one on is a
 * matter of filling in `send` and setting its env flag — no caller changes.
 */
export interface NotificationMessage {
  recipient: string;
  subject: string;
  /** Plain text. Channels that support HTML derive it from `html` when given. */
  body: string;
  html?: string;
}

export type DeliveryStatus = "SENT" | "FAILED" | "SKIPPED_DISABLED" | "SKIPPED_NO_RECIPIENT";

export interface DeliveryResult {
  status: DeliveryStatus;
  error?: string;
}

export interface NotificationChannel {
  readonly name: "EMAIL" | "WHATSAPP" | "SMS";
  isEnabled(): boolean;
  send(message: NotificationMessage): Promise<DeliveryResult>;
}
