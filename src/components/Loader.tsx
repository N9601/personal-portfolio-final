"use client";

import { useEffect, useState } from "react";
import { Sounds } from "@/components/Sound";
import { prefersReducedMotion } from "@/components/reducedMotion";

const PHRASES = [
  "BOOTING SYSTEM",
  "LOADING SHADERS",
  "COMPILING GEOMETRY",
  "WARMING CORE",
  "FINALIZING UI",
];

export function Loader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "wipe" | "done">("loading");
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    // Already booted this session (back nav, reload, internal return) —
    // skip the full sequence, just run the curtain wipe.
    let booted = false;
    try {
      booted = sessionStorage.getItem("booted") === "1";
    } catch {
      // storage unavailable — run the full boot
    }
    if (booted || prefersReducedMotion()) {
      let id: ReturnType<typeof setTimeout> | undefined;
      const fast = requestAnimationFrame(() => {
        setProgress(1);
        setPhase("wipe");
        id = setTimeout(() => {
          setPhase("done");
          window.dispatchEvent(new CustomEvent("loader:done"));
        }, 500);
      });
      return () => {
        cancelAnimationFrame(fast);
        if (id) clearTimeout(id);
      };
    }

    let raf: number;
    const start = performance.now();
    const DURATION = 2200; // ms

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / DURATION);
      // Easing — slow at end
      const eased = 1 - Math.pow(1 - t, 2.6);
      setProgress(eased);
      setPhraseIdx(Math.min(PHRASES.length - 1, Math.floor(t * PHRASES.length)));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        try {
          sessionStorage.setItem("booted", "1");
        } catch {
          // ignore
        }
        // Boot chirp — silent unless the visitor opted into sound on a
        // previous visit (the toggle persists to localStorage)
        Sounds.boot();
        setPhase("wipe");
        setTimeout(() => {
          setPhase("done");
          // Allow body scroll after loader
          document.documentElement.style.overflow = "";
          // Hero intro (anime.js) waits for this before revealing text
          window.dispatchEvent(new CustomEvent("loader:done"));
        }, 900);
      }
    };
    document.documentElement.style.overflow = "hidden";
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  const pct = Math.round(progress * 100);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[10100] flex flex-col items-stretch justify-between bg-bg"
      style={{
        clipPath:
          phase === "wipe"
            ? "polygon(0 0, 100% 0, 100% 0, 0 0)"
            : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        transition:
          "clip-path 900ms cubic-bezier(.76,0,.24,1)",
      }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />

      {/* Top bar */}
      <div className="relative flex items-start justify-between p-6 md:p-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg/60">
          <div className="flex items-center gap-2">
            <span className="block h-2 w-2 rounded-full bg-red pulse-dot" />
            <span>SYS:INIT</span>
          </div>
          <div className="mt-1 text-[9px] text-fg/30">// NANDAKISHORE / FULL-STACK</div>
        </div>
        <div className="text-right font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
          <div>BUILD 2026.05</div>
          <div className="mt-1 text-fg/25">v0.1</div>
        </div>
      </div>

      {/* Center — name + percentage */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6">
        <div className="font-display text-[10vw] font-light leading-none tracking-tighter text-fg md:text-[7vw]">
          NANDAKISHORE
          <span className="text-blue glow-blue">.</span>
        </div>
        <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.4em] text-fg/40">
          {PHRASES[phraseIdx]}
        </div>

        {/* Huge percentage on lower-right corner */}
        <div className="absolute bottom-10 right-10 font-display text-[18vw] font-light leading-none tracking-tighter text-fg/[0.04] md:text-[12vw]">
          {String(pct).padStart(3, "0")}
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="relative p-6 md:p-10">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-fg/60">
          <span>LOADING</span>
          <span className="text-blue">{pct.toString().padStart(3, "0")}%</span>
        </div>
        <div className="relative h-[2px] w-full overflow-hidden bg-fg/10">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue via-orange to-red"
            style={{ width: `${pct}%`, transition: "width 80ms linear" }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-fg/30">
          <span>{PHRASES.map((_, i) => (i <= phraseIdx ? "■" : "□")).join(" ")}</span>
          <span>HYDERABAD · IST</span>
        </div>
      </div>
    </div>
  );
}
