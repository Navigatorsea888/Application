"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { submitQuoteRequest, type FormState } from "@/app/(site)/request-a-quote/actions";
import { Alert, buttonClass } from "../ui";
import { Checkbox, Field, FormSection, Select, Textarea, TextInput, controlClass } from "../form-fields";
import { INCOTERMS, LANGUAGES, QUOTE_SERVICE_TYPES } from "@/lib/constants";
import { formatBytes } from "@/lib/format";

/* -------------------------------------------------------------------------
   Seven-step "Request a Quote" wizard.

   Every step's controls are in the DOM from the start; inactive steps carry
   the `hidden` attribute. That way one <form> submission carries the whole
   enquiry, the browser's own validation runs on each step as the visitor
   moves through it, and nothing typed on step 2 is lost by the time they
   reach step 7.

   The form is submitted from onSubmit inside a transition rather than via the
   `action` prop. React resets an uncontrolled form once an `action` completes,
   which would wipe all seven steps on a server-side validation error.
------------------------------------------------------------------------- */

const INITIAL: FormState = { status: "idle" };

const STEPS = [
  { key: "service", label: "Service", title: "Which service do you need?" },
  { key: "route", label: "Route", title: "Where is the cargo going?" },
  { key: "cargo", label: "Cargo", title: "Tell us about the cargo" },
  { key: "special", label: "Special requirements", title: "Anything that needs special handling?" },
  { key: "timing", label: "Timing", title: "When does it need to move?" },
  { key: "attachments", label: "Attachments", title: "Drawings, packing list, SDS, photos" },
  { key: "contact", label: "Contact", title: "How do we reach you?" },
] as const;

const ATTACHMENTS_STEP = 5;

/**
 * Mirrors QUOTE_ALLOWED_MIME_TYPES and the limits in lib/uploads.ts, which is
 * server-only and cannot be imported here. The server re-checks everything;
 * this copy exists so a visitor hears about an oversized file before uploading it.
 */
const ACCEPTED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/heic": ".heic",
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};
const ACCEPT_ATTRIBUTE = [...Object.keys(ACCEPTED_TYPES), ".jpg", ".jpeg", ...Object.values(ACCEPTED_TYPES)].join(",");
const ACCEPTED_LABEL = "PDF, JPEG, PNG, WebP, HEIC, XLSX, XLS or DOCX";
const MAX_FILES = 10;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function controlsIn(panel: HTMLElement | null): FormControl[] {
  if (!panel) return [];
  return Array.from(panel.querySelectorAll<FormControl>("input, select, textarea"));
}

function attachmentsProblem(files: File[]): string | null {
  if (files.length > MAX_FILES) return `Attach at most ${MAX_FILES} files.`;
  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total > MAX_TOTAL_BYTES) {
    return `Your files total ${formatBytes(total)}. The limit for one request is ${formatBytes(MAX_TOTAL_BYTES)}. Remove a file or send the rest by email once you have your reference.`;
  }
  const rejected = files.find((f) => f.type && !ACCEPTED_TYPES[f.type]);
  if (rejected) return `"${rejected.name}" is not an accepted type. Attach ${ACCEPTED_LABEL}.`;
  return null;
}

export function QuoteWizard({ defaultServiceType }: { defaultServiceType?: string }) {
  const [state, formAction, isPending] = useActionState(submitQuoteRequest, INITIAL);
  const [step, setStep] = useState(0);
  const [dangerousGoods, setDangerousGoods] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const panels = useRef<Array<HTMLDivElement | null>>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  /** A control to report on once its step is visible. */
  const pendingReport = useRef<FormControl | null>(null);
  const hasMoved = useRef(false);

  const preselected =
    defaultServiceType && Object.prototype.hasOwnProperty.call(QUOTE_SERVICE_TYPES, defaultServiceType)
      ? defaultServiceType
      : undefined;

  const fileProblem = attachmentsProblem(files);

  // When the server returns field errors, open the first step that has one.
  useEffect(() => {
    if (state.status !== "error" || !state.errors) return;
    const names = Object.keys(state.errors);
    const index = panels.current.findIndex((panel) =>
      controlsIn(panel).some((control) => names.includes(control.name)),
    );
    if (index >= 0) setStep(index);
  }, [state]);

  // After a step change: move focus to the step heading, then surface any
  // browser validation message that was waiting for the control to be visible.
  useEffect(() => {
    if (!hasMoved.current) return;
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    const control = pendingReport.current;
    if (control) {
      pendingReport.current = null;
      control.reportValidity();
    }
  }, [step]);

  function go(index: number) {
    hasMoved.current = true;
    setStep(Math.max(0, Math.min(STEPS.length - 1, index)));
  }

  /** Browser validation for the visible step only. */
  function visibleStepIsValid(): boolean {
    for (const control of controlsIn(panels.current[step])) {
      if (!control.checkValidity()) {
        control.reportValidity();
        return false;
      }
    }
    if (step === ATTACHMENTS_STEP && fileProblem) {
      fileInput.current?.focus();
      return false;
    }
    return true;
  }

  function next() {
    if (visibleStepIsValid()) go(step + 1);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    // Every step must be valid, not only the visible one; a visitor may have
    // gone back and cleared something. Jump to the first offending step.
    for (let index = 0; index < panels.current.length; index++) {
      for (const control of controlsIn(panels.current[index])) {
        if (!control.checkValidity()) {
          if (index === step) control.reportValidity();
          else {
            pendingReport.current = control;
            go(index);
          }
          return;
        }
      }
    }
    if (fileProblem) {
      go(ATTACHMENTS_STEP);
      return;
    }

    const payload = new FormData(form);
    startTransition(() => formAction(payload));
  }

  function handleFilesChange() {
    setFiles(Array.from(fileInput.current?.files ?? []));
  }

  function clearFiles() {
    if (fileInput.current) fileInput.current.value = "";
    setFiles([]);
  }

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-success-600/30 bg-success-50 px-7 py-10 text-center" role="status">
        <h2 className="text-xl text-success-700">Request received</h2>
        {state.reference ? (
          <p className="mt-3 font-[family-name:var(--font-mono)] text-2xl font-medium text-ink-900">{state.reference}</p>
        ) : null}
        <p className="mx-auto mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ink-700">{state.message}</p>
        <p className="mt-4 text-sm text-ink-600">Quote your reference in any follow-up.</p>
        {state.warning ? (
          <div className="mx-auto mt-6 max-w-lg text-left">
            <Alert tone="warning">{state.warning}</Alert>
          </div>
        ) : null}
      </div>
    );
  }

  const errors = state.errors ?? {};
  const isLast = step === STEPS.length - 1;

  return (
    <form onSubmit={handleSubmit} action={formAction} className="space-y-8" aria-describedby="quote-progress">
      {/* Honeypot */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="q-website">Leave this field empty</label>
        <input id="q-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <StepIndicator current={step} />

      <h2
        ref={heading}
        tabIndex={-1}
        className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink-900 outline-none"
      >
        {STEPS[step].title}
      </h2>

      {state.status === "error" && state.message ? <Alert tone="error">{state.message}</Alert> : null}

      {/* 1. Service ------------------------------------------------------- */}
      <div ref={(el) => { panels.current[0] = el; }} hidden={step !== 0}>
        <fieldset>
          <legend className="font-[family-name:var(--font-display)] text-sm font-medium text-ink-800">
            Service <span className="ml-1 text-danger-600" aria-hidden>*</span>
          </legend>
          <p className="mt-0.5 text-xs text-ink-500">Choose the closest match. We will confirm the routing with you.</p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {Object.entries(QUOTE_SERVICE_TYPES).map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-start gap-3 rounded-md border border-ink-300 px-4 py-3 transition-colors duration-150 hover:border-ink-400 hover:bg-ink-50 has-checked:border-accent-600 has-checked:bg-accent-50"
              >
                <input
                  type="radio"
                  name="serviceType"
                  value={key}
                  required
                  defaultChecked={key === preselected}
                  className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[#0369a1]"
                />
                <span className="text-sm font-medium text-ink-800">{label}</span>
              </label>
            ))}
          </div>
          {errors.serviceType ? <p className="mt-2 text-sm text-danger-600">{errors.serviceType}</p> : null}
        </fieldset>
      </div>

      {/* 2. Route --------------------------------------------------------- */}
      <div ref={(el) => { panels.current[1] = el; }} hidden={step !== 1}>
        <FormSection title="Route" description="Where the cargo starts and where it must end up.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Origin country" name="originCountry" required error={errors.originCountry}>
              <TextInput name="originCountry" required autoComplete="off" error={!!errors.originCountry} />
            </Field>
            <Field label="Origin city" name="originCity" required error={errors.originCity}>
              <TextInput name="originCity" required autoComplete="off" error={!!errors.originCity} />
            </Field>
            <Field label="Destination country" name="destinationCountry" required error={errors.destinationCountry}>
              <TextInput name="destinationCountry" required autoComplete="off" error={!!errors.destinationCountry} />
            </Field>
            <Field label="Destination city" name="destinationCity" required error={errors.destinationCity}>
              <TextInput name="destinationCity" required autoComplete="off" error={!!errors.destinationCity} />
            </Field>
          </div>
          <Field label="Incoterm" name="incoterms" hint="Optional — if already agreed with your counterparty" error={errors.incoterms}>
            <Select name="incoterms" defaultValue="" className="sm:max-w-xs">
              <option value="">Not yet agreed</option>
              {INCOTERMS.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </Select>
          </Field>
        </FormSection>
      </div>

      {/* 3. Cargo --------------------------------------------------------- */}
      <div ref={(el) => { panels.current[2] = el; }} hidden={step !== 2}>
        <FormSection
          title="Cargo"
          description="Dimensions and weight decide whether a movement is possible and how long the permits take. Approximate figures are fine at this stage."
        >
          <Field label="Cargo description" name="cargoDescription" required error={errors.cargoDescription}>
            <Textarea
              name="cargoDescription"
              rows={3}
              required
              maxLength={2000}
              placeholder="e.g. 2 × power transformers, 1 × control cabin, associated accessories"
              error={!!errors.cargoDescription}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="HS code" name="hsCode" hint="Optional" error={errors.hsCode}>
              <TextInput name="hsCode" maxLength={20} placeholder="e.g. 8504.23" error={!!errors.hsCode} />
            </Field>
            <Field label="Number of pieces" name="packageCount" error={errors.packageCount}>
              <TextInput name="packageCount" type="number" min={0} step={1} inputMode="numeric" error={!!errors.packageCount} />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Length (m)" name="lengthM" error={errors.lengthM}>
              <TextInput name="lengthM" type="number" min={0} step={0.01} inputMode="decimal" error={!!errors.lengthM} />
            </Field>
            <Field label="Width (m)" name="widthM" error={errors.widthM}>
              <TextInput name="widthM" type="number" min={0} step={0.01} inputMode="decimal" error={!!errors.widthM} />
            </Field>
            <Field label="Height (m)" name="heightM" error={errors.heightM}>
              <TextInput name="heightM" type="number" min={0} step={0.01} inputMode="decimal" error={!!errors.heightM} />
            </Field>
          </div>

          <Field
            label="Weight per piece"
            name="weightPerPieceKg"
            hint="kg per piece (1 t = 1,000 kg)"
            error={errors.weightPerPieceKg}
            className="sm:max-w-xs"
          >
            <TextInput name="weightPerPieceKg" type="number" min={0} step="any" inputMode="decimal" error={!!errors.weightPerPieceKg} />
          </Field>
        </FormSection>
      </div>

      {/* 4. Special requirements ------------------------------------------ */}
      <div
        ref={(el) => { panels.current[3] = el; }}
        hidden={step !== 3}
        onChange={(event) => {
          const target = event.target as HTMLInputElement;
          if (target.name === "isDangerousGoods") setDangerousGoods(target.checked);
        }}
      >
        <FormSection title="Special requirements" description="Tick everything that applies. Leave all unticked for general cargo.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Checkbox name="isOOG" label="Out-of-gauge" hint="Any piece beyond standard container or road dimensions" />
            <Checkbox name="isDangerousGoods" label="Dangerous goods" hint="We will ask for the UN number" />
            <Checkbox name="isTemperatureControlled" label="Temperature-controlled" />
            <Checkbox name="isBulkLiquid" label="Liquid in bulk" />
            <Checkbox name="insuranceRequired" label="Insurance required" hint="Cargo insurance arranged through us" />
          </div>

          <div hidden={!dangerousGoods}>
            <Field
              label="UN number"
              name="unNumber"
              required={dangerousGoods}
              hint="Four digits, as on the SDS"
              error={errors.unNumber}
              className="sm:max-w-xs"
            >
              <TextInput
                name="unNumber"
                placeholder="UN 1234"
                required={dangerousGoods}
                pattern="([Uu][Nn] ?)?[0-9]{4}"
                title="A four-digit UN number, e.g. UN 1234"
                autoComplete="off"
                error={!!errors.unNumber}
              />
            </Field>
          </div>
        </FormSection>
      </div>

      {/* 5. Timing -------------------------------------------------------- */}
      <div ref={(el) => { panels.current[4] = el; }} hidden={step !== 4}>
        <FormSection title="Timing" description="Approximate dates are fine; they tell us how much permit lead time we have.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Cargo ready date" name="cargoReadyDate" error={errors.cargoReadyDate}>
              <TextInput name="cargoReadyDate" type="date" error={!!errors.cargoReadyDate} />
            </Field>
            <Field label="Required delivery date" name="requiredByDate" error={errors.requiredByDate}>
              <TextInput name="requiredByDate" type="date" error={!!errors.requiredByDate} />
            </Field>
          </div>
        </FormSection>
      </div>

      {/* 6. Attachments --------------------------------------------------- */}
      <div ref={(el) => { panels.current[5] = el; }} hidden={step !== 5}>
        <FormSection
          title="Attachments"
          description="Optional, but drawings and a packing list are what let us quote accurately first time."
        >
          <Field
            label="Files"
            name="attachments"
            hint={`Drawings, packing list, SDS, photos. ${ACCEPTED_LABEL}; up to ${MAX_FILES} files and ${formatBytes(MAX_TOTAL_BYTES)} in total.`}
            error={fileProblem ?? errors.attachments}
          >
            {/* A plain input rather than TextInput: the live file list needs a ref. */}
            <input
              ref={fileInput}
              id="attachments"
              name="attachments"
              type="file"
              multiple
              accept={ACCEPT_ATTRIBUTE}
              onChange={handleFilesChange}
              aria-invalid={fileProblem || errors.attachments ? true : undefined}
              aria-describedby={fileProblem || errors.attachments ? "attachments-error" : "attachments-hint"}
              className={controlClass(
                !!(fileProblem ?? errors.attachments),
                "h-11 cursor-pointer py-2 file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-ink-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-ink-800",
              )}
            />
          </Field>

          {files.length > 0 ? (
            <div className="rounded-md border border-ink-200 bg-ink-50 px-4 py-3">
              <ul className="divide-y divide-ink-200 text-sm" aria-label="Chosen files">
                {files.map((file, index) => (
                  <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-4 py-1.5">
                    <span className="min-w-0 truncate text-ink-800">{file.name}</span>
                    <span className="shrink-0 font-[family-name:var(--font-mono)] text-xs text-ink-500">
                      {formatBytes(file.size)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-center justify-between gap-4 border-t border-ink-200 pt-2 text-xs">
                <span className={fileProblem ? "font-medium text-danger-600" : "text-ink-600"}>
                  {files.length} file{files.length === 1 ? "" : "s"} ·{" "}
                  {formatBytes(files.reduce((sum, f) => sum + f.size, 0))} of {formatBytes(MAX_TOTAL_BYTES)}
                </span>
                <button type="button" onClick={clearFiles} className="cursor-pointer text-accent-600 underline underline-offset-2">
                  Remove all
                </button>
              </div>
            </div>
          ) : null}
        </FormSection>
      </div>

      {/* 7. Contact ------------------------------------------------------- */}
      <div ref={(el) => { panels.current[6] = el; }} hidden={step !== 6}>
        <FormSection title="Contact" description="Who should the quotation go to?">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" name="contactPerson" required error={errors.contactPerson}>
              <TextInput name="contactPerson" required autoComplete="name" error={!!errors.contactPerson} />
            </Field>
            <Field label="Company" name="companyName" required error={errors.companyName}>
              <TextInput name="companyName" required autoComplete="organization" error={!!errors.companyName} />
            </Field>
            <Field label="Position" name="contactPosition" error={errors.contactPosition}>
              <TextInput name="contactPosition" autoComplete="organization-title" error={!!errors.contactPosition} />
            </Field>
            <Field label="Email" name="email" required error={errors.email}>
              <TextInput name="email" type="email" required autoComplete="email" error={!!errors.email} />
            </Field>
            <Field label="Phone / WhatsApp" name="phone" hint="Include the country code" error={errors.phone}>
              <TextInput name="phone" type="tel" autoComplete="tel" placeholder="+7 ..." error={!!errors.phone} />
            </Field>
            <Field label="Preferred language" name="preferredLanguage" error={errors.preferredLanguage}>
              <Select name="preferredLanguage" defaultValue="EN" error={!!errors.preferredLanguage}>
                {Object.entries(LANGUAGES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </FormSection>
      </div>

      {/* Navigation ------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink-200 pt-6">
        <button
          type="button"
          onClick={() => go(step - 1)}
          disabled={step === 0 || isPending}
          className={buttonClass("secondary", "lg")}
        >
          Back
        </button>

        <div className="flex flex-wrap items-center gap-4">
          {isLast ? (
            <p className="text-xs text-ink-500">Submitting this form does not create a contract or reserve capacity.</p>
          ) : null}
          {isLast ? (
            <button type="submit" disabled={isPending} className={buttonClass("gold", "lg")}>
              {isPending ? "Sending…" : "Submit request"}
            </button>
          ) : (
            <button type="button" onClick={next} className={buttonClass("gold", "lg")}>
              Continue
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <nav aria-label="Form progress" id="quote-progress">
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-ink-500 sm:hidden">
        Step {current + 1} of {STEPS.length} — {STEPS[current].label}
      </p>
      <ol className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-2 sm:mt-0">
        {STEPS.map((s, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={s.key} aria-current={active ? "step" : undefined} className="flex items-center gap-1">
              <span className="flex items-center gap-2">
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full font-[family-name:var(--font-mono)] text-xs font-medium ${
                    active
                      ? "bg-accent-600 text-white"
                      : done
                        ? "bg-accent-50 text-accent-700 ring-1 ring-accent-600/40"
                        : "bg-ink-100 text-ink-500"
                  }`}
                >
                  {index + 1}
                </span>
                <span
                  className={`hidden text-xs sm:inline ${active ? "font-semibold text-ink-900" : done ? "text-ink-700" : "text-ink-500"}`}
                >
                  {s.label}
                </span>
              </span>
              {index < STEPS.length - 1 ? (
                <span aria-hidden className="mx-1 hidden h-px w-4 bg-ink-300 lg:inline-block" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
