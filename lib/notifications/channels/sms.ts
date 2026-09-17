import "server-only";
import type { DeliveryResult, NotificationChannel, NotificationMessage } from "../types";

/**
 * SMS adapter stub. Point `send` at whichever gateway is chosen (Twilio,
 * Vonage, or a regional provider with better Central Asia coverage), set
 * SMS_API_KEY and NOTIFY_SMS_ENABLED=true.
 */
export const smsChannel: NotificationChannel = {
  name: "SMS",

  isEnabled() {
    return process.env.NOTIFY_SMS_ENABLED === "true" && Boolean(process.env.SMS_API_KEY);
  },

  async send(message: NotificationMessage): Promise<DeliveryResult> {
    if (!message.recipient) return { status: "SKIPPED_NO_RECIPIENT" };
    if (!this.isEnabled()) {
      console.info(`[notify:sms] (stub) would send to ${message.recipient}: ${message.subject}`);
      return { status: "SKIPPED_DISABLED" };
    }
    return {
      status: "FAILED",
      error: "SMS channel is enabled but not implemented. Complete lib/notifications/channels/sms.ts.",
    };
  },
};
