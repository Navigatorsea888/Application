"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds a subtle scroll reveal to elements carrying `.reveal`.
 *
 * The `js` class on <html> is what switches the initial hidden state on, so
 * with JavaScript disabled or the script still loading every element renders
 * fully visible. Three safeguards make sure nothing can stay hidden:
 *
 *  - the scan re-runs on every route change, so pages reached by in-site
 *    navigation are observed too (the layout, and therefore this component,
 *    persists across navigations);
 *  - a MutationObserver picks up `.reveal` elements added after the scan;
 *  - a timer reveals anything the IntersectionObserver has not reached within
 *    two seconds, so a missed callback degrades to "no animation", never to
 *    "invisible content".
 *
 * The whole effect is disabled under prefers-reduced-motion by the stylesheet.
 */
export function RevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !("IntersectionObserver" in window)) return;

    root.classList.add("js");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 },
    );

    const observe = (scope: ParentNode) => {
      const nodes = scope.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
      for (const element of nodes) observer.observe(element);
      if (scope instanceof HTMLElement && scope.classList.contains("reveal") && !scope.classList.contains("is-visible")) {
        observer.observe(scope);
      }
    };

    observe(document.body);

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof HTMLElement) observe(node);
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    const revealAll = () => {
      for (const element of document.querySelectorAll(".reveal:not(.is-visible)")) element.classList.add("is-visible");
    };
    const fallback = window.setTimeout(revealAll, 2000);

    return () => {
      window.clearTimeout(fallback);
      mutations.disconnect();
      observer.disconnect();
      // Never leave hidden elements behind when the observer goes away.
      revealAll();
    };
  }, [pathname]);

  return null;
}
