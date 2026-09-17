"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Shipment } from "@prisma/client";
import { Alert, Card } from "@/components/ui";
import { Checkbox, CheckboxGroup, Field, FormSection, Select, Textarea, TextInput } from "@/components/form-fields";
import type { ActionState } from "@/app/admin/(panel)/shipments/actions";
import {
  CORRIDORS,
  MODES,
  PACKAGE_TYPES,
  SHIPMENT_STATUSES,
  STATUS_KEYS,
  parseList,
} from "@/lib/constants";
import { toDateInputValue } from "@/lib/format";

const INITIAL: ActionState = { status: "idle" };

const MODE_OPTIONS = Object.entries(MODES).map(([value, label]) => ({ value, label }));
const CORRIDOR_OPTIONS = Object.entries(CORRIDORS).map(([value, label]) => ({ value, label }));

export interface ShipmentFormProps {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  shipment?: Shipment | null;
  owners: Array<{ id: string; name: string }>;
  clients: Array<{ id: string; companyName: string }>;
  submitLabel: string;
  cancelHref: string;
}

/**
 * Shared create/edit form. One component for both so the two screens cannot
 * drift apart — a field added here appears on both.
 */
export function ShipmentForm({ action, shipment, owners, clients, submitLabel, cancelHref }: ShipmentFormProps) {
  const [state, formAction] = useActionState(action, INITIAL);
  const e = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" && state.message ? <Alert tone="error">{state.message}</Alert> : null}

      <Card className="p-6">
        <FormSection
          title="References"
          description="The Tracking ID is generated automatically. These are the references you and the client actually use."
        >
          {shipment ? (
            <div className="rounded-md border border-ink-200 bg-ink-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-ink-500">Tracking ID</p>
              <p className="mt-0.5 font-[family-name:var(--font-mono)] text-lg text-ink-900">
                {shipment.trackingId}
              </p>
              <p className="mt-1 text-xs text-ink-500">Fixed for the life of the shipment and cannot be edited.</p>
            </div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Contract / job reference" name="contractRef" hint="Also accepted for client verification on the tracking page" error={e.contractRef}>
              <TextInput name="contractRef" defaultValue={shipment?.contractRef ?? ""} />
            </Field>
            <Field label="Project name" name="projectName" error={e.projectName}>
              <TextInput name="projectName" defaultValue={shipment?.projectName ?? ""} />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="B/L number" name="blNumber" hint="Internal only" error={e.blNumber}>
              <TextInput name="blNumber" defaultValue={shipment?.blNumber ?? ""} />
            </Field>
            <Field label="CMR number" name="cmrNumber" hint="Internal only" error={e.cmrNumber}>
              <TextInput name="cmrNumber" defaultValue={shipment?.cmrNumber ?? ""} />
            </Field>
            <Field label="AWB number" name="awbNumber" hint="Internal only" error={e.awbNumber}>
              <TextInput name="awbNumber" defaultValue={shipment?.awbNumber ?? ""} />
            </Field>
          </div>

          <Field label="Client record" name="clientId" hint="Optional — links this shipment to a saved client" error={e.clientId}>
            <Select name="clientId" defaultValue={shipment?.clientId ?? ""}>
              <option value="">Not linked</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.companyName}
                </option>
              ))}
            </Select>
          </Field>
        </FormSection>
      </Card>

      <Card className="p-6">
        <FormSection title="Shipper">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Company" name="shipperName" required error={e.shipperName}>
              <TextInput name="shipperName" required defaultValue={shipment?.shipperName ?? ""} error={!!e.shipperName} />
            </Field>
            <Field label="Contact person" name="shipperContact" error={e.shipperContact}>
              <TextInput name="shipperContact" defaultValue={shipment?.shipperContact ?? ""} />
            </Field>
            <Field label="Email" name="shipperEmail" error={e.shipperEmail}>
              <TextInput name="shipperEmail" type="email" defaultValue={shipment?.shipperEmail ?? ""} error={!!e.shipperEmail} />
            </Field>
            <Field label="Phone" name="shipperPhone" error={e.shipperPhone}>
              <TextInput name="shipperPhone" type="tel" defaultValue={shipment?.shipperPhone ?? ""} />
            </Field>
          </div>
          <Field label="Address" name="shipperAddress" error={e.shipperAddress}>
            <Textarea name="shipperAddress" rows={2} defaultValue={shipment?.shipperAddress ?? ""} />
          </Field>
        </FormSection>
      </Card>

      <Card className="p-6">
        <FormSection
          title="Consignee"
          description="The consignee email doubles as the verification value on the public tracking page."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Company" name="consigneeName" required error={e.consigneeName}>
              <TextInput name="consigneeName" required defaultValue={shipment?.consigneeName ?? ""} error={!!e.consigneeName} />
            </Field>
            <Field label="Contact person" name="consigneeContact" error={e.consigneeContact}>
              <TextInput name="consigneeContact" defaultValue={shipment?.consigneeContact ?? ""} />
            </Field>
            <Field label="Email" name="consigneeEmail" error={e.consigneeEmail}>
              <TextInput name="consigneeEmail" type="email" defaultValue={shipment?.consigneeEmail ?? ""} error={!!e.consigneeEmail} />
            </Field>
            <Field label="Phone" name="consigneePhone" error={e.consigneePhone}>
              <TextInput name="consigneePhone" type="tel" defaultValue={shipment?.consigneePhone ?? ""} />
            </Field>
          </div>
          <Field label="Address" name="consigneeAddress" error={e.consigneeAddress}>
            <Textarea name="consigneeAddress" rows={2} defaultValue={shipment?.consigneeAddress ?? ""} />
          </Field>
        </FormSection>
      </Card>

      <Card className="p-6">
        <FormSection title="Billing party" description="Only if different from the shipper or consignee.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Company" name="billingPartyName" error={e.billingPartyName}>
              <TextInput name="billingPartyName" defaultValue={shipment?.billingPartyName ?? ""} />
            </Field>
            <Field label="Contact person" name="billingPartyContact" error={e.billingPartyContact}>
              <TextInput name="billingPartyContact" defaultValue={shipment?.billingPartyContact ?? ""} />
            </Field>
            <Field label="Email" name="billingPartyEmail" error={e.billingPartyEmail}>
              <TextInput name="billingPartyEmail" type="email" defaultValue={shipment?.billingPartyEmail ?? ""} error={!!e.billingPartyEmail} />
            </Field>
          </div>
          <Field label="Address" name="billingPartyAddress" error={e.billingPartyAddress}>
            <Textarea name="billingPartyAddress" rows={2} defaultValue={shipment?.billingPartyAddress ?? ""} />
          </Field>
        </FormSection>
      </Card>

      <Card className="p-6">
        <FormSection title="Route">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Origin city" name="originCity" required error={e.originCity}>
              <TextInput name="originCity" required defaultValue={shipment?.originCity ?? ""} error={!!e.originCity} />
            </Field>
            <Field label="Origin country" name="originCountry" required error={e.originCountry}>
              <TextInput name="originCountry" required defaultValue={shipment?.originCountry ?? ""} error={!!e.originCountry} />
            </Field>
            <Field label="Destination city" name="destinationCity" required error={e.destinationCity}>
              <TextInput name="destinationCity" required defaultValue={shipment?.destinationCity ?? ""} error={!!e.destinationCity} />
            </Field>
            <Field label="Destination country" name="destinationCountry" required error={e.destinationCountry}>
              <TextInput name="destinationCountry" required defaultValue={shipment?.destinationCountry ?? ""} error={!!e.destinationCountry} />
            </Field>
            <Field label="Port of loading" name="portOfLoading" error={e.portOfLoading}>
              <TextInput name="portOfLoading" defaultValue={shipment?.portOfLoading ?? ""} />
            </Field>
            <Field label="Port of discharge" name="portOfDischarge" error={e.portOfDischarge}>
              <TextInput name="portOfDischarge" defaultValue={shipment?.portOfDischarge ?? ""} />
            </Field>
          </div>

          <Field
            label="Border crossings / transshipment points"
            name="borderCrossings"
            hint="Comma separated, e.g. Khorgos, Aktau, Alat"
            error={e.borderCrossings}
          >
            <TextInput name="borderCrossings" defaultValue={shipment?.borderCrossings ?? ""} />
          </Field>

          <CheckboxGroup
            legend="Modes of transport *"
            name="modes"
            options={MODE_OPTIONS}
            selected={parseList(shipment?.modes ?? "ROAD")}
            error={e.modes}
            columns={2}
          />

          <CheckboxGroup
            legend="Corridors"
            name="corridors"
            options={CORRIDOR_OPTIONS}
            selected={parseList(shipment?.corridors)}
            error={e.corridors}
            columns={2}
          />
        </FormSection>
      </Card>

      <Card className="p-6">
        <FormSection
          title="Cargo"
          description="Dimensions drive permit applications and loading-gauge approvals. Record them per heaviest / largest piece."
        >
          <Field label="Cargo description" name="cargoDescription" required error={e.cargoDescription}>
            <Textarea
              name="cargoDescription"
              rows={3}
              required
              defaultValue={shipment?.cargoDescription ?? ""}
              error={!!e.cargoDescription}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Commodity" name="commodity" error={e.commodity}>
              <TextInput name="commodity" defaultValue={shipment?.commodity ?? ""} />
            </Field>
            <Field label="Number of pieces" name="packageCount" error={e.packageCount}>
              <TextInput
                name="packageCount"
                type="number"
                min={0}
                step={1}
                defaultValue={shipment?.packageCount ?? ""}
              />
            </Field>
            <Field label="Package type" name="packageType" error={e.packageType}>
              <Select name="packageType" defaultValue={shipment?.packageType ?? ""}>
                <option value="">Not specified</option>
                {PACKAGE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
            <Field label="Weight (kg)" name="weightKg" error={e.weightKg}>
              <TextInput name="weightKg" type="number" min={0} step="any" defaultValue={shipment?.weightKg ?? ""} />
            </Field>
            <Field label="Length (cm)" name="lengthCm" error={e.lengthCm}>
              <TextInput name="lengthCm" type="number" min={0} step="any" defaultValue={shipment?.lengthCm ?? ""} error={!!e.lengthCm} />
            </Field>
            <Field label="Width (cm)" name="widthCm" error={e.widthCm}>
              <TextInput name="widthCm" type="number" min={0} step="any" defaultValue={shipment?.widthCm ?? ""} />
            </Field>
            <Field label="Height (cm)" name="heightCm" error={e.heightCm}>
              <TextInput name="heightCm" type="number" min={0} step="any" defaultValue={shipment?.heightCm ?? ""} />
            </Field>
            <Field label="Volume (cbm)" name="volumeCbm" error={e.volumeCbm}>
              <TextInput name="volumeCbm" type="number" min={0} step="any" defaultValue={shipment?.volumeCbm ?? ""} />
            </Field>
          </div>

          <Checkbox
            name="isOOG"
            label="Out of gauge / heavy lift"
            hint="Flags the shipment on the client timeline and in the admin list. Requires at least one dimension."
            defaultChecked={shipment?.isOOG ?? false}
          />

          <Field label="OOG handling notes" name="oogNotes" hint="Lifting points, centre of gravity, escorts required" error={e.oogNotes}>
            <Textarea name="oogNotes" rows={2} defaultValue={shipment?.oogNotes ?? ""} />
          </Field>
        </FormSection>
      </Card>

      <Card className="p-6">
        <FormSection title="Status and schedule">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Current status" name="status" required error={e.status}>
              <Select name="status" required defaultValue={shipment?.status ?? "BOOKING_CONFIRMED"} error={!!e.status}>
                {STATUS_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {SHIPMENT_STATUSES[key].label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Exception note"
              name="exceptionNote"
              hint="Shown to the client when the status is Delayed or On Hold"
              error={e.exceptionNote}
            >
              <TextInput name="exceptionNote" defaultValue={shipment?.exceptionNote ?? ""} />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Estimated departure" name="etd" error={e.etd}>
              <TextInput name="etd" type="date" defaultValue={toDateInputValue(shipment?.etd)} />
            </Field>
            <Field label="Estimated delivery" name="eta" error={e.eta}>
              <TextInput name="eta" type="date" defaultValue={toDateInputValue(shipment?.eta)} error={!!e.eta} />
            </Field>
            <Field label="Actual departure" name="actualDeparture" error={e.actualDeparture}>
              <TextInput name="actualDeparture" type="date" defaultValue={toDateInputValue(shipment?.actualDeparture)} />
            </Field>
            <Field label="Actual delivery" name="actualDelivery" error={e.actualDelivery}>
              <TextInput name="actualDelivery" type="date" defaultValue={toDateInputValue(shipment?.actualDelivery)} />
            </Field>
          </div>
        </FormSection>
      </Card>

      <Card className="p-6">
        <FormSection title="Ownership, access and notifications">
          <Field label="Handled by" name="ownerId" error={e.ownerId}>
            <Select name="ownerId" defaultValue={shipment?.ownerId ?? ""}>
              <option value="">Unassigned</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name}
                </option>
              ))}
            </Select>
          </Field>

          <Checkbox
            name="isPublicAccess"
            label="Allow tracking with the Tracking ID alone"
            hint="Off by default. Turn on only when the client asks for a link they can share — it removes the email / contract check."
            defaultChecked={shipment?.isPublicAccess ?? false}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Notification emails"
              name="notifyEmails"
              hint="Comma separated. Falls back to the consignee email if left blank."
              error={e.notifyEmails}
            >
              <TextInput name="notifyEmails" defaultValue={shipment?.notifyEmails ?? ""} error={!!e.notifyEmails} />
            </Field>
            <Field
              label="Notification phone numbers"
              name="notifyPhones"
              hint="Comma separated, international format. Used once WhatsApp/SMS is enabled."
              error={e.notifyPhones}
            >
              <TextInput name="notifyPhones" defaultValue={shipment?.notifyPhones ?? ""} />
            </Field>
          </div>

          <Field label="Internal notes" name="internalNotes" hint="Never shown to the client" error={e.internalNotes}>
            <Textarea name="internalNotes" rows={3} defaultValue={shipment?.internalNotes ?? ""} />
          </Field>
        </FormSection>
      </Card>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-ink-200 bg-white px-5 py-4">
        <SubmitButton label={submitLabel} />
        <Link
          href={cancelHref}
          className="inline-flex h-11 items-center rounded-md border border-ink-300 px-5 text-sm font-medium text-ink-700 transition-colors duration-150 hover:bg-ink-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 cursor-pointer items-center rounded-md bg-accent-600 px-6 font-[family-name:var(--font-display)] font-medium text-white transition-colors duration-150 hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
