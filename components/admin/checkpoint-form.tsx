"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Alert } from "@/components/ui";
import { Checkbox, Field, Select, Textarea, TextInput } from "@/components/form-fields";
import type { ActionState } from "@/app/admin/(panel)/shipments/actions";
import { MILESTONE_STATUSES, MODES, SHIPMENT_STATUSES, STATUS_KEYS } from "@/lib/constants";

const INITIAL: ActionState = { status: "idle" };

export function CheckpointForm({
  action,
  defaultStatus,
  defaultLocation,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  defaultStatus: string;
  defaultLocation?: string;
}) {
  const [state, formAction] = useActionState(action, INITIAL);
  const e = state.errors ?? {};

  // Default the timestamp to now, in the format datetime-local expects.
  const nowLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 16);

  return (
    <form action={formAction} className="space-y-4" key={state.status === "success" ? Date.now() : "form"}>
      {state.status === "error" && state.message ? <Alert tone="error">{state.message}</Alert> : null}
      {state.status === "success" && state.message ? <Alert tone="success">{state.message}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status reached" name="status" required error={e.status}>
          <Select name="status" required defaultValue={defaultStatus} error={!!e.status}>
            {STATUS_KEYS.map((key) => (
              <option key={key} value={key}>
                {SHIPMENT_STATUSES[key].label}
                {MILESTONE_STATUSES.includes(key) ? " ·  notifies client" : ""}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Date and time" name="occurredAt" required hint="Local time at the checkpoint" error={e.occurredAt}>
          <TextInput name="occurredAt" type="datetime-local" required defaultValue={nowLocal} error={!!e.occurredAt} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <Field label="Location" name="location" required error={e.location}>
          <TextInput
            name="location"
            required
            defaultValue={defaultLocation ?? ""}
            placeholder="e.g. Khorgos border crossing"
            error={!!e.location}
          />
        </Field>
        <Field label="Country" name="country" error={e.country}>
          <TextInput name="country" />
        </Field>
        <Field label="Leg" name="leg" hint="Mode in use" error={e.leg}>
          <Select name="leg" defaultValue="">
            <option value="">Not specified</option>
            {Object.entries(MODES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label="Remarks"
        name="remarks"
        hint="Shown to the client. For a delay, state the reason — this is what avoids the phone call."
        error={e.remarks}
      >
        <Textarea
          name="remarks"
          rows={3}
          placeholder="e.g. Cleared customs; awaiting rail wagon allocation, expected 48 hours."
        />
      </Field>

      <div className="space-y-3 rounded-md border border-ink-200 bg-ink-50 p-4">
        <Checkbox
          name="isClientVisible"
          label="Visible to the client"
          hint="Uncheck to record an internal-only note that never appears on the tracking page."
          defaultChecked
        />
        <Checkbox
          name="updateShipmentStatus"
          label="Set this as the shipment's current status"
          hint="Leave on unless you are backfilling a checkpoint that has already been superseded."
          defaultChecked
        />
        <Checkbox
          name="notifyClient"
          label="Notify the client"
          hint="Only sends for milestone statuses: Booking Confirmed, In Transit, Delivered, Delayed and On Hold."
          defaultChecked
        />
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-md bg-accent-600 px-6 font-[family-name:var(--font-display)] font-medium text-white transition-colors duration-150 hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Adding…" : "Add checkpoint"}
    </button>
  );
}
