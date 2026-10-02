import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  ANALYTICS_EVENTS,
  REDACTED_VALUE,
  clickLocation,
  linkClickEvent,
  redactUrl,
  sanitizeProperties,
} from "../lib/analytics";

describe("Analytics — URL redaction", () => {
  test("redacts the tracking portal's id and verification parameters", () => {
    const out = redactUrl("https://navigatorsealand.com/track?id=NSL-2026-0001&v=client%40example.com");
    assert.equal(out.includes("client"), false, "the consignee email must not survive");
    assert.equal(out.includes("NSL-2026-0001"), false, "the tracking id must not survive");
    assert.ok(out.includes(`id=${encodeURIComponent(REDACTED_VALUE)}`));
    assert.ok(out.startsWith("https://navigatorsealand.com/track?"));
  });

  test("leaves harmless parameters and URLs without parameters untouched", () => {
    assert.equal(redactUrl("https://navigatorsealand.com/request-a-quote?service=HEAVY_HAUL"), "https://navigatorsealand.com/request-a-quote?service=HEAVY_HAUL");
    assert.equal(redactUrl("https://navigatorsealand.com/services"), "https://navigatorsealand.com/services");
    assert.equal(redactUrl("not a url"), "not a url");
  });

  test("keeps relative URLs relative", () => {
    assert.equal(redactUrl("/track?id=NSL-2026-0007&v=CTR-1"), `/track?id=${encodeURIComponent(REDACTED_VALUE)}&v=${encodeURIComponent(REDACTED_VALUE)}`);
  });
});

describe("Analytics — property sanitiser", () => {
  test("redacts every URL-shaped property, including autocapture hrefs", () => {
    const sanitised = sanitizeProperties({
      $current_url: "https://x.test/track?id=NSL-2026-0001&v=a@b.com",
      $referrer: "https://x.test/track?v=secret",
      $pathname: "/track",
      $el_href: "/track?id=NSL-2026-0002",
      custom_url: "/track?v=x",
      $elements: [{ tag_name: "a", attr__href: "/track?id=NSL-2026-0003&v=y" }, { tag_name: "div" }],
      unrelated: 42,
    });
    for (const value of [sanitised.$current_url, sanitised.$referrer, sanitised.$el_href, sanitised.custom_url]) {
      assert.equal(/NSL-2026|a@b\.com|secret|v=x/.test(value as string), false, `${value} still carries personal data`);
    }
    assert.equal((sanitised.$elements as Array<Record<string, string>>)[0].attr__href.includes("NSL"), false);
    assert.equal(sanitised.unrelated, 42);
    assert.equal(sanitised.$pathname, "/track");
  });

  test("reaches nested person properties and session-entry URLs", () => {
    const sanitised = sanitizeProperties({
      $set_once: { $initial_current_url: "https://x.test/track?id=NSL-2026-0001&v=a@b.com", $initial_referrer: "$direct" },
      $set: { last_seen_url: "/track?v=a@b.com" },
      $session_entry_url: "https://x.test/track?v=a@b.com",
      $session_entry_pathname: "/track",
      note: "A plain string with an @ sign stays as it is",
    });
    const json = JSON.stringify(sanitised);
    assert.equal(json.includes("a@b.com") || json.includes("NSL-2026"), false, json);
    assert.equal((sanitised.$set_once as Record<string, string>).$initial_referrer, "$direct");
    assert.equal(sanitised.note, "A plain string with an @ sign stays as it is");
  });
});

describe("Analytics — conversion link events", () => {
  test("classifies phone, WhatsApp and email links and ignores ordinary links", () => {
    assert.equal(linkClickEvent("tel:+77786624455", "Call", "header")?.event, ANALYTICS_EVENTS.phoneClick);
    assert.equal(linkClickEvent("https://wa.me/77786624455", "WhatsApp", "mobile-bar")?.event, ANALYTICS_EVENTS.whatsappClick);
    assert.equal(linkClickEvent("mailto:info@navigatorsealand.com", "Email", "footer")?.event, ANALYTICS_EVENTS.emailClick);
    assert.equal(linkClickEvent("/request-a-quote", "Request a Quote", "header"), null);
    assert.equal(linkClickEvent(null, "x", "page"), null);
  });

  test("strips mailto subjects, which can describe what the visitor wants", () => {
    const out = linkClickEvent("mailto:quotes@navigatorsealand.com?subject=Heavy%20haul%20drawings", "Send drawings", "page");
    assert.equal(out?.properties.href, "mailto:quotes@navigatorsealand.com");
  });

  test("derives the click location from the ancestry", () => {
    assert.equal(clickLocation([{ tag: "a" }, { tag: "nav", ariaLabel: "Quick actions" }, { tag: "body" }]), "mobile-bar");
    assert.equal(clickLocation([{ tag: "a" }, { tag: "div" }, { tag: "footer" }]), "footer");
    assert.equal(clickLocation([{ tag: "a" }, { tag: "section", id: "operations-desk" }, { tag: "main" }]), "operations-desk");
    assert.equal(clickLocation([{ tag: "a" }, { tag: "main" }]), "page");
    assert.equal(clickLocation([{ tag: "a" }]), "page");
  });
});
