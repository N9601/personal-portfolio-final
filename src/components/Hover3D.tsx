"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  // Max rotation in degrees (split across x and y).
  // 0.5 = subtle, 1 = default, 2 = dramatic
  intensity?: number;
  // CSS perspective in px (lower = stronger 3D feel)
  perspective?: number;
  // Show a cursor-following highlight on top of the card
  glare?: boolean;
  glareOpacity?: number;
  // Lerp factor for smooth motion (0.1..0.3 sweet spot)
  smoothness?: number;
};

/**
 * Cursor-perspective 3D tilt wrapper.
 *
 * Inspired by the classic "tilt card" pattern. Wraps any content
 * (image, card, even another animated component) and gives it a
 * smooth perspective tilt that follows the cursor while hovered.
 *
 * Composition notes:
 * - Outer ref measures the rect for cursor math.
 * - Inner ref holds the perspective transform (so children can use
 *   their own transforms without fighting this one).
 * - Glare layer uses mix-blend-mode: overlay so it tints over any
 *   background.
 * - Uses requestAnimationFrame lerp for buttery motion, not jittery
 *   per-frame jumps.
 */
export function Hover3D({
  children,
  className = "",
  intensity = 1,
  perspective = 900,
  glare = true,
  glareOpacity = 0.18,
  smoothness = 0.18,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    const glr = glareRef.current;
    if (!wrap || !inner) return;

    // Skip the tilt entirely on touch / no-hover devices. Cursor tilt
    // makes no sense without a hover cursor and burns RAF cycles on
    // a thumb-scrolling viewer.
    const canHover =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;

    // current and target values, eased per frame
    const target = { rx: 0, ry: 0, gx: 50, gy: 50, active: 0 };
    const current = { rx: 0, ry: 0, gx: 50, gy: 50, active: 0 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      target.rx = (0.5 - y) * 18 * intensity;
      target.ry = (x - 0.5) * 22 * intensity;
      target.gx = x * 100;
      target.gy = y * 100;
      target.active = 1;
    };

    const onLeave = () => {
      target.rx = 0;
      target.ry = 0;
      target.active = 0;
    };

    const loop = () => {
      current.rx += (target.rx - current.rx) * smoothness;
      current.ry += (target.ry - current.ry) * smoothness;
      current.gx += (target.gx - current.gx) * smoothness;
      current.gy += (target.gy - current.gy) * smoothness;
      current.active += (target.active - current.active) * smoothness;

      inner.style.transform = `perspective(${perspective}px) rotateX(${current.rx.toFixed(3)}deg) rotateY(${current.ry.toFixed(3)}deg)`;

      if (glr && glare) {
        glr.style.opacity = (current.active * glareOpacity).toFixed(3);
        glr.style.background = `radial-gradient(circle at ${current.gx}% ${current.gy}%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 45%)`;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [intensity, perspective, glare, glareOpacity, smoothness]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ perspective: `${perspective}px` }}
    >
      <div
        ref={innerRef}
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {children}
        {glare && (
          <div
            ref={glareRef}
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: 0,
              mixBlendMode: "overlay",
            }}
          />
        )}
      </div>
    </div>
  );
}
