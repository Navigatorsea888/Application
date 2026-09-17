import { z } from "zod";
import { STATUS_KEYS, MODES, CORRIDORS, ROLES, OFFICES } from "./constants";

/**
 * Form fields arrive as strings from HTML forms. These preprocessors turn
 * empty strings into undefined so that "not filled in" is distinguishable from
 * "deliberately zero" — the difference matters for weights and dimensions.
 */
const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalText = z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional());
const requiredText = (field: string, max = 300) =>
  z.string({ required_error: `${field} is required.` }).trim().min(1, `${field} is required.`).max(max);

const optionalNumber = z.preprocess(
  emptyToUndefined,
  z.coerce.number({ invalid_type_error: "Must be a number." }).nonnegative("Must be zero or greater.").optional(),
);

const optionalInt = z.preprocess(
  emptyToUndefined,
  z.coerce.number({ invalid_type_error: "Must be a whole number." }).int("Must be a whole number.").nonnegative().optional(),
);

const optionalDate = z.preprocess(
  emptyToUndefined,
  z.coerce.date({ invalid_type_error: "Use a valid date." }).optional(),
);

const checkbox = z.preprocess((value) => value === "on" || value === "true" || value === true, z.boolean());

const emailList = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .refine(
      (value) =>
        value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .every((s) => z.string().email().safeParse(s).success),
      "Enter valid email addresses separated by commas.",
    )
    .optional(),
);

const statusEnum = z.enum(STATUS_KEYS as [string, ...string[]], {
  errorMap: () => ({ message: "Choose a valid status." }),
});

const modeEnum = z.enum(Object.keys(MODES) as [string, ...string[]]);
const corridorEnum = z.enum(Object.keys(CORRIDORS) as [string, ...string[]]);

/** Multi-select fields come through as repeated form keys. */
const multiSelect = <T extends z.ZodTypeAny>(inner: T) =>
  z.preprocess((value) => {
    if (value === undefined || value === null || value === "") return [];
    return Array.isArray(value) ? value : [value];
  }, z.array(inner));

// --- Shipment ----------------------------------------------------------------

export const shipmentSchema = z
  .object({
    contractRef: optionalText,
    projectName: optionalText,
    blNumber: optionalText,
    cmrNumber: optionalText,
    awbNumber: optionalText,

    clientId: optionalText,

    shipperName: requiredText("Shipper name"),
    shipperContact: optionalText,
    shipperEmail: z.preprocess(emptyToUndefined, z.string().email("Enter a valid email.").optional()),
    shipperPhone: optionalText,
    shipperAddress: optionalText,

    consigneeName: requiredText("Consignee name"),
    consigneeContact: optionalText,
    consigneeEmail: z.preprocess(emptyToUndefined, z.string().email("Enter a valid email.").optional()),
    consigneePhone: optionalText,
    consigneeAddress: optionalText,

    billingPartyName: optionalText,
    billingPartyContact: optionalText,
    billingPartyEmail: z.preprocess(emptyToUndefined, z.string().email("Enter a valid email.").optional()),
    billingPartyAddress: optionalText,

    originCity: requiredText("Origin city"),
    originCountry: requiredText("Origin country"),
    destinationCity: requiredText("Destination city"),
    destinationCountry: requiredText("Destination country"),
    portOfLoading: optionalText,
    portOfDischarge: optionalText,
    borderCrossings: optionalText,
    corridors: multiSelect(corridorEnum),
    modes: multiSelect(modeEnum).refine((v) => v.length > 0, "Select at least one mode of transport."),

    cargoDescription: requiredText("Cargo description", 2000),
    commodity: optionalText,
    packageCount: optionalInt,
    packageType: optionalText,
    weightKg: optionalNumber,
    lengthCm: optionalNumber,
    widthCm: optionalNumber,
    heightCm: optionalNumber,
    volumeCbm: optionalNumber,
    isOOG: checkbox,
    oogNotes: optionalText,

    status: statusEnum,
    exceptionNote: optionalText,
    etd: optionalDate,
    eta: optionalDate,
    actualDeparture: optionalDate,
    actualDelivery: optionalDate,

    ownerId: optionalText,
    isPublicAccess: checkbox,
    notifyEmails: emailList,
    notifyPhones: optionalText,
    internalNotes: optionalText,
  })
  .superRefine((data, ctx) => {
    if (data.etd && data.eta && data.eta < data.etd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["eta"],
        message: "Estimated delivery cannot be before estimated departure.",
      });
    }
    // OOG cargo without dimensions is the single most common cause of a
    // rejected permit application, so it is blocked at entry.
    if (data.isOOG && !data.lengthCm && !data.widthCm && !data.heightCm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lengthCm"],
        message: "Out-of-gauge cargo needs at least one dimension recorded.",
      });
    }
  });

export type ShipmentInput = z.infer<typeof shipmentSchema>;

// --- Checkpoint --------------------------------------------------------------

export const checkpointSchema = z.object({
  status: statusEnum,
  location: requiredText("Location"),
  country: optionalText,
  leg: z.preprocess(emptyToUndefined, modeEnum.optional()),
  occurredAt: z.coerce.date({ required_error: "Date and time are required.", invalid_type_error: "Use a valid date and time." }),
  remarks: optionalText,
  isClientVisible: checkbox,
  /** When set, the shipment's current status is advanced to this checkpoint. */
  updateShipmentStatus: checkbox,
  notifyClient: checkbox,
});

// --- Public forms ------------------------------------------------------------

export const quoteRequestSchema = z.object({
  companyName: requiredText("Company name"),
  contactPerson: requiredText("Contact person"),
  email: z.string({ required_error: "Email is required." }).trim().email("Enter a valid email address."),
  phone: optionalText,
  country: optionalText,

  originCity: requiredText("Origin city"),
  originCountry: requiredText("Origin country"),
  destinationCity: requiredText("Destination city"),
  destinationCountry: requiredText("Destination country"),

  cargoDescription: requiredText("Cargo description", 2000),
  commodity: optionalText,
  packageCount: optionalInt,
  weightKg: optionalNumber,
  lengthCm: optionalNumber,
  widthCm: optionalNumber,
  heightCm: optionalNumber,
  isOOG: checkbox,
  preferredModes: multiSelect(modeEnum),
  requiredByDate: optionalDate,
  incoterms: optionalText,
  additionalInfo: optionalText,
  /** Honeypot: a hidden field real users never fill in. */
  website: optionalText,
});

export const enquirySchema = z.object({
  trackingRef: optionalText,
  name: requiredText("Name"),
  email: z.string({ required_error: "Email is required." }).trim().email("Enter a valid email address."),
  phone: optionalText,
  message: requiredText("Message", 4000),
  website: optionalText,
});

export const contactSchema = z.object({
  name: requiredText("Name"),
  email: z.string({ required_error: "Email is required." }).trim().email("Enter a valid email address."),
  company: optionalText,
  phone: optionalText,
  subject: optionalText,
  message: requiredText("Message", 4000),
  website: optionalText,
});

// --- Admin users -------------------------------------------------------------

export const loginSchema = z.object({
  email: z.string({ required_error: "Email is required." }).trim().email("Enter a valid email address."),
  password: z.string({ required_error: "Password is required." }).min(1, "Password is required."),
});

export const userSchema = z.object({
  name: requiredText("Name"),
  email: z.string({ required_error: "Email is required." }).trim().toLowerCase().email("Enter a valid email address."),
  role: z.enum(Object.keys(ROLES) as [string, ...string[]]),
  office: z.enum(Object.keys(OFFICES) as [string, ...string[]]),
  isActive: checkbox,
  password: z.preprocess(
    emptyToUndefined,
    z.string().min(10, "Use at least 10 characters.").max(200).optional(),
  ),
});

// --- Helpers -----------------------------------------------------------------

export type FieldErrors = Record<string, string>;

/** Flattens a ZodError into `{ fieldName: firstMessage }` for form rendering. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const result: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

/** Reads a FormData into a plain object, collecting repeated keys into arrays. */
export function formDataToObject(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) continue;
    const existing = result[key];
    if (existing === undefined) result[key] = value;
    else if (Array.isArray(existing)) existing.push(value);
    else result[key] = [existing, value];
  }
  return result;
}
