"use client";

import { useEffect, useRef } from "react";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  style?: React.CSSProperties;
  // Stagger delay between characters in ms
  stagger?: number;
  // Start delay in ms
  delay?: number;
  // 'chars' or 'words'
  split?: "chars" | "words";
};

/**
 * Reusable scroll-triggered split-text reveal.
 * - Splits text into chars or words
 * - Each unit fades + slides up when section scrolls into view
 * - Inspired by Revelo (GSAP)
 */
export function SplitReveal({
  text,
  as = "h2",
  className = "",
  style,
  stagger = 22,
  delay = 0,
  split = "chars",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const units = Array.from(el.querySelectorAll<HTMLElement>("[data-unit]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            for (let i = 0; i < units.length; i++) {
              const u = units[i];
              u.style.transitionDelay = `${delay + i * stagger}ms`;
              u.style.opacity = "1";
              u.style.transform = "translate3d(0, 0, 0)";
            }
            observer.unobserve(el);
            break;
          }
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, stagger]);

  const tokens =
    split === "chars"
      ? text.split("")
      : text.split(/(\s+)/);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={className}
      style={style}
      aria-label={text}
    >
      {tokens.map((tok, i) => {
        const isWhitespace = /^\s+$/.test(tok);
        if (isWhitespace) {
          return <span key={i}>{tok}</span>;
        }
        return (
          <span
            key={i}
            aria-hidden
            data-unit
            className="inline-block will-change-transform"
            style={{
              opacity: 0,
              transform: "translate3d(0, 0.6em, 0)",
              transition:
                "transform 700ms cubic-bezier(.2,.85,.2,1), opacity 700ms cubic-bezier(.2,.85,.2,1)",
            }}
          >
            {tok === " " ? " " : tok}
          </span>
        );
      })}
    </Tag>
  );
}
