"use client";

import { useEffect, useState } from "react";

export function Not404() {}

export default function NotFound() {
  const [glitch, setGlitch] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setGlitch((g) => (g + 1) % 100);
    }, 90);
    return () => clearInterval(id);
  }, []);

  const offsetA = (glitch % 5) - 2;
  const offsetB = ((glitch * 7) % 6) - 3;
  const flick = glitch % 17 === 0;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-6 text-fg">
      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />

      {/* HUD corners */}
      <div className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
        <div className="flex items-center gap-2">
          <span className="block h-2 w-2 rounded-full bg-red pulse-dot" />
          <span>SYS: NULL_ROUTE</span>
        </div>
        <div className="mt-1 text-[9px] text-fg/30">// signal lost</div>
      </div>
      <div className="absolute right-6 top-6 text-right font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
        <div>ERR.404</div>
        <div className="mt-1 text-fg/25">page not found</div>
      </div>

      {/* Glitched 404 */}
      <div className="relative mb-8">
        <h1
          className="font-display text-[28vw] font-light leading-none tracking-tighter text-fg md:text-[18vw]"
          style={{ filter: flick ? "blur(2px)" : "none" }}
        >
          404
        </h1>
        {/* RGB split layers */}
        <h1
          aria-hidden
          className="pointer-events-none absolute inset-0 font-display text-[28vw] font-light leading-none tracking-tighter md:text-[18vw]"
          style={{
            color: "var(--red)",
            mixBlendMode: "screen",
            transform: `translate(${offsetA}px, 0)`,
            opacity: 0.7,
          }}
        >
          404
        </h1>
        <h1
          aria-hidden
          className="pointer-events-none absolute inset-0 font-display text-[28vw] font-light leading-none tracking-tighter md:text-[18vw]"
          style={{
            color: "var(--blue)",
            mixBlendMode: "screen",
            transform: `translate(${offsetB}px, 0)`,
            opacity: 0.7,
          }}
        >
          404
        </h1>
      </div>

      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-orange glow-orange">
        / ROUTE.UNREACHABLE
      </div>
      <p className="mb-10 max-w-md text-center font-display text-2xl font-light leading-tight tracking-tight text-fg/80 md:text-3xl">
        The page you&apos;re looking for doesn&apos;t exist,
        <br />
        <span className="text-fg/50">or was never built yet.</span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href="/"
          data-cursor="hover"
          data-cursor-label="HOME"
          className="group flex items-center gap-3 border border-blue bg-blue/10 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-fg transition hover:bg-blue/20"
        >
          <span>Return to home</span>
          <span className="text-blue transition group-hover:-translate-x-1">←</span>
        </a>
        <a
          href="/#contact"
          data-cursor="hover"
          data-cursor-label="CONTACT"
          className="border border-fg/20 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-fg/70 hover:border-orange hover:text-orange transition"
        >
          Report this route
        </a>
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-fg/30">
        <span>NANDAKISHORE / FULL-STACK</span>
        <span>{new Date().toISOString().slice(0, 19).replace("T", " · ")}</span>
      </div>
    </main>
  );
}
