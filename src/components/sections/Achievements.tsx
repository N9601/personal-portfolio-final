"use client";

import { useEffect, useRef } from "react";
import { SplitReveal } from "@/components/SplitReveal";
import { Hover3D } from "@/components/Hover3D";

type Achievement = {
  num: string;
  metric: string;
  unit?: string;
  label: string;
  desc: string;
  accent: "blue" | "orange" | "red";
};

const ITEMS: Achievement[] = [
  {
    num: "01",
    metric: "1%",
    unit: "TOP",
    label: "Of CSE Cohort",
    desc: "Graduated top of the polytechnic CSE program. Now pursuing a B.Tech in CSE at VNR VJIET.",
    accent: "blue",
  },
  {
    num: "02",
    metric: "8",
    unit: "FIG",
    label: "Revenue Scale",
    desc: "On the Verge Scales team through its growth from 5-figure to 8-figure revenue.",
    accent: "orange",
  },
  {
    num: "03",
    metric: "A+",
    label: "Core Modules",
    desc: "Java Programming, Data Structures, RDBMS — top grade across all.",
    accent: "red",
  },
  {
    num: "04",
    metric: "7+",
    unit: "LANG",
    label: "Programming Languages",
    desc: "JS, TS, Java, Python, C/C++, C#, SQL — fluency across paradigms.",
    accent: "blue",
  },
];

const ACCENT_COLOR = {
  blue: "var(--blue)",
  orange: "var(--orange)",
  red: "var(--red)",
} as const;

export function Achievements() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx || 0);
            const el = e.target as HTMLElement;
            el.style.transitionDelay = `${idx * 90}ms`;
            el.style.opacity = "1";
            el.style.transform = "translate3d(0, 0, 0)";
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.25 }
    );
    for (const el of cardsRef.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="achievements"
      className="relative overflow-hidden border-t border-fg/10 px-6 py-24 md:px-10 md:py-32"
    >
      <div className="absolute inset-0 grid-bg opacity-15" aria-hidden />

      {/* Background ribbon text */}
      <div
        className="pointer-events-none absolute -top-4 left-0 select-none whitespace-nowrap font-display text-[14vw] font-light leading-none tracking-tighter text-fg/[0.03] md:text-[10vw]"
        aria-hidden
        style={{ WebkitTextStroke: "1px rgba(245,245,245,0.04)" }}
      >
        RECEIPTS · RECEIPTS · RECEIPTS · RECEIPTS
      </div>

      <div className="relative z-10 mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-fg/50">
        <span className="block h-px w-8 bg-orange" />
        <span>/// 07 — Receipts</span>
      </div>

      <div className="relative z-10 mb-16 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <SplitReveal
          as="h2"
          text="Numbers."
          className="block font-display text-5xl font-light tracking-[-0.04em] text-fg md:text-7xl"
          stagger={60}
        />
        <div className="max-w-md font-mono text-[11px] leading-relaxed tracking-[0.15em] text-fg/55">
          <span className="text-orange">▸</span> Measurable proof. No
          rounding, no spin.
        </div>
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-px bg-fg/10 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((a, i) => (
          <div
            key={i}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            data-idx={i}
            className="relative"
            style={{
              opacity: 0,
              transform: "translate3d(0, 30px, 0)",
              transition:
                "opacity 700ms cubic-bezier(.2,.85,.2,1), transform 700ms cubic-bezier(.2,.85,.2,1)",
            }}
          >
          <Hover3D
            intensity={0.55}
            perspective={1100}
            glareOpacity={0.1}
            className="block h-full"
          >
          <div
            data-cursor="hover"
            className="group relative flex h-full flex-col justify-between bg-bg p-8 transition-all hover:bg-fg/[0.02]"
            style={{ minHeight: 320 }}
          >
            {/* Top: index */}
            <div className="flex items-start justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg/30">
                #{a.num}
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.3em] transition group-hover:translate-x-1"
                style={{ color: ACCENT_COLOR[a.accent] }}
              >
                ↗
              </span>
            </div>

            {/* Middle: huge metric */}
            <div className="my-10">
              <div
                className="font-display text-7xl font-light leading-none tracking-tight text-fg transition-all"
                style={{
                  textShadow: `0 0 30px ${ACCENT_COLOR[a.accent]}40`,
                }}
              >
                {a.metric}
                {a.unit && (
                  <span className="ml-1 font-mono text-base uppercase tracking-[0.2em] text-fg/40">
                    {a.unit}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom: label + desc */}
            <div>
              <div
                className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: ACCENT_COLOR[a.accent] }}
              >
                {a.label}
              </div>
              <p className="font-mono text-[11px] leading-relaxed tracking-[0.05em] text-fg/55">
                {a.desc}
              </p>
            </div>

            {/* Accent line bottom */}
            <div
              className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-700 group-hover:w-full"
              style={{ background: ACCENT_COLOR[a.accent] }}
            />
          </div>
          </Hover3D>
          </div>
        ))}
      </div>
    </section>
  );
}
