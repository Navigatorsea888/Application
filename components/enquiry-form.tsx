"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry, type EnquiryState } from "@/app/(site)/track/actions";
import { Alert } from "./ui";
import { Field, Textarea, TextInput } from "./form-fields";

const INITIAL: EnquiryState = { status: "idle" };

/** Raised from a tracking result, pre-filled with the Tracking ID. */
export function EnquiryForm({ trackingRef }: { trackingRef: string }) {
  const [state, action] = useActionState(submitEnquiry, INITIAL);

  if (state.status === "success") {
    return (
      <Alert tone="success" title="Message sent">
        {state.message}
      </Alert>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="trackingRef" value={trackingRef} />
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="enq-website">Leave this field empty</label>
        <input id="enq-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message ? <Alert tone="error">{state.message}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" required error={state.errors?.name}>
          <TextInput name="name" required autoComplete="name" />
        </Field>
        <Field label="Email" name="email" required error={state.errors?.email}>
          <TextInput name="email" type="email" required autoComplete="email" />
        </Field>
      </div>

      <Field label="Phone" name="phone" hint="Optional" error={state.errors?.phone}>
        <TextInput name="phone" type="tel" autoComplete="tel" />
      </Field>

      <Field label="Message" name="message" required error={state.errors?.message}>
        <Textarea name="message" rows={5} required placeholder="What would you like to know about this shipment?" />
      </Field>

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
      className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md bg-accent-600 px-6 font-[family-name:var(--font-display)] font-medium text-white transition-colors duration-150 hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}
