import "server-only";
import { prisma } from "../db";
import { parseList } from "../constants";
import { emailChannel } from "./channels/email";
import { whatsappChannel } from "./channels/whatsapp";
import { smsChannel } from "./channels/sms";
import type { NotificationChannel, NotificationMessage } from "./types";
import {
  shipmentUpdateBody,
  shipmentUpdateHtml,
  shipmentUpdateSubject,
  type ShipmentNotificationContext,
} from "./templates";

export const channels: Record<string, NotificationChannel> = {
  EMAIL: emailChannel,
  WHATSAPP: whatsappChannel,
  SMS: smsChannel,
};

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function trackUrlFor(trackingId: string): string {
  return `${siteUrl()}/track?id=${encodeURIComponent(trackingId)}`;
}

/**
 * Sends one message and records the attempt. Every path writes a
 * NotificationLog row — including disabled channels — so the admin can always
 * answer "was the client told, and when?".
 */
async function dispatch(
  channel: NotificationChannel,
  message: NotificationMessage,
  meta: { shipmentId?: string | null; trigger: string },
): Promise<void> {
  let result;
  try {
    result = await channel.send(message);
  } catch (error) {
    result = { status: "FAILED" as const, error: error instanceof Error ? error.message : String(error) };
  }

  try {
    await prisma.notificationLog.create({
      data: {
        shipmentId: meta.shipmentId ?? null,
        channel: channel.name,
        recipient: message.recipient,
        subject: message.subject,
        body: message.body,
        trigger: meta.trigger,
        status: result.status,
        error: result.error ?? null,
      },
    });
  } catch (error) {
    console.error("[notify] failed to write NotificationLog", error);
  }
}

/**
 * Notifies every recipient configured on a shipment across every channel.
 * Never throws: a failing mail server must not roll back a checkpoint that
 * operations has already recorded as having happened.
 */
export async function notifyShipmentMilestone(params: {
  shipmentId: string;
  trigger: string;
  context: ShipmentNotificationContext;
  emails: string | null | undefined;
  phones: string | null | undefined;
}): Promise<void> {
  try {
    const subject = shipmentUpdateSubject(params.context);
    const body = shipmentUpdateBody(params.context);
    const html = shipmentUpdateHtml(params.context);

    const emailRecipients = parseList(params.emails);
    const phoneRecipients = parseList(params.phones);

    await Promise.all([
      ...emailRecipients.map((recipient) =>
        dispatch(emailChannel, { recipient, subject, body, html }, {
          shipmentId: params.shipmentId,
          trigger: params.trigger,
        }),
      ),
      ...phoneRecipients.flatMap((recipient) => [
        dispatch(whatsappChannel, { recipient, subject, body }, {
          shipmentId: params.shipmentId,
          trigger: params.trigger,
        }),
        dispatch(smsChannel, { recipient, subject, body }, {
          shipmentId: params.shipmentId,
          trigger: params.trigger,
        }),
      ]),
    ]);
  } catch (error) {
    console.error("[notify] milestone dispatch failed", error);
  }
}

/** Alerts the Navigator inbox about a new quote request or enquiry. */
export async function notifyInternal(params: {
  subject: string;
  body: string;
  trigger: string;
  shipmentId?: string | null;
}): Promise<void> {
  const inbox = process.env.NOTIFY_INTERNAL_INBOX;
  if (!inbox) return;
  try {
    await dispatch(
      emailChannel,
      { recipient: inbox, subject: params.subject, body: params.body },
      { shipmentId: params.shipmentId ?? null, trigger: params.trigger },
    );
  } catch (error) {
    console.error("[notify] internal alert failed", error);
  }
}

export type { ShipmentNotificationContext };
