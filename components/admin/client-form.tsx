"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Client } from "@prisma/client";
import { Alert } from "@/components/ui";
import { Field, Textarea, TextInput } from "@/components/form-fields";
import { saveClient, type ClientState } from "@/app/admin/(panel)/pipeline-actions";

const INITIAL: ClientState = { status: "idle" };

export function ClientForm({ client }: { client?: Client }) {
  const [state, action] = useActionState(saveClient, INITIAL);

  // Rendered once per client on the same page — see UserForm.
  const uid = (field: string) => `client-${client?.id ?? "new"}-${field}`;

  return (
    <form action={action} className="space-y-4">
      {client ? <input type="hidden" name="id" value={client.id} /> : null}

      {state.status === "error" && state.message ? <Alert tone="error">{state.message}</Alert> : null}
      {state.status === "success" && state.message ? <Alert tone="success">{state.message}</Alert> : null}

      <Field label="Company name" name={uid("companyName")} required>
        <TextInput name="companyName" id={uid("companyName")} required defaultValue={client?.companyName ?? ""} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Contact person" name={uid("contactPerson")}>
          <TextInput name="contactPerson" id={uid("contactPerson")} defaultValue={client?.contactPerson ?? ""} />
        </Field>
        <Field label="Email" name={uid("email")}>
          <TextInput name="email" id={uid("email")} type="email" defaultValue={client?.email ?? ""} />
        </Field>
        <Field label="Phone" name={uid("phone")}>
          <TextInput name="phone" id={uid("phone")} type="tel" defaultValue={client?.phone ?? ""} />
        </Field>
        <Field label="Country" name={uid("country")}>
          <TextInput name="country" id={uid("country")} defaultValue={client?.country ?? ""} />
        </Field>
        <Field label="City" name={uid("city")}>
          <TextInput name="city" id={uid("city")} defaultValue={client?.city ?? ""} />
        </Field>
        <Field label="Address" name={uid("addressLine")}>
          <TextInput name="addressLine" id={uid("addressLine")} defaultValue={client?.addressLine ?? ""} />
        </Field>
      </div>

      <Field label="Notes" name={uid("notes")}>
        <Textarea name="notes" id={uid("notes")} rows={2} defaultValue={client?.notes ?? ""} />
      </Field>

      <SubmitButton label={client ? "Save changes" : "Add client"} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 cursor-pointer items-center rounded-md bg-accent-600 px-5 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
