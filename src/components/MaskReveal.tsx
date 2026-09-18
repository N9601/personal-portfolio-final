"use client";

import { useEffect, useRef } from "react";

type Direction = "up" | "down" | "left" | "right";

type Props = {
  children: React.ReactNode;
  direction?: Direction;
  duration?: number; // ms
  delay?: number; // ms
  className?: string;
  // Optional accent line that draws after the reveal
  accent?: boolean;
  // Reveal once or every time it enters viewport
  once?: boolean;
};

const HIDDEN: Record<Direction, string> = {
  up: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
  down: "polygon(0 0, 100% 0, 100% 0, 0 0)",
  left: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
  right: "polygon(0 0, 0 0, 0 100%, 0 100%)",
};
const SHOWN = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";

/**
 * Scroll-triggered clip-path mask reveal.
 *
 * Wipes children into view from a chosen edge. Different from SplitReveal
 * (which animates each character) — MaskReveal wipes the whole block as
 * one rectangle. Use for images, paragraphs, mixed content.
 *
 * Pair with `accent` for a thin colored line that draws after the wipe.
 */
export function MaskReveal({
  children,
  direction = "up",
  duration = 900,
  delay = 0,
  className = "",
  accent = false,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const line = lineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.style.transitionDelay = `${delay}ms`;
            el.style.clipPath = SHOWN;
            if (line) {
              line.style.transitionDelay = `${delay + duration * 0.55}ms`;
              line.style.transform = "scaleX(1)";
            }
            if (once) observer.unobserve(el);
          } else if (!once) {
            el.style.clipPath = HIDDEN[direction];
            if (line) line.style.transform = "scaleX(0)";
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [direction, duration, delay, once]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={ref}
        style={{
          clipPath: HIDDEN[direction],
          transition: `clip-path ${duration}ms cubic-bezier(.76, 0, .24, 1)`,
          willChange: "clip-path",
        }}
      >
        {children}
      </div>
      {accent && (
        <span
          ref={lineRef}
          aria-hidden
          className="absolute -bottom-1 left-0 block h-px w-full origin-left bg-blue"
          style={{
            transform: "scaleX(0)",
            transition: `transform ${duration * 0.5}ms cubic-bezier(.76, 0, .24, 1)`,
          }}
        />
      )}
    </div>
  );
}
