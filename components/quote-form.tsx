"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitQuoteRequest, type FormState } from "@/app/(site)/quote/actions";
import { Alert } from "./ui";
import { Checkbox, CheckboxGroup, Field, FormSection, Select, Textarea, TextInput } from "./form-fields";
import { INCOTERMS, MODES } from "@/lib/constants";
import { IconArrowRight } from "./icons";

const INITIAL: FormState = { status: "idle" };

const MODE_OPTIONS = Object.entries(MODES).map(([value, label]) => ({ value, label }));

export function QuoteForm() {
  const [state, action] = useActionState(submitQuoteRequest, INITIAL);

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-success-600/30 bg-success-50 px-7 py-10 text-center">
        <h2 className="text-xl text-success-700">Request received</h2>
        {state.reference ? (
          <p className="mt-3 font-[family-name:var(--font-mono)] text-lg text-ink-900">{state.reference}</p>
        ) : null}
        <p className="mx-auto mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-ink-700">{state.message}</p>
        <p className="mt-4 text-sm text-ink-600">
          Quote your reference in any follow-up so we can find the enquiry quickly.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-8">
      {/* Honeypot */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="q-website">Leave this field empty</label>
        <input id="q-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message ? <Alert tone="error">{state.message}</Alert> : null}

      <FormSection title="Your details">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Company" name="companyName" required error={state.errors?.companyName}>
            <TextInput name="companyName" required autoComplete="organization" error={!!state.errors?.companyName} />
          </Field>
          <Field label="Contact person" name="contactPerson" required error={state.errors?.contactPerson}>
            <TextInput name="contactPerson" required autoComplete="name" error={!!state.errors?.contactPerson} />
          </Field>
          <Field label="Email" name="email" required error={state.errors?.email}>
            <TextInput name="email" type="email" required autoComplete="email" error={!!state.errors?.email} />
          </Field>
          <Field label="Phone" name="phone" hint="Include the country code" error={state.errors?.phone}>
            <TextInput name="phone" type="tel" autoComplete="tel" placeholder="+7 ..." />
          </Field>
          <Field label="Country" name="country" error={state.errors?.country}>
            <TextInput name="country" autoComplete="country-name" />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Route" description="Where the cargo starts and where it must end up.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Origin city" name="originCity" required error={state.errors?.originCity}>
            <TextInput name="originCity" required error={!!state.errors?.originCity} />
          </Field>
          <Field label="Origin country" name="originCountry" required error={state.errors?.originCountry}>
            <TextInput name="originCountry" required error={!!state.errors?.originCountry} />
          </Field>
          <Field label="Destination city" name="destinationCity" required error={state.errors?.destinationCity}>
            <TextInput name="destinationCity" required error={!!state.errors?.destinationCity} />
          </Field>
          <Field label="Destination country" name="destinationCountry" required error={state.errors?.destinationCountry}>
            <TextInput name="destinationCountry" required error={!!state.errors?.destinationCountry} />
          </Field>
        </div>
        <CheckboxGroup
          legend="Preferred modes of transport"
          name="preferredModes"
          options={MODE_OPTIONS}
          columns={2}
        />
      </FormSection>

      <FormSection
        title="Cargo"
        description="Dimensions and weight are what determine whether a movement is possible and how long the permits take. Approximate figures are fine at this stage."
      >
        <Field label="Cargo description" name="cargoDescription" required error={state.errors?.cargoDescription}>
          <Textarea
            name="cargoDescription"
            rows={3}
            required
            placeholder="e.g. 2 × power transformers, 1 × control cabin, associated accessories"
            error={!!state.errors?.cargoDescription}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Commodity" name="commodity" hint="e.g. transformer, turbine, drilling equipment">
            <TextInput name="commodity" />
          </Field>
          <Field label="Number of pieces" name="packageCount" error={state.errors?.packageCount}>
            <TextInput name="packageCount" type="number" min={0} step={1} inputMode="numeric" />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Weight (kg)" name="weightKg" hint="Heaviest piece" error={state.errors?.weightKg}>
            <TextInput name="weightKg" type="number" min={0} step="any" inputMode="decimal" />
          </Field>
          <Field label="Length (cm)" name="lengthCm" error={state.errors?.lengthCm}>
            <TextInput name="lengthCm" type="number" min={0} step="any" inputMode="decimal" />
          </Field>
          <Field label="Width (cm)" name="widthCm" error={state.errors?.widthCm}>
            <TextInput name="widthCm" type="number" min={0} step="any" inputMode="decimal" />
          </Field>
          <Field label="Height (cm)" name="heightCm" error={state.errors?.heightCm}>
            <TextInput name="heightCm" type="number" min={0} step="any" inputMode="decimal" />
          </Field>
        </div>

        <Checkbox
          name="isOOG"
          label="This cargo is out of gauge or heavy lift"
          hint="Tick if any piece exceeds standard container or road dimensions. Dimensional drawings help considerably — you can send them by email once we acknowledge."
        />
      </FormSection>

      <FormSection title="Timing and terms">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Required delivery date" name="requiredByDate" hint="Approximate is fine" error={state.errors?.requiredByDate}>
            <TextInput name="requiredByDate" type="date" />
          </Field>
          <Field label="Incoterms" name="incoterms" hint="If already agreed">
            <Select name="incoterms" defaultValue="">
              <option value="">Not yet agreed</option>
              {INCOTERMS.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Anything else we should know" name="additionalInfo" error={state.errors?.additionalInfo}>
          <Textarea
            name="additionalInfo"
            rows={4}
            placeholder="Site access constraints, lifting arrangements at destination, project name, tender deadline…"
          />
        </Field>
      </FormSection>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton />
        <p className="text-xs text-ink-500">
          Submitting this form does not create a contract or reserve capacity.
        </p>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-accent-600 px-7 font-[family-name:var(--font-display)] font-medium text-white transition-colors duration-150 hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Submit request"}
      {pending ? null : <IconArrowRight className="size-4" />}
    </button>
  );
}
