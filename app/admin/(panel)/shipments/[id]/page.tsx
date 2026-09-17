import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Alert, ButtonLink, Card, DataRow, Pill, StatusBadge } from "@/components/ui";
import { CheckpointForm } from "@/components/admin/checkpoint-form";
import { AttachmentPanel } from "@/components/admin/attachment-panel";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { IconAlert, IconMail, IconPlus, IconPrinter } from "@/components/icons";
import { addCheckpoint, deleteCheckpoint, deleteShipment, resendNotification } from "../actions";
import { prisma } from "@/lib/db";
import { canAdminister, canWrite, getSessionUser } from "@/lib/auth";
import { CORRIDORS, MODES, SHIPMENT_STATUSES, isShipmentStatus, parseList, statusLabel } from "@/lib/constants";
import { formatDate, formatDateTime, formatDimensions, formatWeight } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const shipment = await prisma.shipment.findUnique({ where: { id }, select: { trackingId: true } });
  return { title: shipment?.trackingId ?? "Shipment" };
}

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; saved?: string }>;
}

export default async function ShipmentDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const flags = await searchParams;

  const [user, shipment] = await Promise.all([
    getSessionUser(),
    prisma.shipment.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true } },
        client: { select: { id: true, companyName: true } },
        checkpoints: {
          orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
          include: { createdBy: { select: { name: true } }, attachments: true },
        },
        notifications: { orderBy: { createdAt: "desc" }, take: 8 },
      },
    }),
  ]);

  if (!shipment) notFound();

  const writable = canWrite(user);
  const isException = isShipmentStatus(shipment.status) && SHIPMENT_STATUSES[shipment.status].isException;
  const modes = parseList(shipment.modes);
  const corridors = parseList(shipment.corridors);

  const addCheckpointAction = addCheckpoint.bind(null, shipment.id);
  const deleteShipmentAction = deleteShipment.bind(null, shipment.id);
  const resendAction = resendNotification.bind(null, shipment.id);

  return (
    <>
      <AdminPageHeader
        title={shipment.trackingId}
        description={`${shipment.originCity}, ${shipment.originCountry} → ${shipment.destinationCity}, ${shipment.destinationCountry}`}
        actions={
          <>
            <ButtonLink href={`/track?id=${shipment.trackingId}`} variant="secondary" size="sm" target="_blank">
              Client view ↗
            </ButtonLink>
            <ButtonLink
              href={`/admin/shipments/${shipment.id}/print`}
              variant="secondary"
              size="sm"
              target="_blank"
            >
              <IconPrinter className="size-4" />
              Print / PDF
            </ButtonLink>
            {writable ? (
              <>
                <form action={resendAction}>
                  <ConfirmButton
                    message={`Send a status notification for ${shipment.trackingId} to the configured recipients now?`}
                    className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-ink-300 px-3 text-sm font-medium text-ink-700 transition-colors duration-150 hover:bg-ink-100"
                  >
                    <IconMail className="size-4" />
                    Notify client
                  </ConfirmButton>
                </form>
                <ButtonLink href={`/admin/shipments/${shipment.id}/edit`} size="sm">
                  Edit
                </ButtonLink>
              </>
            ) : null}
          </>
        }
      />

      <div className="space-y-6 p-5 sm:p-8">
        {flags.created ? (
          <Alert tone="success" title={`Shipment ${shipment.trackingId} created`}>
            The Tracking ID above is what the client uses. They will also need the consignee email or the contract
            reference unless you have opened public access on this shipment.
          </Alert>
        ) : null}
        {flags.saved ? <Alert tone="success">Changes saved.</Alert> : null}

        {isException ? (
          <Alert tone="warning" title={statusLabel(shipment.status)}>
            {shipment.exceptionNote ?? "No reason recorded. Add one — it is shown to the client on the timeline."}
          </Alert>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {/* Left column: details and timeline */}
          <div className="space-y-6">
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 px-5 py-4">
                <h2 className="font-[family-name:var(--font-display)] text-base font-semibold">Shipment details</h2>
                <div className="flex items-center gap-2">
                  {shipment.isOOG ? <Pill tone="signal">Out of gauge</Pill> : null}
                  {shipment.isPublicAccess ? <Pill tone="accent">Public tracking</Pill> : null}
                  <StatusBadge status={shipment.status} />
                </div>
              </div>
              <div className="px-5 py-1">
                <dl>
                  <DataRow label="Consignee">
                    {shipment.consigneeName}
                    {shipment.consigneeContact ? (
                      <span className="text-ink-500"> · {shipment.consigneeContact}</span>
                    ) : null}
                    {shipment.consigneeEmail ? (
                      <div className="text-sm text-ink-500">{shipment.consigneeEmail}</div>
                    ) : null}
                    {shipment.consigneePhone ? (
                      <div className="text-sm text-ink-500">{shipment.consigneePhone}</div>
                    ) : null}
                  </DataRow>
                  <DataRow label="Shipper">
                    {shipment.shipperName}
                    {shipment.shipperEmail ? (
                      <div className="text-sm text-ink-500">{shipment.shipperEmail}</div>
                    ) : null}
                  </DataRow>
                  {shipment.billingPartyName ? (
                    <DataRow label="Billing party">{shipment.billingPartyName}</DataRow>
                  ) : null}
                  {shipment.client ? <DataRow label="Client record">{shipment.client.companyName}</DataRow> : null}
                  <DataRow label="Contract / project">
                    {shipment.contractRef ?? "—"}
                    {shipment.projectName ? <span className="text-ink-500"> · {shipment.projectName}</span> : null}
                  </DataRow>
                  <DataRow label="Transport documents">
                    <span className="font-[family-name:var(--font-mono)] text-sm">
                      {[
                        shipment.blNumber ? `B/L ${shipment.blNumber}` : null,
                        shipment.cmrNumber ? `CMR ${shipment.cmrNumber}` : null,
                        shipment.awbNumber ? `AWB ${shipment.awbNumber}` : null,
                      ]
                        .filter(Boolean)
                        .join("  ·  ") || "—"}
                    </span>
                  </DataRow>
                  <DataRow label="Cargo">
                    {shipment.cargoDescription}
                    <div className="mt-1 text-sm text-ink-500">
                      {[
                        shipment.commodity,
                        shipment.packageCount
                          ? `${shipment.packageCount} × ${shipment.packageType ?? "pieces"}`
                          : null,
                        formatWeight(shipment.weightKg),
                        formatDimensions(shipment.lengthCm, shipment.widthCm, shipment.heightCm),
                        shipment.volumeCbm ? `${shipment.volumeCbm} cbm` : null,
                      ]
                        .filter((part) => part && part !== "—")
                        .join("  ·  ")}
                    </div>
                    {shipment.oogNotes ? (
                      <div className="mt-2 rounded border border-signal-500/30 bg-signal-50 px-3 py-2 text-sm text-signal-700">
                        {shipment.oogNotes}
                      </div>
                    ) : null}
                  </DataRow>
                  <DataRow label="Transport">
                    <div className="flex flex-wrap gap-1.5">
                      {modes.map((mode) => (
                        <Pill key={mode}>{MODES[mode as keyof typeof MODES] ?? mode}</Pill>
                      ))}
                      {corridors.map((corridor) => (
                        <Pill key={corridor} tone="accent">
                          {CORRIDORS[corridor as keyof typeof CORRIDORS] ?? corridor}
                        </Pill>
                      ))}
                    </div>
                  </DataRow>
                  <DataRow label="Ports / crossings">
                    {[shipment.portOfLoading, shipment.portOfDischarge].filter(Boolean).join(" → ") || "—"}
                    {shipment.borderCrossings ? (
                      <div className="text-sm text-ink-500">via {shipment.borderCrossings}</div>
                    ) : null}
                  </DataRow>
                  <DataRow label="Schedule">
                    ETD {formatDate(shipment.etd)} · ETA {formatDate(shipment.eta)}
                    {shipment.actualDelivery ? (
                      <div className="text-sm font-medium text-success-700">
                        Delivered {formatDate(shipment.actualDelivery)}
                      </div>
                    ) : null}
                  </DataRow>
                  <DataRow label="Handled by">{shipment.owner?.name ?? "Unassigned"}</DataRow>
                  {shipment.internalNotes ? (
                    <DataRow label="Internal notes">
                      <span className="whitespace-pre-wrap text-ink-700">{shipment.internalNotes}</span>
                    </DataRow>
                  ) : null}
                </dl>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
                <h2 className="font-[family-name:var(--font-display)] text-base font-semibold">
                  Checkpoints
                  <span className="ml-2 font-normal text-ink-500">({shipment.checkpoints.length})</span>
                </h2>
              </div>

              {shipment.checkpoints.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-ink-500">No checkpoints recorded yet.</p>
              ) : (
                <ul className="divide-y divide-ink-200">
                  {shipment.checkpoints.map((checkpoint) => {
                    const cpException =
                      isShipmentStatus(checkpoint.status) && SHIPMENT_STATUSES[checkpoint.status].isException;
                    const deleteAction = deleteCheckpoint.bind(null, checkpoint.id, shipment.id);

                    return (
                      <li key={checkpoint.id} className={`px-5 py-4 ${cpException ? "bg-signal-50" : ""}`}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusBadge status={checkpoint.status} size="sm" />
                              {!checkpoint.isClientVisible ? <Pill>Internal only</Pill> : null}
                              {checkpoint.leg ? (
                                <span className="text-xs text-ink-500">
                                  {MODES[checkpoint.leg as keyof typeof MODES] ?? checkpoint.leg}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1.5 font-medium text-ink-900">
                              {checkpoint.location}
                              {checkpoint.country ? <span className="text-ink-500">, {checkpoint.country}</span> : null}
                            </p>
                            {checkpoint.remarks ? (
                              <p className="mt-1 text-sm leading-relaxed text-ink-600">{checkpoint.remarks}</p>
                            ) : null}
                            <p className="mt-2 text-xs text-ink-500">
                              {formatDateTime(checkpoint.occurredAt)}
                              {checkpoint.createdBy ? ` · recorded by ${checkpoint.createdBy.name}` : ""}
                            </p>

                            <AttachmentPanel
                              checkpointId={checkpoint.id}
                              shipmentId={shipment.id}
                              attachments={checkpoint.attachments}
                              canEdit={writable}
                            />
                          </div>

                          {writable ? (
                            <form action={deleteAction}>
                              <ConfirmButton
                                message={`Delete the ${statusLabel(checkpoint.status)} checkpoint at ${checkpoint.location}? This cannot be undone.`}
                                className="inline-flex h-8 cursor-pointer items-center rounded px-2 text-xs font-medium text-danger-600 transition-colors duration-150 hover:bg-danger-50"
                              >
                                Delete
                              </ConfirmButton>
                            </form>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </div>

          {/* Right column: add checkpoint, notifications, danger zone */}
          <div className="space-y-6">
            {writable ? (
              <Card className="p-5">
                <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-base font-semibold">
                  <IconPlus className="size-4 text-accent-600" />
                  Add a checkpoint
                </h2>
                <p className="mt-1 text-sm text-ink-500">
                  This is how the client timeline is updated. Nothing is sent automatically from a carrier feed.
                </p>
                <div className="mt-5">
                  <CheckpointForm
                    action={addCheckpointAction}
                    defaultStatus={shipment.status}
                    defaultLocation={shipment.checkpoints[0]?.location}
                  />
                </div>
              </Card>
            ) : (
              <Alert tone="info" title="View-only access">
                Your account can view shipments but not change them. Ask an administrator for Operations access.
              </Alert>
            )}

            <Card>
              <div className="border-b border-ink-200 px-5 py-4">
                <h2 className="font-[family-name:var(--font-display)] text-base font-semibold">
                  Recent notifications
                </h2>
              </div>
              {shipment.notifications.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-ink-500">Nothing sent for this shipment yet.</p>
              ) : (
                <ul className="divide-y divide-ink-200">
                  {shipment.notifications.map((notification) => (
                    <li key={notification.id} className="px-5 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm text-ink-800">{notification.recipient}</span>
                        <NotificationStatus status={notification.status} />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-ink-500">
                        {notification.channel} · {notification.subject ?? notification.trigger} ·{" "}
                        {formatDateTime(notification.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="border-t border-ink-200 px-5 py-3">
                <Link href="/admin/notifications" className="text-sm text-accent-600 hover:text-accent-700">
                  Full notification log →
                </Link>
              </div>
            </Card>

            {canAdminister(user) ? (
              <Card className="border-danger-600/30 p-5">
                <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-base font-semibold text-danger-700">
                  <IconAlert className="size-4" />
                  Delete shipment
                </h2>
                <p className="mt-1.5 text-sm text-ink-600">
                  Removes the shipment and all its checkpoints permanently. Notification records are kept.
                  Administrators only.
                </p>
                <form action={deleteShipmentAction} className="mt-4">
                  <ConfirmButton
                    message={`Permanently delete ${shipment.trackingId} and all of its checkpoints? This cannot be undone.`}
                  >
                    Delete {shipment.trackingId}
                  </ConfirmButton>
                </form>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

function NotificationStatus({ status }: { status: string }) {
  const tone =
    status === "SENT"
      ? "border-success-600/30 bg-success-50 text-success-700"
      : status === "FAILED"
        ? "border-danger-600/30 bg-danger-50 text-danger-700"
        : "border-ink-300 bg-ink-100 text-ink-600";
  const label =
    status === "SKIPPED_DISABLED"
      ? "Logged only"
      : status === "SKIPPED_NO_RECIPIENT"
        ? "No recipient"
        : status === "SENT"
          ? "Sent"
          : "Failed";
  return (
    <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[0.6875rem] font-medium ${tone}`}>{label}</span>
  );
}
