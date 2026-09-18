"use client";

import { useEffect, useState } from "react";

const COLUMNS = [
  {
    title: "Navigate",
    links: [
      { label: "Hero", href: "#home" },
      { label: "Toolbox", href: "#toolbox" },
      { label: "Skills", href: "#skills" },
      { label: "Projects", href: "#projects" },
      { label: "Experience", href: "#experience" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Resume", href: "#resume" },
      { label: "About", href: "#about" },
      { label: "Easings", href: "#playground" },
      { label: "Contact", href: "#contact" },
      { label: "Download CV", href: "/Nandakishore_Reddy_CV.pdf" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "GitHub", href: "https://github.com/N9601" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/gnandhakishorereddy/",
      },
      { label: "dev.to", href: "https://dev.to/n9601" },
      { label: "Email", href: "mailto:nandakishorereddyg@outlook.com" },
    ],
  },
];

export function Footer() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        })
      );
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-fg/10 bg-bg">
      {/* Giant background watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center overflow-hidden">
        <div
          className="select-none font-display text-[14vw] font-light leading-[0.8] tracking-tighter text-fg/[0.025] md:text-[10vw]"
          aria-hidden
          style={{
            WebkitTextStroke: "1px rgba(245,245,245,0.04)",
            transform: "translateY(15%)",
          }}
        >
          NANDAKISHORE
        </div>
      </div>

      {/* Top marquee strip */}
      <div className="relative border-b border-fg/10 py-3 overflow-hidden">
        <div className="marquee">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-8 pr-8 font-mono text-[11px] uppercase tracking-[0.3em] text-fg/55 whitespace-nowrap">
              <span>● Open to opportunities</span>
              <span className="text-fg/25">/</span>
              <span>Hyderabad, IN</span>
              <span className="text-fg/25">/</span>
              <span>Full-Stack Developer</span>
              <span className="text-fg/25">/</span>
              <span className="text-blue">Let&apos;s build something</span>
              <span className="text-fg/25">/</span>
              <span>B.Tech CSE · VNR VJIET</span>
              <span className="text-fg/25">/</span>
              <span className="text-orange">React · Next · Supabase</span>
              <span className="text-fg/25">/</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer grid */}
      <div className="relative grid grid-cols-1 gap-12 px-6 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-8 md:px-10">
        {/* Brand block */}
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue glow-blue">
            ▌ NANDAKISHORE / FULL-STACK
          </div>
          <h3 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-fg md:text-4xl">
            Got a system
            <br />
            that needs{" "}
            <span className="italic text-blue glow-blue">building</span>?
          </h3>
          <a
            href="mailto:nandakishorereddyg@outlook.com"
            data-cursor="hover"
            className="mt-6 inline-flex items-center gap-2 border-b border-fg/30 pb-1 font-mono text-[11px] uppercase tracking-[0.3em] text-fg transition hover:border-blue hover:text-blue"
          >
            nandakishorereddyg@outlook.com →
          </a>
        </div>

        {/* Link columns */}
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <div className="mb-4 font-mono text-[9px] uppercase tracking-[0.35em] text-fg/35">
              /// {col.title}
            </div>
            <ul className="space-y-2">
              {col.links.map((l) => {
                const isExternal =
                  l.href.startsWith("http") || l.href.startsWith("mailto:") || l.href.startsWith("tel:");
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      data-cursor="hover"
                      target={isExternal && l.href.startsWith("http") ? "_blank" : undefined}
                      rel={isExternal && l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group inline-flex items-center gap-2 font-display text-base font-light text-fg/75 transition hover:text-fg"
                    >
                      <span className="block h-px w-0 bg-blue transition-all group-hover:w-3" />
                      <span>{l.label}</span>
                      {isExternal && (
                        <span className="text-fg/30 group-hover:text-orange transition">↗</span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Easter eggs — explicit so they actually get discovered */}
      <div className="relative border-t border-fg/10 px-6 py-8 md:px-10">
        <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-fg/45">
          <span className="block h-px w-8 bg-orange" />
          <span>/// Easter eggs</span>
          <span className="hidden text-fg/25 sm:inline">// type them — or tap a card</span>
          <span className="text-fg/25 sm:hidden">// tap to trigger</span>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              kbd: "↑ ↑ ↓ ↓ ← → ← → B A",
              label: "Konami",
              desc: "Chromatic wash + chime",
              egg: "konami",
            },
            {
              kbd: "type: matrix",
              label: "Matrix rain",
              desc: "Green glyph storm",
              egg: "matrix",
            },
            {
              kbd: "type: hireme",
              label: "Hire banner",
              desc: "Open to hire sweep",
              egg: "hireme",
            },
            {
              kbd: "press: ` (tilde)",
              label: "Terminal",
              desc: "Guest shell · try 'help'",
              egg: "terminal",
            },
          ].map((egg) => (
            <li key={egg.label}>
              <button
                type="button"
                data-cursor="hover"
                data-cursor-label="RUN"
                onClick={() =>
                  window.dispatchEvent(
                    egg.egg === "terminal"
                      ? new CustomEvent("portfolio:terminal")
                      : new CustomEvent("portfolio:egg", { detail: egg.egg })
                  )
                }
                className="group flex w-full items-start gap-3 border border-fg/10 bg-fg/[0.02] px-4 py-3 text-left transition hover:border-blue/40"
              >
                <span className="font-display text-xl font-light text-fg group-hover:text-blue transition">
                  {egg.label}
                </span>
                <span className="flex-1" />
                <span className="text-right">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-orange">
                    {egg.kbd}
                  </span>
                  <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-fg/40">
                    {egg.desc}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom strip */}
      <div
        className="relative flex flex-col items-start justify-between gap-3 border-t border-fg/10 px-6 py-6 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40 md:flex-row md:items-center md:px-10"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        <div>©2026 NANDAKISHORE REDDY · All rights reserved</div>
        <div className="flex items-center gap-4">
          <span>{time} IST</span>
          <span className="h-1 w-1 rounded-full bg-fg/30" />
          <span>Crafted with WebGL · GSAP · Next.js</span>
        </div>
        <a
          href="#home"
          data-cursor="hover"
          data-cursor-label="TOP"
          className="group flex items-center gap-2 text-fg/60 hover:text-blue transition"
        >
          ↑ Back to top
        </a>
      </div>
    </footer>
  );
}
