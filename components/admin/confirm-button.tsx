"use client";

import { useFormStatus } from "react-dom";

/**
 * A destructive submit that asks first. window.confirm is deliberate: a modal
 * component would be more code for a confirmation two staff members will see a
 * handful of times a year, and confirm() cannot be dismissed by accident.
 */
export function ConfirmButton({
  children,
  message,
  className = "",
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className={
        className ||
        "inline-flex h-9 cursor-pointer items-center rounded-md border border-danger-600/40 px-3 text-sm font-medium text-danger-600 transition-colors duration-150 hover:bg-danger-50 disabled:cursor-not-allowed disabled:opacity-60"
      }
    >
      {pending ? "Working…" : children}
    </button>
  );
}
