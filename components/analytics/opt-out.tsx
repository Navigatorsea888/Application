"use client";

import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui";
import { getAnalytics } from "./posthog-provider";

/**
 * Lets a visitor switch analytics capture off (and back on) from the cookie
 * policy page. Uses the SDK's own opt-out flag, which it persists itself.
 */
export function AnalyticsOptOut() {
  const [state, setState] = useState<"unknown" | "in" | "out" | "unavailable">("unknown");

  useEffect(() => {
    const ph = getAnalytics();
    if (!ph) {
      setState("unavailable");
      return;
    }
    setState(ph.has_opted_out_capturing() ? "out" : "in");
  }, []);

  if (state === "unavailable") {
    return <p className="text-sm text-ink-600">Analytics is not active on this page, so there is nothing to opt out of.</p>;
  }
  if (state === "unknown") return null;

  const toggle = () => {
    const ph = getAnalytics();
    if (!ph) return;
    if (state === "in") {
      ph.opt_out_capturing();
      setState("out");
    } else {
      ph.opt_in_capturing();
      setState("in");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <p className="text-sm text-ink-700" role="status">
        {state === "in" ? "Analytics is currently on for this browser." : "You have opted out. No analytics events are sent from this browser."}
      </p>
      <button type="button" onClick={toggle} className={buttonClass(state === "in" ? "secondary" : "primary", "sm")}>
        {state === "in" ? "Opt out of analytics" : "Opt back in"}
      </button>
    </div>
  );
}
