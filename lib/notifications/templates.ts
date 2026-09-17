import { SHIPMENT_STATUSES, isShipmentStatus, statusLabel } from "../constants";
import { formatDate } from "../format";

export interface ShipmentNotificationContext {
  trackingId: string;
  status: string;
  consigneeName: string;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  contractRef?: string | null;
  eta?: Date | null;
  location?: string | null;
  remarks?: string | null;
  trackUrl: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function shipmentUpdateSubject(context: ShipmentNotificationContext): string {
  return `${context.trackingId} — ${statusLabel(context.status)}`;
}

export function shipmentUpdateBody(context: ShipmentNotificationContext): string {
  const lines: string[] = [];
  lines.push(`Dear ${context.consigneeName},`);
  lines.push("");
  lines.push(
    `There is an update on your shipment ${context.trackingId}${context.contractRef ? ` (contract ${context.contractRef})` : ""}.`,
  );
  lines.push("");
  lines.push(`Status:    ${statusLabel(context.status)}`);
  if (isShipmentStatus(context.status)) {
    lines.push(`           ${SHIPMENT_STATUSES[context.status].description}`);
  }
  if (context.location) lines.push(`Location:  ${context.location}`);
  lines.push(
    `Route:     ${context.originCity}, ${context.originCountry} to ${context.destinationCity}, ${context.destinationCountry}`,
  );
  if (context.eta) lines.push(`Estimated: ${formatDate(context.eta)}`);
  if (context.remarks) {
    lines.push("");
    lines.push(`Remarks: ${context.remarks}`);
  }
  lines.push("");
  lines.push(`Full timeline: ${context.trackUrl}`);
  lines.push("");
  lines.push(
    "Estimated dates are indicative. Multimodal and cross-border movements are subject to border, customs, vessel and wagon availability.",
  );
  lines.push("");
  lines.push("Navigator Sea Land Limited");
  lines.push("Project Freight Forwarding & Multimodal Logistics");
  return lines.join("\n");
}

export function shipmentUpdateHtml(context: ShipmentNotificationContext): string {
  const label = escapeHtml(statusLabel(context.status));
  const rows: Array<[string, string]> = [
    ["Tracking ID", escapeHtml(context.trackingId)],
    ["Status", label],
  ];
  if (context.contractRef) rows.push(["Contract", escapeHtml(context.contractRef)]);
  if (context.location) rows.push(["Location", escapeHtml(context.location)]);
  rows.push([
    "Route",
    escapeHtml(
      `${context.originCity}, ${context.originCountry} → ${context.destinationCity}, ${context.destinationCountry}`,
    ),
  ]);
  if (context.eta) rows.push(["Estimated delivery", escapeHtml(formatDate(context.eta))]);
  if (context.remarks) rows.push(["Remarks", escapeHtml(context.remarks)]);

  const rowsHtml = rows
    .map(
      ([key, value]) =>
        `<tr><td style="padding:8px 16px 8px 0;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top">${key}</td><td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:500">${value}</td></tr>`,
    )
    .join("");

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
  <table role="presentation" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;border-collapse:separate">
    <tr><td style="background:#0f172a;padding:20px 28px;border-radius:8px 8px 0 0">
      <div style="color:#ffffff;font-size:16px;font-weight:600;letter-spacing:0.02em">NAVIGATOR SEA LAND</div>
      <div style="color:#94a3b8;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;margin-top:4px">Shipment update</div>
    </td></tr>
    <tr><td style="padding:28px">
      <p style="margin:0 0 20px;color:#0f172a;font-size:15px">Dear ${escapeHtml(context.consigneeName)},</p>
      <p style="margin:0 0 20px;color:#334155;font-size:14px;line-height:1.6">There is an update on your shipment.</p>
      <table role="presentation" style="width:100%;border-collapse:collapse">${rowsHtml}</table>
      <p style="margin:28px 0 0">
        <a href="${escapeHtml(context.trackUrl)}" style="display:inline-block;background:#0369a1;color:#ffffff;text-decoration:none;padding:11px 22px;border-radius:6px;font-size:14px;font-weight:600">View full timeline</a>
      </p>
      <p style="margin:24px 0 0;color:#64748b;font-size:12px;line-height:1.6">Estimated dates are indicative. Multimodal and cross-border movements are subject to border, customs, vessel and wagon availability.</p>
    </td></tr>
    <tr><td style="padding:16px 28px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:11px">
      Navigator Sea Land Limited &middot; Project Freight Forwarding &amp; Multimodal Logistics &middot; Almaty &middot; Atyrau &middot; Mumbai
    </td></tr>
  </table>
</body></html>`;
}

export function internalAlertBody(title: string, fields: Array<[string, string]>): string {
  const width = Math.max(...fields.map(([k]) => k.length));
  const lines = fields.map(([k, v]) => `${k.padEnd(width)} : ${v}`);
  return [title, "", ...lines].join("\n");
}
