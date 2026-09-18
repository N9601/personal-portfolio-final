"use client";

import { useEffect, useRef } from "react";
import { SplitReveal } from "@/components/SplitReveal";
import { MaskReveal } from "@/components/MaskReveal";
import { prefersReducedMotion } from "@/components/reducedMotion";

const STATS = [
  { value: "5", unit: "PROJ", label: "SHIPPED & WIP" },
  { value: "1%", unit: "TOP", label: "OF COHORT" },
  { value: "8", unit: "FIG", label: "REVENUE SCALE" },
  { value: "7+", unit: "LANG", label: "PROGRAMMING" },
];

const BIO_LINES = [
  "I'm a full-stack developer from Hyderabad,",
  "working remote as a Software Engineer (AI & Automation) while building things",
  "on the side: internal pipelines on n8n, custom systems in Go.",
  "",
  "I care about how systems feel. The friction between a click",
  "and the thing happening, the difference between fast and instant.",
  "",
  "Primary focus is dev, DevOps, and cloud security,",
  "now backed by a B.Tech in Computer Science",
  "and Engineering at VNR VJIET.",
];

export function About() {
  const portraitRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Reveal bio lines on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number(
              (e.target as HTMLElement).dataset.idx || 0
            );
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
            (e.target as HTMLElement).style.transitionDelay = `${idx * 80}ms`;
          }
        }
      },
      { threshold: 0.4 }
    );
    for (const el of lineRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // XRay portrait cursor reveal — on touch devices there's no cursor,
  // so run a slow autonomous scan sweep while the portrait is on screen.
  useEffect(() => {
    const el = portraitRef.current;
    if (!el) return;

    const isTouch = window.matchMedia(
      "(hover: none), (pointer: coarse)"
    ).matches;

    if (isTouch) {
      // Reduced motion: hold a fixed centered spotlight instead of the
      // wandering scan sweep.
      if (prefersReducedMotion()) {
        el.style.setProperty("--mx", "50%");
        el.style.setProperty("--my", "50%");
        const io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              el.style.setProperty("--reveal", e.isIntersecting ? "1" : "0");
            }
          },
          { threshold: 0.2 }
        );
        io.observe(el);
        return () => io.disconnect();
      }

      let raf = 0;
      let visible = false;
      const start = performance.now();
      const loop = () => {
        const t = (performance.now() - start) / 1000;
        // Lissajous-ish wander across the schematic
        const x = 50 + Math.sin(t * 0.5) * 32;
        const y = 50 + Math.sin(t * 0.33 + 1.2) * 36;
        el.style.setProperty("--mx", `${x}%`);
        el.style.setProperty("--my", `${y}%`);
        if (visible) raf = requestAnimationFrame(loop);
        else raf = 0;
      };
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            visible = e.isIntersecting;
          }
          el.style.setProperty("--reveal", visible ? "1" : "0");
          if (visible && !raf) raf = requestAnimationFrame(loop);
        },
        { threshold: 0.2 }
      );
      io.observe(el);
      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
      };
    }

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
      el.style.setProperty("--reveal", `1`);
    };
    const onLeave = () => {
      el.style.setProperty("--reveal", `0`);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      id="about"
      className="relative border-t border-fg/10 px-6 py-24 md:px-10 md:py-32"
    >
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />

      <div className="relative z-10 mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-fg/50">
        <span className="block h-px w-8 bg-orange" />
        <span>/// 09 — About</span>
      </div>

      <SplitReveal
        as="h2"
        text="Behind the terminal."
        className="relative z-10 mb-16 block font-display text-5xl font-light leading-[0.95] tracking-[-0.04em] text-fg md:text-7xl"
        stagger={28}
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        {/* Left: bio */}
        <div>
          <div className="space-y-1 font-display text-2xl font-light leading-snug tracking-tight text-fg md:text-3xl">
            {BIO_LINES.map((line, i) => (
              <div
                key={i}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                data-idx={i}
                style={{
                  opacity: 0,
                  transform: "translateY(20px)",
                  transition:
                    "opacity 700ms cubic-bezier(.2,.8,.2,1), transform 700ms cubic-bezier(.2,.8,.2,1)",
                }}
              >
                {line || <>&nbsp;</>}
              </div>
            ))}
          </div>

          {/* Stats grid */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={i}
                data-cursor="hover"
                className="border border-fg/15 p-4 transition hover:border-blue"
              >
                <div className="font-display text-3xl font-light text-fg md:text-4xl">
                  {s.value}
                  <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg/40">
                    {s.unit}
                  </span>
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-fg/45">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Interests */}
          <div className="mt-10">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
              /// Off the clock
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Performance Tuning",
                "Open-Source Android",
                "Music",
                "Films",
                "Photography",
              ].map((t) => (
                <span
                  key={t}
                  className="border border-fg/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg/55"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: XRay portrait */}
        <div className="relative">
          <div className="sticky top-32">
            <MaskReveal direction="up" duration={1100} accent>
            <div
              ref={portraitRef}
              data-cursor="view"
              data-cursor-label="HOVER"
              className="relative aspect-[3/4] w-full overflow-hidden border border-fg/15"
              style={{
                background: "var(--bg)",
                cursor: "none",
              }}
            >
              {/* Base layer: schematic / wireframe — on-brand instrument view */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent 0px, transparent 8px, rgba(0,102,255,0.08) 8px, rgba(0,102,255,0.08) 9px), repeating-linear-gradient(90deg, transparent 0px, transparent 8px, rgba(255,85,0,0.05) 8px, rgba(255,85,0,0.05) 9px), radial-gradient(ellipse at center, rgba(0,102,255,0.15), transparent 70%)",
                }}
              >
                <svg
                  viewBox="0 0 400 533"
                  className="h-full w-full"
                  fill="none"
                  stroke="rgba(102,170,255,0.4)"
                  strokeWidth="1"
                >
                  <ellipse cx="200" cy="180" rx="80" ry="100" />
                  <ellipse cx="200" cy="180" rx="80" ry="100" strokeDasharray="2 4" />
                  <ellipse cx="170" cy="170" rx="10" ry="6" />
                  <ellipse cx="230" cy="170" rx="10" ry="6" />
                  <line x1="200" y1="180" x2="200" y2="220" />
                  <path d="M170 230 Q200 250 230 230" />
                  <path d="M120 280 L200 320 L280 280" />
                  <path d="M200 320 L200 480" />
                  <path d="M120 280 L120 420 L160 480" />
                  <path d="M280 280 L280 420 L240 480" />
                  <g stroke="rgba(255,17,51,0.5)">
                    <line x1="50" y1="180" x2="120" y2="180" strokeDasharray="2 4" />
                    <text x="20" y="184" fill="rgba(245,245,245,0.5)" fontSize="9" fontFamily="monospace">
                      EYE.L
                    </text>
                    <line x1="280" y1="180" x2="350" y2="180" strokeDasharray="2 4" />
                    <text x="355" y="184" fill="rgba(245,245,245,0.5)" fontSize="9" fontFamily="monospace">
                      EYE.R
                    </text>
                    <line x1="50" y1="320" x2="120" y2="290" strokeDasharray="2 4" />
                    <text x="15" y="324" fill="rgba(245,245,245,0.5)" fontSize="9" fontFamily="monospace">
                      NECK
                    </text>
                  </g>
                  <text x="200" y="510" fill="rgba(245,245,245,0.6)" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    SUBJECT_01.GADUSATLA.N
                  </text>
                </svg>
              </div>

              {/* Reveal layer: cursor spotlight */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  opacity: "var(--reveal, 0)",
                  background:
                    "radial-gradient(circle 180px at var(--mx, 50%) var(--my, 50%), rgba(0,102,255,0.6), transparent 60%), radial-gradient(circle 220px at var(--mx, 50%) var(--my, 50%), rgba(255,85,0,0.3), transparent 70%)",
                  mixBlendMode: "screen",
                }}
              />

              <div className="pointer-events-none absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.3em] text-blue">
                ● SCANNING
              </div>
              <div className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] uppercase tracking-[0.3em] text-fg/40">
                CH.01
              </div>
              <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-fg/40">
                <span className="hidden md:inline">HOVER · DRAG</span>
                <span className="md:hidden">AUTO · SCAN</span>
                <span>200.180.001</span>
              </div>
            </div>
            </MaskReveal>
            <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
              <span className="hidden md:inline">/// Hover the schematic</span>
              <span className="md:hidden">/// Auto-scanning</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
