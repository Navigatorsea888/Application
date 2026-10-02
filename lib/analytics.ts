// ---------------------------------------------------------------------------
// Product analytics (PostHog) — pure helpers shared by the browser provider
// and the tests. Nothing here touches the SDK or the DOM, so it can run in
// node and be unit-tested.
//
// Deck 11.2 asks for conversion tracking on the quote form, WhatsApp and
// phone clicks. Those are the custom events below; page views come from the
// SDK on every route change.
// ---------------------------------------------------------------------------

/** Event names. Keep them stable: dashboards and insights are built on them. */
export const ANALYTICS_EVENTS = {
  quoteSubmitted: "quote_request_submitted",
  contactSubmitted: "contact_form_submitted",
  trackingEnquirySubmitted: "tracking_enquiry_submitted",
  phoneClick: "phone_click",
  whatsappClick: "whatsapp_click",
  emailClick: "email_click",
  downloadRequested: "download_requested",
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/** Same-origin path the browser SDK posts to; proxied to PostHog by next.config.ts rewrites. */
export const POSTHOG_PROXY_PATH = "/ingest";

/**
 * Query parameters that may carry personal data and must never reach the
 * analytics store. The tracking portal puts the consignee email or contract
 * reference in `v` and the Tracking ID in `id`.
 */
export const REDACTED_QUERY_PARAMS = ["id", "v", "email", "phone", "token"] as const;

export const REDACTED_VALUE = "[redacted]";

/**
 * Redacts sensitive query parameters from a URL string. Keeps the rest of the
 * URL (including other parameters) intact so funnels by page still work.
 * Returns the input unchanged when it is not a parseable URL.
 */
export function redactUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url, "http://placeholder.invalid");
  } catch {
    return url;
  }
  let changed = false;
  for (const key of REDACTED_QUERY_PARAMS) {
    if (parsed.searchParams.has(key)) {
      parsed.searchParams.set(key, REDACTED_VALUE);
      changed = true;
    }
  }
  if (!changed) return url;
  // Preserve relative inputs as relative outputs.
  const isAbsolute = /^[a-z][a-z0-9+.-]*:\/\//i.test(url);
  return isAbsolute ? parsed.toString() : `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

/** Property keys the SDK fills with URLs. */
const URL_PROPERTY_KEYS = new Set(["$current_url", "$referrer", "$initial_current_url", "$initial_referrer", "$pathname", "url", "href"]);

const SENSITIVE_QUERY = new RegExp(`[?&](${REDACTED_QUERY_PARAMS.join("|")})=`, "i");

function isUrlKey(key: string): boolean {
  return URL_PROPERTY_KEYS.has(key) || /(^|_)url$/i.test(key) || key === "$el_href" || key === "attr__href";
}

function sanitizeValue(key: string, value: unknown): unknown {
  if (typeof value === "string") {
    // URL-named keys are always passed through; any other string that carries
    // one of the sensitive query parameters is treated as a URL too.
    if (isUrlKey(key) || SENSITIVE_QUERY.test(value)) return redactUrl(value);
    return value;
  }
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(key, item));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = sanitizeValue(k, v);
    return out;
  }
  return value;
}

/**
 * `sanitize_properties` hook: redacts every URL-shaped value on an event
 * before it is queued — top-level properties, nested person properties
 * (`$set`, `$set_once`), session-entry URLs and autocapture element chains.
 * Applied to all events, including autocapture.
 */
export function sanitizeProperties<T extends Record<string, unknown>>(properties: T): T {
  return sanitizeValue("", properties) as T;
}

export interface LinkClickEvent {
  event: AnalyticsEvent;
  properties: { href: string; label: string; location: string };
}

/**
 * Maps an anchor's href to a conversion event, or null when the link is an
 * ordinary navigation. `label` is the visible text, `location` a short hint
 * for where on the page the click came from (header, footer, mobile-bar…).
 */
export function linkClickEvent(href: string | null | undefined, label: string, location: string): LinkClickEvent | null {
  if (!href) return null;
  const value = href.trim();
  let event: AnalyticsEvent | null = null;
  if (/^tel:/i.test(value)) event = ANALYTICS_EVENTS.phoneClick;
  else if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\//i.test(value)) event = ANALYTICS_EVENTS.whatsappClick;
  else if (/^mailto:/i.test(value)) event = ANALYTICS_EVENTS.emailClick;
  if (!event) return null;
  // mailto subjects can carry what the visitor is asking for; keep only the address.
  const cleanHref = event === ANALYTICS_EVENTS.emailClick ? value.split("?")[0] : value;
  return { event, properties: { href: cleanHref, label: label.trim().slice(0, 80), location } };
}

/**
 * Derives a coarse "where on the page" label from an element's ancestry, so
 * header, footer and mobile-bar clicks on the same number can be compared.
 */
export function clickLocation(ancestorTags: Array<{ tag: string; ariaLabel?: string | null; id?: string | null }>): string {
  for (const node of ancestorTags) {
    const tag = node.tag.toLowerCase();
    const aria = (node.ariaLabel ?? "").toLowerCase();
    if (tag === "header") return "header";
    if (tag === "footer") return "footer";
    if (aria === "quick actions") return "mobile-bar";
    if (node.id === "operations-desk") return "operations-desk";
    if (tag === "main") return "page";
  }
  return "page";
}
