"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type FormState } from "@/app/(site)/request-a-quote/actions";
import { Alert } from "./ui";
import { Field, Textarea, TextInput } from "./form-fields";

const INITIAL: FormState = { status: "idle" };

export function ContactForm() {
  const [state, action] = useActionState(submitContact, INITIAL);

  if (state.status === "success") {
    return (
      <Alert tone="success" title="Message received">
        {state.message}
      </Alert>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="c-website">Leave this field empty</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message ? <Alert tone="error">{state.message}</Alert> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required error={state.errors?.name}>
          <TextInput name="name" required autoComplete="name" error={!!state.errors?.name} />
        </Field>
        <Field label="Company" name="company" error={state.errors?.company}>
          <TextInput name="company" autoComplete="organization" />
        </Field>
        <Field label="Email" name="email" required error={state.errors?.email}>
          <TextInput name="email" type="email" required autoComplete="email" error={!!state.errors?.email} />
        </Field>
        <Field label="Phone" name="phone" error={state.errors?.phone}>
          <TextInput name="phone" type="tel" autoComplete="tel" />
        </Field>
      </div>

      <Field label="Subject" name="subject" error={state.errors?.subject}>
        <TextInput name="subject" placeholder="e.g. Transformer movement, Almaty to Tashkent" />
      </Field>

      <Field label="Message" name="message" required error={state.errors?.message}>
        <Textarea name="message" rows={6} required error={!!state.errors?.message} />
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
      className="inline-flex h-12 cursor-pointer items-center justify-center rounded-md bg-accent-600 px-7 font-[family-name:var(--font-display)] font-medium text-white transition-colors duration-150 hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}
