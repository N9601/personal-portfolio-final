"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "home", label: "Hero" },
  { id: "toolbox", label: "Toolbox" },
  { id: "skills", label: "Skills" },
  { id: "modules", label: "Modules" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Numbers" },
  { id: "resume", label: "Resume" },
  { id: "about", label: "About" },
  { id: "interests", label: "Off the clock" },
  { id: "tracks", label: "Tracks" },
  { id: "playground", label: "Easings" },
  { id: "contact", label: "Contact" },
];

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    // Cache section DOM nodes once — querying by id every scroll frame
    // was wasted DOM work since the section list is static.
    const els: (HTMLElement | null)[] = SECTIONS.map((s) =>
      document.getElementById(s.id)
    );
    let raf = 0;
    let lastActive = -1;
    const onScroll = () => {
      if (raf) return; // collapse repeated scroll events into one rAF
      raf = requestAnimationFrame(() => {
        raf = 0;
        const docH =
          document.documentElement.scrollHeight - window.innerHeight;
        const prog = docH > 0 ? window.scrollY / docH : 0;
        if (barRef.current) {
          barRef.current.style.transform = `scaleY(${prog})`;
        }
        if (topBarRef.current) {
          topBarRef.current.style.transform = `scaleX(${prog})`;
        }
        const probe = window.innerHeight * 0.4;
        let foundIdx = 0;
        for (let i = 0; i < els.length; i++) {
          const el = els[i];
          if (!el) continue;
          if (el.getBoundingClientRect().top <= probe) foundIdx = i;
        }
        if (foundIdx !== lastActive) {
          lastActive = foundIdx;
          setActiveIdx(foundIdx);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* Top edge progress bar — phones only (left bar + dot nav are md+) */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[2px] md:hidden">
        <div
          ref={topBarRef}
          className="h-full origin-left bg-gradient-to-r from-blue via-orange to-red"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Left edge progress bar */}
      <div className="pointer-events-none fixed left-0 top-0 z-40 hidden h-screen w-[3px] md:block">
        <div className="absolute inset-0 bg-fg/[0.06]" />
        <div
          ref={barRef}
          className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-blue via-orange to-red"
          style={{ transform: "scaleY(0)" }}
        />
      </div>

      {/* Right edge section dot navigator */}
      <nav className="pointer-events-auto fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-1 md:flex">
        {SECTIONS.map((s, i) => {
          const isActive = i === activeIdx;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-cursor="hover"
              data-cursor-label={s.label.toUpperCase()}
              className="group flex items-center gap-3 py-1 pr-2"
              aria-label={`Jump to ${s.label}`}
            >
              <span
                className={`block font-mono text-[10px] uppercase tracking-[0.25em] transition-all ${
                  isActive
                    ? "opacity-100 text-fg"
                    : "opacity-0 text-fg/40 group-hover:opacity-80"
                }`}
              >
                {String(i + 1).padStart(2, "0")} · {s.label}
              </span>
              <span
                className="block transition-all duration-300"
                style={{
                  width: isActive ? 28 : 12,
                  height: 2,
                  background: isActive
                    ? "var(--blue)"
                    : "rgba(245,245,245,0.25)",
                  boxShadow: isActive ? "0 0 12px rgba(0,102,255,0.6)" : "none",
                }}
              />
            </a>
          );
        })}
      </nav>
    </>
  );
}
