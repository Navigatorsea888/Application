"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Attachment } from "@prisma/client";
import { Alert } from "@/components/ui";
import { ConfirmButton } from "./confirm-button";
import { IconDownload, IconPlus } from "@/components/icons";
import {
  addAttachments,
  deleteAttachment,
  toggleAttachmentVisibility,
  type ActionState,
} from "@/app/admin/(panel)/shipments/actions";
import { formatBytes } from "@/lib/format";

const INITIAL: ActionState = { status: "idle" };

const ACCEPT = "image/jpeg,image/png,image/webp,image/heic,application/pdf";

/**
 * Attachments for one checkpoint. Loading photographs, permits and PODs are the
 * evidence an OOG movement is judged on; they default to internal-only and are
 * released to the client deliberately.
 */
export function AttachmentPanel({
  checkpointId,
  shipmentId,
  attachments,
  canEdit,
}: {
  checkpointId: string;
  shipmentId: string;
  attachments: Attachment[];
  canEdit: boolean;
}) {
  const action = addAttachments.bind(null, checkpointId, shipmentId);
  const [state, formAction] = useActionState(action, INITIAL);
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      {attachments.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {attachments.map((attachment) => {
            const removeAction = deleteAttachment.bind(null, attachment.id, shipmentId);
            const toggleAction = toggleAttachmentVisibility.bind(null, attachment.id, shipmentId);

            return (
              <li
                key={attachment.id}
                className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs ${
                  attachment.isClientVisible
                    ? "border-accent-200 bg-accent-50"
                    : "border-ink-200 bg-ink-50"
                }`}
              >
                <a
                  href={attachment.storagePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-medium text-ink-800 underline underline-offset-2 hover:text-accent-700"
                >
                  <IconDownload className="size-3.5 shrink-0" />
                  <span className="max-w-[12rem] truncate">{attachment.caption || attachment.fileName}</span>
                </a>
                <span className="text-ink-500">{formatBytes(attachment.sizeBytes)}</span>

                {canEdit ? (
                  <>
                    <form action={toggleAction}>
                      <button
                        type="submit"
                        title={
                          attachment.isClientVisible
                            ? "Currently visible to the client — click to make internal"
                            : "Internal only — click to release to the client"
                        }
                        className="cursor-pointer rounded px-1.5 py-0.5 text-[0.6875rem] font-medium text-ink-600 transition-colors duration-150 hover:bg-white"
                      >
                        {attachment.isClientVisible ? "Client ✓" : "Internal"}
                      </button>
                    </form>
                    <form action={removeAction}>
                      <ConfirmButton
                        message={`Delete ${attachment.fileName}? The file is removed permanently.`}
                        className="cursor-pointer rounded px-1 text-[0.6875rem] font-medium text-danger-600 transition-colors duration-150 hover:bg-white"
                      >
                        ×
                      </ConfirmButton>
                    </form>
                  </>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      {canEdit ? (
        <div className="mt-2">
          {open ? (
            <form action={formAction} className="space-y-2.5 rounded-md border border-ink-200 bg-ink-50 p-3">
              {state.status === "error" && state.message ? (
                <Alert tone="error">{state.message}</Alert>
              ) : null}
              {state.status === "success" && state.message ? (
                <Alert tone="success">{state.message}</Alert>
              ) : null}

              <div>
                <label
                  htmlFor={`files-${checkpointId}`}
                  className="block text-xs font-medium text-ink-700"
                >
                  Photos or documents
                </label>
                <input
                  id={`files-${checkpointId}`}
                  name="files"
                  type="file"
                  multiple
                  required
                  accept={ACCEPT}
                  className="mt-1 w-full cursor-pointer rounded-md border border-ink-300 bg-white px-2 py-1.5 text-xs file:mr-2 file:cursor-pointer file:rounded file:border-0 file:bg-ink-100 file:px-2 file:py-1 file:text-xs file:font-medium"
                />
                <p className="mt-1 text-[0.6875rem] text-ink-500">
                  JPEG, PNG, WebP, HEIC or PDF · up to 10 MB each · 10 files at a time
                </p>
              </div>

              <div>
                <label
                  htmlFor={`caption-${checkpointId}`}
                  className="block text-xs font-medium text-ink-700"
                >
                  Caption
                </label>
                <input
                  id={`caption-${checkpointId}`}
                  name="caption"
                  type="text"
                  placeholder="e.g. Loading at Jinan works, 12 Sept"
                  className="mt-1 w-full rounded-md border border-ink-300 bg-white px-2 py-1.5 text-xs"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-2 text-xs text-ink-700">
                <input
                  type="checkbox"
                  name="isClientVisible"
                  className="mt-0.5 size-3.5 cursor-pointer accent-[#0369a1]"
                />
                <span>
                  Show to the client on the tracking page
                  <span className="block text-[0.6875rem] text-ink-500">
                    Off by default. Documents often carry commercial detail.
                  </span>
                </span>
              </label>

              <div className="flex gap-2">
                <UploadButton />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-8 cursor-pointer items-center rounded-md border border-ink-300 bg-white px-3 text-xs font-medium text-ink-700 transition-colors duration-150 hover:bg-ink-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded px-1 py-0.5 text-xs font-medium text-accent-600 transition-colors duration-150 hover:text-accent-700"
            >
              <IconPlus className="size-3.5" />
              Attach photo or document
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

function UploadButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-8 cursor-pointer items-center rounded-md bg-accent-600 px-3 text-xs font-medium text-white transition-colors duration-150 hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Uploading…" : "Upload"}
    </button>
  );
}
