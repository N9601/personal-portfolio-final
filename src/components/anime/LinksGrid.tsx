"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll, stagger, utils, type ScrollObserver } from "animejs";
import { prefersReducedMotion } from "@/components/reducedMotion";

/**
 * The boxed "Start animating" links grid from the bottom of animejs.com:
 * a 1px-gapped grid of cells, each with a coloured label-dot and an
 * arrow icon that nudges right on hover. Cells stagger in on scroll.
 */

type Link = { label: string; href: string; color: string; external?: boolean };

const LINKS: Link[] = [
  { label: "GitHub", href: "https://github.com/N9601", color: "#4d9cff", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gnandhakishorereddy/", color: "#00ffaa", external: true },
  { label: "dev.to", href: "https://dev.to/n9601", color: "#a369ff", external: true },
  { label: "Email", href: "mailto:nandakishorereddyg@outlook.com", color: "#ff7d36" },
  { label: "Call", href: "tel:+918555042086", color: "#26f2d5" },
  { label: "Download CV", href: "/Nandakishore_Reddy_CV.pdf", color: "#ff1133" },
  { label: "Projects", href: "#projects", color: "#ffcc2a" },
  { label: "Experience", href: "#experience", color: "#e962bf" },
  { label: "Toolbox", href: "#toolbox", color: "#b7ff54" },
];

export function LinksGrid() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cells = Array.from(root.querySelectorAll<HTMLElement>("li"));
    // Reduced motion, or the page was restored already scrolled past
    // this block: nothing to reveal, leave the cells visible.
    if (prefersReducedMotion() || root.getBoundingClientRect().bottom < 0) return;
    utils.set(cells, { opacity: 0, y: 12 });
    const observers: ScrollObserver[] = [];
    observers.push(
      onScroll({
        target: root,
        enter: "bottom-=10% top",
        onEnter: () =>
          animate(cells, {
            opacity: [0, 1],
            y: [12, 0],
            duration: 500,
            delay: stagger(50, { grid: [3, 3], from: "first" }),
            ease: "out(3)",
          }),
      })
    );
    return () => {
      observers.forEach((o) => o.revert());
      utils.remove(cells);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative z-10 mx-auto mt-24 max-w-6xl text-center">
      <h3
        className="font-display font-light leading-none tracking-[-0.04em] text-fg"
        style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
      >
        Start a conversation
      </h3>
      <p className="mx-auto mt-4 max-w-md font-display text-base text-fg/55">
        Pick a door. They all lead to the same inbox.
      </p>
      <ul className="links-list-grid mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-px overflow-hidden border border-fg/12 bg-fg/12 text-left sm:grid-cols-3">
        {LINKS.map((l) => (
          <li key={l.label} className="bg-bg" style={{ "--dot": l.color } as React.CSSProperties}>
            <a
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              data-cursor="hover"
              data-cursor-label={l.external ? "OPEN" : "GO"}
              className="group relative flex items-center justify-between py-4 pl-10 pr-5 font-mono text-[11px] uppercase tracking-[0.25em] text-fg/75 transition hover:bg-fg/[0.04] hover:text-fg"
            >
              <span
                className="label-dot absolute left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
                style={{ background: l.color, boxShadow: `0 0 10px ${l.color}80` }}
              />
              {l.label}
              <svg
                viewBox="0 0 24 24"
                className="icon h-4 w-4 text-fg/35 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-[var(--dot)]"
                aria-hidden
              >
                <polygon fill="currentColor" points="17.737 11.987 12.5 17.225 11.263 15.987 14.388 12.862 6.5 12.862 6.5 11.112 14.388 11.112 11.263 7.987 12.5 6.75" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
