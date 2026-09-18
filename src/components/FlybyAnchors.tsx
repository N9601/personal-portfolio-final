"use client";

import { useEffect } from "react";

/**
 * Intercepts in-page hash anchor clicks (#home, #projects, etc.) and
 * runs a smooth "flyby" scroll instead of the browser's instant jump
 * or Lenis's normal scroll.
 *
 * The flyby:
 * - Picks the longer of (700ms, 12ms per 100 px) so distant jumps
 *   feel weighty, near jumps feel snappy
 * - Uses a custom cubic-out ease with a small +28 px overshoot near
 *   the end, then pulls back — a brief "land hard, settle" beat
 *   that reads as motion design rather than a scroll
 * - Falls back to native scrollIntoView if reduced-motion is set
 */
export function FlybyAnchors() {
  useEffect(() => {
    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rafId = 0;

    const flyTo = (targetY: number) => {
      cancelAnimationFrame(rafId);
      const startY = window.scrollY;
      const dist = targetY - startY;
      const absDist = Math.abs(dist);
      if (absDist < 8) {
        window.scrollTo({ top: targetY });
        return;
      }
      const duration = Math.min(
        1400,
        Math.max(700, (absDist / 100) * 12)
      );
      const start = performance.now();

      const ease = (t: number) => {
        // Cubic out with overshoot near end (peaks ~1.04 at t=0.92)
        const baseOut = 1 - Math.pow(1 - t, 3);
        const overshoot = Math.sin(t * Math.PI) * 0.06;
        return Math.min(1, baseOut + overshoot * t);
      };

      const step = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / duration);
        const k = ease(t);
        const y = startY + dist * k;
        window.scrollTo({ top: y });
        if (t < 1) {
          rafId = requestAnimationFrame(step);
        }
      };
      rafId = requestAnimationFrame(step);
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const a = target.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href");
      if (!hash || hash.length < 2 || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;

      e.preventDefault();

      // Update URL without forcing a jump
      try {
        history.replaceState(null, "", hash);
      } catch {}

      const rect = el.getBoundingClientRect();
      const targetY = rect.top + window.scrollY;

      if (isReducedMotion) {
        (el as HTMLElement).scrollIntoView({ block: "start" });
        return;
      }
      flyTo(targetY);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
