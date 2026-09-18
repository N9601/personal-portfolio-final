"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    // Honor prefers-reduced-motion: don't intercept native scroll at
    // all if the visitor has the OS setting on.
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Lenis is disabled on touch by default in our build — native
    // touch scroll is already 60fps on every modern phone and Lenis
    // wheel-hijacking can fight with the browser's momentum scroll.
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      // touchMultiplier: 0 is effectively a no-op on touch
      touchMultiplier: 0,
    });

    let rafId: number;
    let docVisible = true;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const onVis = () => {
      docVisible = document.visibilityState === "visible";
      if (docVisible && !rafId) rafId = requestAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVis);
      lenis.destroy();
    };
  }, []);

  return null;
}
