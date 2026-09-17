"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { User } from "@prisma/client";
import { Alert } from "@/components/ui";
import { Checkbox, Field, Select, TextInput } from "@/components/form-fields";
import { saveUser, type UserState } from "@/app/admin/(panel)/user-actions";
import { OFFICES, ROLES } from "@/lib/constants";

const INITIAL: UserState = { status: "idle" };

export function UserForm({ user }: { user?: User }) {
  const [state, action] = useActionState(saveUser, INITIAL);
  const e = state.errors ?? {};

  // This form is rendered once per staff member on the same page, so ids must
  // be scoped to the account or every label would point at the first form.
  const uid = (field: string) => `user-${user?.id ?? "new"}-${field}`;

  return (
    <form action={action} className="space-y-4">
      {user ? <input type="hidden" name="id" value={user.id} /> : null}

      {state.status === "error" && state.message ? <Alert tone="error">{state.message}</Alert> : null}
      {state.status === "success" && state.message ? <Alert tone="success">{state.message}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name={uid("name")} required error={e.name}>
          <TextInput name="name" id={uid("name")} required defaultValue={user?.name ?? ""} error={!!e.name} />
        </Field>
        <Field label="Email" name={uid("email")} required error={e.email}>
          <TextInput name="email" id={uid("email")} type="email" required defaultValue={user?.email ?? ""} error={!!e.email} />
        </Field>
        <Field label="Role" name={uid("role")} required error={e.role}>
          <Select name="role" id={uid("role")} required defaultValue={user?.role ?? "OPERATOR"}>
            {Object.entries(ROLES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Office" name={uid("office")} required error={e.office}>
          <Select name="office" id={uid("office")} required defaultValue={user?.office ?? "ALMATY"}>
            {Object.entries(OFFICES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label={user ? "New password" : "Password"}
        name={uid("password")}
        hint={user ? "Leave blank to keep the current password. At least 10 characters." : "At least 10 characters."}
        required={!user}
        error={e.password}
      >
        <TextInput
          name="password"
          id={uid("password")}
          type="password"
          autoComplete="new-password"
          minLength={10}
          required={!user}
          error={!!e.password}
        />
      </Field>

      <Checkbox
        name="isActive"
        label="Account is active"
        hint="Deactivating signs the person out on their next request and blocks sign-in."
        defaultChecked={user?.isActive ?? true}
      />

      <SubmitButton label={user ? "Save changes" : "Create account"} />
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
