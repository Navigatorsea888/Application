import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes } from "react";

/* -------------------------------------------------------------------------
   Form primitives.

   Every field carries a visible label (placeholders are not labels), errors
   render next to the field they belong to rather than in a summary at the
   top, and the error is wired to the input with aria-describedby so screen
   readers announce it.
------------------------------------------------------------------------- */

const CONTROL_BASE =
  "w-full rounded-md border bg-white px-3 text-[0.9375rem] text-ink-900 transition-colors duration-150 placeholder:text-ink-400 disabled:bg-ink-100 disabled:text-ink-500";

export function controlClass(hasError = false, extra = "") {
  const border = hasError
    ? "border-danger-600 focus:border-danger-600"
    : "border-ink-300 hover:border-ink-400 focus:border-accent-600";
  return `${CONTROL_BASE} ${border} ${extra}`.trim();
}

/**
 * `name` is the control's DOM id as well as its form field name, which is what
 * ties the <label>, the hint and the error message together. Where the same
 * form is rendered more than once on a page (one per row on the staff and
 * client screens), pass a unique `name` here and give the control a matching
 * `id` with its own plain `name` — see UserForm.
 */
export function Field({
  label,
  name,
  hint,
  error,
  required,
  children,
  className = "",
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block font-[family-name:var(--font-display)] text-sm font-medium text-ink-800">
        {label}
        {required ? (
          <span className="ml-1 text-danger-600" aria-hidden>
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={`${name}-hint`} className="mt-0.5 text-xs text-ink-500">
          {hint}
        </p>
      ) : null}
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-danger-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Controls default their id to their `name`, so the common case needs no extra
 * wiring. An explicit `id` wins, and the error message is looked up from
 * whichever is in force — so a label and its error can never point at
 * different elements.
 */
function describedBy(id: string, error?: boolean): string | undefined {
  return error ? `${id}-error` : undefined;
}

export function TextInput({
  name,
  error,
  className = "",
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { name: string; error?: boolean }) {
  const controlId = id ?? name;
  return (
    <input
      id={controlId}
      name={name}
      aria-invalid={error || undefined}
      aria-describedby={describedBy(controlId, error)}
      className={controlClass(error, `h-11 ${className}`)}
      {...props}
    />
  );
}

export function Textarea({
  name,
  error,
  className = "",
  id,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { name: string; error?: boolean }) {
  const controlId = id ?? name;
  return (
    <textarea
      id={controlId}
      name={name}
      aria-invalid={error || undefined}
      aria-describedby={describedBy(controlId, error)}
      className={controlClass(error, `py-2.5 leading-relaxed ${className}`)}
      {...props}
    />
  );
}

export function Select({
  name,
  error,
  className = "",
  children,
  id,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { name: string; error?: boolean }) {
  const controlId = id ?? name;
  return (
    <select
      id={controlId}
      name={name}
      aria-invalid={error || undefined}
      aria-describedby={describedBy(controlId, error)}
      className={controlClass(error, `h-11 cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-9 ${className}`)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  );
}

export function Checkbox({
  name,
  label,
  hint,
  defaultChecked,
  value = "on",
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
  value?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-ink-300 text-accent-600 accent-[#0369a1]"
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink-800">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">{hint}</span> : null}
      </span>
    </label>
  );
}

/** Checkbox group used for modes and corridors, which are multi-valued. */
export function CheckboxGroup({
  legend,
  name,
  options,
  selected = [],
  error,
  columns = 2,
}: {
  legend: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  selected?: readonly string[];
  error?: string;
  columns?: number;
}) {
  return (
    <fieldset>
      <legend className="font-[family-name:var(--font-display)] text-sm font-medium text-ink-800">{legend}</legend>
      <div
        className="mt-2 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2.5 rounded-md border border-ink-300 px-3 py-2.5 text-sm transition-colors duration-150 hover:border-ink-400 hover:bg-ink-50 has-checked:border-accent-600 has-checked:bg-accent-50"
          >
            <input
              type="checkbox"
              name={name}
              value={option.value}
              defaultChecked={selected.includes(option.value)}
              className="size-4 shrink-0 cursor-pointer rounded border-ink-300 accent-[#0369a1]"
            />
            <span className="text-ink-800">{option.label}</span>
          </label>
        ))}
      </div>
      {error ? <p className="mt-1.5 text-sm text-danger-600">{error}</p> : null}
    </fieldset>
  );
}

/** Groups related fields on the long shipment form. */
export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-ink-200 pb-8 last:border-b-0 last:pb-0">
      <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-ink-900">{title}</h2>
      {description ? <p className="mt-1 text-sm text-ink-500">{description}</p> : null}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}
