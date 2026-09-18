"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  href?: string;
  download?: boolean | string;
  onClick?: () => void;
  className?: string;
  strength?: number; // 0..1, default 0.4
  label?: string;
  target?: string;
};

export function MagneticButton({
  children,
  href,
  download,
  onClick,
  className = "",
  strength = 0.4,
  label,
  target,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    // No magnetism on touch devices — taps fire synthetic mousemove
    // events that displace the button, and with no mouseleave to reset
    // it the button sticks offset over neighbouring content.
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!canHover) return;

    let rafId: number;
    const t = { x: 0, y: 0 };
    const c = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = Math.max(rect.width, rect.height) * 0.9;
      if (dist < radius) {
        t.x = dx * strength;
        t.y = dy * strength;
      } else {
        t.x = 0;
        t.y = 0;
      }
    };
    const onLeave = () => {
      t.x = 0;
      t.y = 0;
    };

    const loop = () => {
      c.x += (t.x - c.x) * 0.18;
      c.y += (t.y - c.y) * 0.18;
      inner.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  const Inner = (
    <div ref={innerRef} className="inline-block will-change-transform">
      {children}
    </div>
  );

  return (
    <div ref={wrapRef} className={`relative inline-block ${className}`}>
      {href ? (
        <a
          href={href}
          download={
            typeof download === "string"
              ? download
              : download
              ? ""
              : undefined
          }
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          data-cursor="hover"
          data-cursor-label={label}
          className="inline-block"
        >
          {Inner}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          data-cursor="hover"
          data-cursor-label={label}
          className="inline-block"
        >
          {Inner}
        </button>
      )}
    </div>
  );
}
