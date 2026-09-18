"use client";

import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "hover" | "view" | "drag";

export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    const target = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    const trail = { x: -100, y: -100 };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(
        "[data-cursor]"
      ) as HTMLElement | null;
      if (el) {
        const m = (el.dataset.cursor as CursorMode) || "hover";
        setMode(m);
        setLabel(el.dataset.cursorLabel || "");
      } else {
        setMode("default");
        setLabel("");
      }
    };

    let rafId: number;
    let lastRingX = -1;
    let lastTrailX = -1;
    const loop = () => {
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;
      trail.x += (target.x - trail.x) * 0.08;
      trail.y += (target.y - trail.y) * 0.08;
      // Skip DOM writes if movement under 0.25px — saves layout work
      // when the cursor is at rest.
      if (ringRef.current && Math.abs(ring.x - lastRingX) > 0.25) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
        lastRingX = ring.x;
      }
      if (trailRef.current && Math.abs(trail.x - lastTrailX) > 0.25) {
        trailRef.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) translate(-50%, -50%)`;
        lastTrailX = trail.x;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  const isHover = mode === "hover" || mode === "view";

  return (
    <>
      <div
        ref={trailRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[10000] hidden md:block"
        style={{
          width: 6,
          height: 6,
          borderRadius: "9999px",
          background: "var(--red)",
          filter: "blur(3px)",
          opacity: 0.6,
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[10001] hidden md:flex items-center justify-center"
        style={{
          width: isHover ? 64 : 28,
          height: isHover ? 64 : 28,
          borderRadius: "9999px",
          border: `1px solid ${isHover ? "var(--orange)" : "var(--blue)"}`,
          backgroundColor: isHover
            ? "rgba(255, 85, 0, 0.08)"
            : "rgba(0, 102, 255, 0.04)",
          transition:
            "width 220ms cubic-bezier(.2,.8,.2,1), height 220ms cubic-bezier(.2,.8,.2,1), background-color 220ms, border-color 220ms",
          mixBlendMode: "difference",
        }}
      >
        {label && (
          <span
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: "var(--fg)" }}
          >
            {label}
          </span>
        )}
      </div>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[10002] hidden md:block"
        style={{
          width: 4,
          height: 4,
          borderRadius: "9999px",
          background: "var(--fg)",
        }}
      />
    </>
  );
}
