"use client";

import { useEffect, useState } from "react";

type Egg = "matrix" | "hireme" | null;

/**
 * Typed easter eggs.
 *
 * Tracks the last 32 characters the user has typed (excluding while
 * focused in inputs/textareas) and triggers an effect when certain
 * sequences appear in the tail of that buffer.
 *
 *   matrix  → green character rain falls down the page for 6s
 *   hireme  → "OPEN TO HIRE" banner sweeps in and out
 */
export function TypedEggs() {
  const [active, setActive] = useState<Egg>(null);

  useEffect(() => {
    let buf = "";
    const onKey = (e: KeyboardEvent) => {
      const a = document.activeElement;
      if (
        a &&
        (a.tagName === "INPUT" ||
          a.tagName === "TEXTAREA" ||
          (a as HTMLElement).isContentEditable)
      )
        return;
      if (e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-32);
      if (buf.endsWith("matrix")) trigger("matrix");
      else if (buf.endsWith("hireme")) trigger("hireme");
    };
    const trigger = (egg: Egg) => {
      setActive(egg);
      buf = "";
    };
    // Programmatic trigger (footer egg cards — the only way to fire
    // these on touch devices with no keyboard)
    const onEggEvent = (e: Event) => {
      const name = (e as CustomEvent<string>).detail;
      if (name === "matrix" || name === "hireme") trigger(name);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("portfolio:egg", onEggEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("portfolio:egg", onEggEvent);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const ms = active === "matrix" ? 6000 : 4500;
    const id = setTimeout(() => setActive(null), ms);
    return () => clearTimeout(id);
  }, [active]);

  if (!active) return null;
  if (active === "matrix") return <MatrixRain />;
  if (active === "hireme") return <HireMeBanner />;
  return null;
}

// ---------- matrix ----------

function MatrixRain() {
  const cols = 22; // tuned down from 28 — same readability, less paint
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[110] overflow-hidden"
      style={{ animation: "matrixFade 6000ms ease forwards" }}
    >
      {Array.from({ length: cols }).map((_, i) => {
        const delay = (i * 137) % 800;
        const dur = 2400 + ((i * 211) % 1800);
        return (
          <span
            key={i}
            className="absolute top-0 select-none font-mono text-[14px] leading-tight"
            style={{
              left: `${(i / cols) * 100}%`,
              color: "rgba(140, 255, 170, 0.7)",
              textShadow: "0 0 8px rgba(80, 220, 130, 0.6)",
              animation: `matrixDrop ${dur}ms linear ${delay}ms infinite`,
              whiteSpace: "pre",
              willChange: "transform",
            }}
          >
            {randomGlyphs(28)}
          </span>
        );
      })}
      <div className="pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2 border border-white/40 bg-black/70 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white backdrop-blur-md">
        SYS / MATRIX MODE
      </div>
      <style>{`
        @keyframes matrixDrop {
          from { transform: translateY(-50%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.7; }
          to { transform: translateY(120vh); opacity: 0; }
        }
        @keyframes matrixFade {
          0%, 80% { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function randomGlyphs(n: number) {
  const chars = "01アイウエオカキクケコサシスセソタチツテト#$%&{}<>/[]=+-_";
  let s = "";
  for (let i = 0; i < n; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
    if ((i + 1) % 2 === 0) s += "\n";
  }
  return s;
}

// ---------- hireme ----------

function HireMeBanner() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-1/2 z-[110] -translate-y-1/2"
    >
      <div
        className="overflow-hidden whitespace-nowrap py-6 font-display text-[12vw] font-light tracking-tighter md:text-[8vw]"
        style={{
          background: "rgba(0, 102, 255, 0.95)",
          color: "#fff",
          animation: "hireSweep 4500ms cubic-bezier(.76,0,.24,1) forwards",
          textShadow: "0 0 30px rgba(0, 102, 255, 0.6)",
        }}
      >
        ▌ OPEN TO HIRE · OPEN TO HIRE · OPEN TO HIRE · ▌
      </div>
      <style>{`
        @keyframes hireSweep {
          0% { clip-path: inset(0 100% 0 0); }
          25%, 75% { clip-path: inset(0 0 0 0); }
          100% { clip-path: inset(0 0 0 100%); }
        }
      `}</style>
    </div>
  );
}
