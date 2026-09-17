"use client";

import { useEffect } from "react";

/**
 * Adds a subtle scroll reveal to elements carrying `.reveal`.
 *
 * The `js` class on <html> is what switches the initial hidden state on, so
 * with JavaScript disabled or the script still loading every element renders
 * fully visible. Elements are unobserved after revealing, and the whole effect
 * is disabled under prefers-reduced-motion by the stylesheet.
 */
export function RevealProvider() {
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    for (const element of document.querySelectorAll(".reveal")) observer.observe(element);

    return () => {
      observer.disconnect();
      root.classList.remove("js");
    };
  }, []);

  return null;
}
