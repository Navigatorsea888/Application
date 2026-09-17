import { StatusBadge } from "./ui";
import { IconAlert, IconCheck, IconClock, MODE_ICONS } from "./icons";
import { formatDateTime } from "@/lib/format";
import { SHIPMENT_STATUSES, isShipmentStatus } from "@/lib/constants";
import type { TimelineStage } from "@/lib/shipments";

/**
 * Client-facing checkpoint timeline.
 *
 * Every stage of the movement is shown, including ones not yet reached, so a
 * client on a six-week corridor movement can see how far through it is rather
 * than only where it is. State is signalled by icon and text as well as
 * colour, so the timeline is readable without colour perception.
 */
export function TrackingTimeline({
  stages,
  isException,
  exceptionLabel,
  exceptionNote,
}: {
  stages: TimelineStage[];
  isException: boolean;
  exceptionLabel: string | null;
  exceptionNote?: string | null;
}) {
  return (
    <ol className="relative">
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1;
        const showExceptionFlag = isException && stage.state === "CURRENT";

        return (
          <li key={stage.status} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Connector */}
            {!isLast ? (
              <span
                aria-hidden
                className={`absolute left-[15px] top-8 h-[calc(100%-1rem)] w-0.5 ${
                  stage.passed ? "bg-accent-600" : "bg-ink-200"
                }`}
              />
            ) : null}

            {/* Marker */}
            <span
              aria-hidden
              className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 ${
                stage.state === "DONE"
                  ? "border-accent-600 bg-accent-600 text-white"
                  : stage.state === "CURRENT"
                    ? showExceptionFlag
                      ? "border-signal-600 bg-signal-50 text-signal-700"
                      : "border-accent-600 bg-white text-accent-600"
                    : "border-ink-200 bg-white text-ink-300"
              }`}
            >
              {stage.state === "DONE" ? (
                <IconCheck className="size-4" />
              ) : stage.state === "CURRENT" ? (
                showExceptionFlag ? (
                  <IconAlert className="size-4" />
                ) : (
                  <IconClock className="size-4" />
                )
              ) : (
                <span className="size-2 rounded-full bg-current" />
              )}
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3
                  className={`font-[family-name:var(--font-display)] text-[0.9375rem] font-medium ${
                    stage.state === "UPCOMING" ? "text-ink-500" : "text-ink-900"
                  }`}
                >
                  {stage.label}
                </h3>
                {stage.state === "CURRENT" && !showExceptionFlag ? (
                  <span className="rounded-full border border-accent-600 bg-accent-50 px-2 py-0.5 text-[0.6875rem] font-medium text-accent-700">
                    Current
                  </span>
                ) : null}
                {showExceptionFlag ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-signal-500 bg-signal-50 px-2 py-0.5 text-[0.6875rem] font-medium text-signal-700">
                    <IconAlert className="size-3" />
                    {exceptionLabel}
                  </span>
                ) : null}
              </div>

              {stage.state === "UPCOMING" && stage.events.length === 0 ? (
                <p className="mt-1 text-sm text-ink-500">{stage.description}</p>
              ) : null}

              {showExceptionFlag && exceptionNote ? (
                <p className="mt-2 rounded-md border border-signal-500/40 bg-signal-50 px-3 py-2 text-sm text-signal-700">
                  {exceptionNote}
                </p>
              ) : null}

              {stage.events.length > 0 ? (
                <ul className="mt-3 space-y-3">
                  {stage.events.map((event) => {
                    const LegIcon = event.leg ? MODE_ICONS[event.leg as keyof typeof MODE_ICONS] : null;
                    const eventIsException =
                      isShipmentStatus(event.status) && SHIPMENT_STATUSES[event.status].isException;

                    return (
                      <li
                        key={event.id}
                        className={`rounded-md border px-4 py-3 ${
                          eventIsException ? "border-signal-500/40 bg-signal-50" : "border-ink-200 bg-white"
                        }`}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <p className="flex items-center gap-2 font-medium text-ink-900">
                            {LegIcon ? <LegIcon className="size-4 text-ink-400" /> : null}
                            {/* Location and country share one node so the flex gap
                                cannot open a space before the comma. */}
                            <span>
                              {event.location}
                              {event.country ? <span className="text-ink-500">, {event.country}</span> : null}
                            </span>
                          </p>
                          <time
                            dateTime={new Date(event.occurredAt).toISOString()}
                            className="font-[family-name:var(--font-mono)] text-xs text-ink-600"
                          >
                            {formatDateTime(event.occurredAt)}
                          </time>
                        </div>

                        {eventIsException ? (
                          <p className="mt-1.5">
                            <StatusBadge status={event.status} size="sm" />
                          </p>
                        ) : null}

                        {event.remarks ? (
                          <p className="mt-2 text-sm leading-relaxed text-ink-600">{event.remarks}</p>
                        ) : null}

                        {event.attachments.length > 0 ? (
                          <ul className="mt-3 flex flex-wrap gap-2">
                            {event.attachments.map((attachment) => (
                              <li key={attachment.id}>
                                <a
                                  href={attachment.storagePath}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded border border-ink-200 bg-ink-50 px-2 py-1 text-xs text-ink-700 transition-colors duration-150 hover:border-accent-600 hover:text-accent-700"
                                >
                                  {attachment.caption ?? attachment.fileName}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
