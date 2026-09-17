"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, type LoginState } from "@/app/admin/actions";
import { Alert } from "@/components/ui";
import { Field, TextInput } from "@/components/form-fields";

const INITIAL: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, action] = useActionState(login, INITIAL);

  return (
    <form action={action} className="space-y-4">
      {state.status === "error" && state.message ? <Alert tone="error">{state.message}</Alert> : null}

      <Field label="Email" name="email" required error={state.errors?.email}>
        <TextInput name="email" type="email" required autoComplete="username" autoFocus error={!!state.errors?.email} />
      </Field>

      <Field label="Password" name="password" required error={state.errors?.password}>
        <TextInput name="password" type="password" required autoComplete="current-password" error={!!state.errors?.password} />
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
      className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-md bg-accent-600 font-[family-name:var(--font-display)] font-medium text-white transition-colors duration-150 hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}
