"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated key-figure counter (deck 4 "Key Figures"). Counts up once when it
 * scrolls into view; shows the final value immediately under
 * prefers-reduced-motion or without IntersectionObserver.
 */
export function Counter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return;

    setShown(0);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <div className="text-center">
      <span
        ref={ref}
        className="font-[family-name:var(--font-display)] text-4xl font-bold text-gold-500 sm:text-5xl"
        aria-label={`${value.toLocaleString("en-GB")}${suffix} ${label}`}
      >
        {shown.toLocaleString("en-GB")}
        {suffix}
      </span>
      <p className="mt-2 text-sm text-ink-300" aria-hidden>
        {label}
      </p>
    </div>
  );
}
