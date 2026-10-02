"use client";

import posthog, { type PostHogInterface } from "posthog-js";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import {
  POSTHOG_PROXY_PATH,
  clickLocation,
  linkClickEvent,
  redactUrl,
  sanitizeProperties,
  type AnalyticsEvent,
} from "@/lib/analytics";

/**
 * PostHog for the public site.
 *
 * - Loaded only inside the (site) layout, so the admin panel is never tracked.
 * - Events go to a same-origin path (/ingest) that next.config.ts proxies to
 *   PostHog, which keeps them out of ad-blocker lists and off third-party
 *   cookies.
 * - Page views are captured manually on every route change, including
 *   client-side navigation.
 * - Every URL-shaped property is redacted before it leaves the browser: the
 *   tracking portal carries the consignee email in its query string.
 * - Elements with the `ph-no-capture` class (forms, tracking results) are
 *   excluded from autocapture and masked in any session replay.
 */

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = (process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com").replace(/\/$/, "");

declare global {
  interface Window {
    posthog?: PostHogInterface;
  }
}

let initialised = false;

function ensureInitialised(): boolean {
  if (typeof window === "undefined" || !KEY) return false;
  if (initialised) return true;

  posthog.init(KEY, {
    api_host: POSTHOG_PROXY_PATH,
    // The dashboard host (for the toolbar), not the ingestion host.
    ui_host: HOST.replace(".i.posthog.com", ".posthog.com"),
    defaults: "2026-05-30",
    // Captured by hand on route changes below, so SPA navigation is counted.
    capture_pageview: false,
    capture_pageleave: true,
    person_profiles: "identified_only",
    sanitize_properties: (properties) => sanitizeProperties(properties),
    loaded: (instance) => {
      // Same global the official snippet sets: lets the PostHog toolbar attach
      // and lets end-to-end tests observe captured events.
      window.posthog = instance;
    },
  });
  initialised = true;
  return true;
}

/**
 * Returns the initialised SDK instance, initialising it on first use, or null
 * when analytics is not configured. Lets client components that render before
 * the provider's effects (such as the opt-out control) use the SDK safely.
 */
export function getAnalytics(): PostHogInterface | null {
  return ensureInitialised() ? posthog : null;
}

/** Captures a custom event. Silently does nothing when analytics is not configured. */
export function track(event: AnalyticsEvent, properties: Record<string, unknown> = {}): void {
  if (!ensureInitialised()) return;
  posthog.capture(event, properties);
}

export function PostHogProvider() {
  if (!KEY) return null;
  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <ConversionClickTracker />
    </>
  );
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!ensureInitialised()) return;
    const query = searchParams.toString();
    const url = `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;
    posthog.capture("$pageview", { $current_url: redactUrl(url) });
  }, [pathname, searchParams]);

  return null;
}

/** Deck 11.2: conversion tracking on WhatsApp and phone clicks (and email). */
function ConversionClickTracker() {
  useEffect(() => {
    if (!ensureInitialised()) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]");
      if (!anchor) return;

      const ancestry: Array<{ tag: string; ariaLabel?: string | null; id?: string | null }> = [];
      for (let node: Element | null = anchor; node; node = node.parentElement) {
        ancestry.push({ tag: node.tagName, ariaLabel: node.getAttribute("aria-label"), id: node.id || null });
      }

      const hit = linkClickEvent(anchor.getAttribute("href"), anchor.textContent ?? "", clickLocation(ancestry));
      if (hit) posthog.capture(hit.event, { ...hit.properties, page: window.location.pathname });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
