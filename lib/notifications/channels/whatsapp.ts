import "server-only";
import type { DeliveryResult, NotificationChannel, NotificationMessage } from "../types";

/**
 * WhatsApp Business Cloud API adapter — intentionally not wired up.
 *
 * To activate:
 *  1. Create a Meta Business account and register a sender number.
 *  2. Submit message templates for approval. WhatsApp does not permit free-form
 *     business-initiated messages outside a 24-hour customer service window, so
 *     each milestone below needs its own approved template.
 *  3. Set WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN and
 *     NOTIFY_WHATSAPP_ENABLED=true.
 *  4. Replace the body of `send` with the fetch shown in the comment.
 *
 * Until then every call is logged and reported as SKIPPED_DISABLED, which the
 * dispatcher records in NotificationLog exactly like a real attempt.
 */
export const whatsappChannel: NotificationChannel = {
  name: "WHATSAPP",

  isEnabled() {
    return (
      process.env.NOTIFY_WHATSAPP_ENABLED === "true" &&
      Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID) &&
      Boolean(process.env.WHATSAPP_ACCESS_TOKEN)
    );
  },

  async send(message: NotificationMessage): Promise<DeliveryResult> {
    if (!message.recipient) return { status: "SKIPPED_NO_RECIPIENT" };

    if (!this.isEnabled()) {
      console.info(`[notify:whatsapp] (stub) would send to ${message.recipient}: ${message.subject}`);
      return { status: "SKIPPED_DISABLED" };
    }

    // Reference implementation for when templates are approved:
    //
    // const response = await fetch(
    //   `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       messaging_product: "whatsapp",
    //       to: message.recipient,
    //       type: "template",
    //       template: { name: "shipment_update", language: { code: "en" }, components: [...] },
    //     }),
    //   },
    // );
    // if (!response.ok) return { status: "FAILED", error: await response.text() };
    // return { status: "SENT" };

    return {
      status: "FAILED",
      error:
        "WhatsApp channel is enabled but not implemented. Complete lib/notifications/channels/whatsapp.ts before enabling.",
    };
  },
};
