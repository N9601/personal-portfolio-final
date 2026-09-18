"use client";

import { useState } from "react";
import { LiveClock } from "./LiveClock";

// Colour per entry, the way animejs.com's docs sidebar tags each
// section with its own hue (rendered as a label-dot beside the link)
const links = [
  { label: "Home", href: "#home", color: "#f5f5f5" },
  { label: "Toolbox", href: "#toolbox", color: "#4d9cff" },
  { label: "Skills", href: "#skills", color: "#00ffaa" },
  { label: "Projects", href: "#projects", color: "#a369ff" },
  { label: "Experience", href: "#experience", color: "#ff7d36" },
  { label: "Resume", href: "#resume", color: "#ffcc2a" },
  { label: "About", href: "#about", color: "#26f2d5" },
  { label: "Easings", href: "#playground", color: "#e962bf" },
  { label: "Contact", href: "#contact", color: "#ff1133" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between p-4 md:p-8"
        style={{
          paddingTop: "max(1rem, env(safe-area-inset-top))",
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <a
          href="#home"
          data-cursor="hover"
          className="pointer-events-auto font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-fg md:text-[12px] md:tracking-[0.3em]"
        >
          <span className="text-blue glow-blue">█</span>{" "}
          <span>NANDAKISHORE / FULL-STACK</span>
          <div className="mt-1 hidden text-[10px] tracking-[0.25em] text-fg/40 sm:block">
            // Hyderabad, IN — Est. 2023
          </div>
        </a>

        <div className="pointer-events-auto flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fg/70">
            <span className="relative inline-block">
              <span className="absolute inset-0 rounded-full bg-red pulse-dot" />
              <span className="relative block h-2 w-2 rounded-full bg-red" />
            </span>
            <span>Available for work</span>
          </div>
          <div className="hidden sm:block">
            <LiveClock />
          </div>
          <button
            data-cursor="hover"
            data-cursor-label="MENU"
            onClick={() => setOpen((v) => !v)}
            className="pointer-events-auto group flex h-11 w-11 items-center justify-center border border-fg/15 bg-bg/40 backdrop-blur-md transition hover:border-blue"
            aria-label="Toggle menu"
          >
            <span className="flex flex-col gap-[5px]">
              <span
                className="block h-[1px] w-4 bg-fg transition group-hover:bg-blue"
                style={{
                  transform: open ? "translateY(3px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="block h-[1px] w-4 bg-fg transition group-hover:bg-blue"
                style={{
                  transform: open
                    ? "translateY(-3px) rotate(-45deg)"
                    : "none",
                }}
              />
            </span>
          </button>
        </div>
      </header>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto bg-bg/85 backdrop-blur-xl"
          style={{
            paddingTop: "max(5rem, env(safe-area-inset-top))",
            paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
          }}
        >
          <nav className="grid gap-4 text-center sm:gap-6">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                data-cursor="hover"
                className="group font-display text-4xl font-light tracking-tight text-fg transition sm:text-5xl md:text-7xl"
                style={{ "--dot": l.color } as React.CSSProperties}
                onClick={() => setOpen(false)}
              >
                <span className="mr-4 inline-flex items-center gap-2 align-top font-mono text-xs text-fg/40">
                  <span
                    className="label-dot inline-block h-2 w-2 rounded-full transition-transform group-hover:scale-150"
                    style={{ background: l.color, boxShadow: `0 0 10px ${l.color}80` }}
                  />
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="transition-colors group-hover:text-[var(--dot)]">{l.label}</span>
              </a>
            ))}
          </nav>
          <div className="mt-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-fg/50 md:hidden">
            <span className="relative inline-block">
              <span className="absolute inset-0 rounded-full bg-red pulse-dot" />
              <span className="relative block h-2 w-2 rounded-full bg-red" />
            </span>
            <span>Available for work</span>
          </div>
        </div>
      )}
    </>
  );
}
