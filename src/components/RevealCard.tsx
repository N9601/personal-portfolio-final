"use client";

import { useRef, useState } from "react";

type Props = {
  // Top-layer content (always visible — the "face" of the card)
  face: React.ReactNode;
  // Bottom-layer content (revealed by hover curtain)
  reveal: React.ReactNode;
  className?: string;
  href?: string;
  // Curtain direction: where the face wipes TO when revealing
  direction?: "up" | "down" | "left" | "right";
  // Optional label that appears in the curtain reveal area
  label?: string;
};

const FACE_OUT: Record<NonNullable<Props["direction"]>, string> = {
  up: "polygon(0 0, 100% 0, 100% 0, 0 0)",
  down: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
  left: "polygon(0 0, 0 0, 0 100%, 0 100%)",
  right: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
};
const FULL = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";

// Reveal starts collapsed at the OPPOSITE edge of where the face wipes
// to — so face wipes UP into the top edge while reveal wipes UP from
// the bottom edge into full coverage.
const REVEAL_IN: Record<NonNullable<Props["direction"]>, string> = {
  up: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
  down: "polygon(0 0, 100% 0, 100% 0, 0 0)",
  left: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
  right: "polygon(0 0, 0 0, 0 100%, 0 100%)",
};

/**
 * Hover-triggered curtain reveal card.
 * - Face content sits on top by default
 * - On hover, the face wipes out (in `direction`) while reveal wipes in
 * - Both layers use clip-path with cubic easing
 * - Optional accent label in the corner of the reveal layer
 */
export function RevealCard({
  face,
  reveal,
  className = "",
  href,
  direction = "up",
  label,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  // No hover on touch devices — the curtain toggles on tap instead,
  // otherwise the reveal layer is unreachable on phones. Checked at
  // event time: touch fires synthetic mouseenter before click, which
  // would cancel out the toggle if both paths ran.
  const isTouch = () =>
    window.matchMedia("(hover: none), (pointer: coarse)").matches;

  const inner = (
    <div
      ref={ref}
      className={`group relative overflow-hidden border border-fg/15 bg-bg ${className}`}
      onMouseEnter={() => {
        if (!isTouch()) setHover(true);
      }}
      onMouseLeave={() => {
        if (!isTouch()) setHover(false);
      }}
      onClick={() => {
        if (isTouch() && !href) setHover((v) => !v);
      }}
      data-cursor="hover"
    >
      {/* Reveal layer (back) */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: hover ? FULL : REVEAL_IN[direction],
          transition: "clip-path 700ms cubic-bezier(.76,0,.24,1)",
          willChange: "clip-path",
        }}
      >
        {reveal}
        {label && (
          <div className="absolute right-3 top-3 font-mono text-[9px] uppercase tracking-[0.3em] text-blue">
            {label}
          </div>
        )}
      </div>

      {/* Face layer (front) — also fades opacity so titles never
          flash through the in-flight curtain */}
      <div
        className="relative"
        style={{
          clipPath: hover ? FACE_OUT[direction] : FULL,
          opacity: hover ? 0 : 1,
          transition:
            "clip-path 700ms cubic-bezier(.76,0,.24,1), opacity 280ms ease-out",
          willChange: "clip-path, opacity",
        }}
      >
        {face}
      </div>

      {/* Hover line at the curtain edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-blue transition-transform duration-700"
        style={{
          transform: hover ? "scaleX(1)" : "scaleX(0)",
          transitionTimingFunction: "cubic-bezier(.76,0,.24,1)",
        }}
      />
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block"
      >
        {inner}
      </a>
    );
  }
  return inner;
}
