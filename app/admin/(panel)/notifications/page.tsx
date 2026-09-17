import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Alert, Card, EmptyState } from "@/components/ui";
import { prisma } from "@/lib/db";
import { canAdminister, getSessionUser } from "@/lib/auth";
import { statusLabel } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Notification log" };
export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getSessionUser();
  if (!canAdminister(user)) redirect("/admin");

  const logs = await prisma.notificationLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { shipment: { select: { id: true, trackingId: true } } },
  });

  const emailLive = process.env.NOTIFY_EMAIL_ENABLED === "true" && Boolean(process.env.SMTP_HOST);
  const whatsappLive = process.env.NOTIFY_WHATSAPP_ENABLED === "true";
  const smsLive = process.env.NOTIFY_SMS_ENABLED === "true";

  return (
    <>
      <AdminPageHeader
        title="Notification log"
        description="Every notification the system attempted, including ones suppressed because a channel is switched off."
      />

      <div className="space-y-5 p-5 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <ChannelCard name="Email" live={emailLive} note={emailLive ? "Sending via SMTP." : "Log-only. Set SMTP_* and NOTIFY_EMAIL_ENABLED=true in .env to send."} />
          <ChannelCard name="WhatsApp" live={whatsappLive} note="Adapter stubbed. Needs a Meta Business account and approved templates before it can send." />
          <ChannelCard name="SMS" live={smsLive} note="Adapter stubbed. Choose a gateway with Central Asia coverage, then implement lib/notifications/channels/sms.ts." />
        </div>

        {!emailLive ? (
          <Alert tone="warning" title="No notifications are currently being delivered">
            Email is in log-only mode, so the entries below record what <em>would</em> have been sent. Clients are
            not being notified. Configure SMTP in <span className="font-mono">.env</span> to switch it on.
          </Alert>
        ) : null}

        {logs.length === 0 ? (
          <EmptyState title="Nothing logged yet" description="Notifications appear here as milestones are recorded." />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[54rem] text-left text-sm">
                <thead className="border-b border-ink-200 bg-ink-50">
                  <tr>
                    <Th>When</Th>
                    <Th>Shipment</Th>
                    <Th>Channel</Th>
                    <Th>Recipient</Th>
                    <Th>Trigger</Th>
                    <Th>Result</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="whitespace-nowrap px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-ink-600">
                        {formatDateTime(log.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {log.shipment ? (
                          <Link
                            href={`/admin/shipments/${log.shipment.id}`}
                            className="font-[family-name:var(--font-mono)] text-accent-600 hover:underline"
                          >
                            {log.shipment.trackingId}
                          </Link>
                        ) : (
                          <span className="text-ink-500">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-700">{log.channel}</td>
                      <td className="max-w-[16rem] truncate px-4 py-3 text-ink-700">{log.recipient}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-600">
                        {log.trigger === "MANUAL" ? "Manual" : statusLabel(log.trigger)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Result status={log.status} error={log.error} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" className="px-4 py-3 font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wide text-ink-500">
      {children}
    </th>
  );
}

function ChannelCard({ name, live, note }: { name: string; live: boolean; note: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <p className="font-[family-name:var(--font-display)] font-semibold">{name}</p>
        <span
          className={`rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium ${
            live
              ? "border-success-600/30 bg-success-50 text-success-700"
              : "border-ink-300 bg-ink-100 text-ink-600"
          }`}
        >
          {live ? "Live" : "Log only"}
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-500">{note}</p>
    </Card>
  );
}

function Result({ status, error }: { status: string; error: string | null }) {
  const map: Record<string, { label: string; tone: string }> = {
    SENT: { label: "Sent", tone: "border-success-600/30 bg-success-50 text-success-700" },
    FAILED: { label: "Failed", tone: "border-danger-600/30 bg-danger-50 text-danger-700" },
    SKIPPED_DISABLED: { label: "Channel off", tone: "border-ink-300 bg-ink-100 text-ink-600" },
    SKIPPED_NO_RECIPIENT: { label: "No recipient", tone: "border-signal-500/40 bg-signal-50 text-signal-700" },
  };
  const entry = map[status] ?? { label: status, tone: "border-ink-300 bg-ink-100 text-ink-600" };
  return (
    <span className={`rounded border px-1.5 py-0.5 text-[0.6875rem] font-medium ${entry.tone}`} title={error ?? undefined}>
      {entry.label}
    </span>
  );
}
