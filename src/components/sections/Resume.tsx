"use client";

import { useEffect, useRef } from "react";
import { MagneticButton } from "@/components/MagneticButton";
import { SplitReveal } from "@/components/SplitReveal";
import { prefersReducedMotion } from "@/components/reducedMotion";

export function Resume() {
  const discRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = discRef.current;
    if (!el) return;
    // Static disc under reduced motion — the tick marks read fine still.
    if (prefersReducedMotion()) return;
    let raf: number;
    let rot = 0;
    const loop = () => {
      rot += 0.3;
      el.style.transform = `rotate(${rot}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="resume"
      className="relative overflow-hidden border-t border-fg/10 px-6 py-32 md:px-10 md:py-40"
    >
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />

      <div className="relative z-10 mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-fg/50">
        <span className="block h-px w-8 bg-orange" />
        <span>/// 08 — Resume</span>
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1fr]">
        {/* Left: text + magnetic CTA */}
        <div>
          <SplitReveal
            as="h2"
            text="The full document."
            className="block font-display text-3xl font-light leading-[0.95] tracking-[-0.04em] text-fg sm:whitespace-nowrap sm:text-5xl md:text-6xl"
            stagger={28}
          />
          <p className="mt-6 max-w-md font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-fg/55">
            <span className="text-orange">▸</span> Education, technical skills,
            projects, achievements. Two pages, no fluff.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <MagneticButton
              href="/Nandakishore_Reddy_CV.pdf"
              download
              label="DOWNLOAD"
              strength={0.5}
            >
              <div className="group flex items-center gap-4 border border-blue bg-blue/10 px-8 py-5 transition hover:bg-blue/20">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg">
                  Download CV
                </span>
                <span className="font-mono text-blue group-hover:translate-x-1 transition">
                  ↓ .PDF
                </span>
              </div>
            </MagneticButton>

            <MagneticButton
              href="/Nandakishore_Reddy_CV.pdf"
              target="_blank"
              label="VIEW"
              strength={0.5}
            >
              <div className="flex items-center gap-4 border border-fg/20 px-8 py-5 transition hover:border-orange hover:text-orange">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]">
                  View in browser
                </span>
                <span className="font-mono">↗</span>
              </div>
            </MagneticButton>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 max-w-md">
            <div className="border-l border-blue pl-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-fg/40">
                Last updated
              </div>
              <div className="mt-1 font-display text-xl text-fg">Q2 2026</div>
            </div>
            <div className="border-l border-orange pl-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-fg/40">
                Format
              </div>
              <div className="mt-1 font-display text-xl text-fg">PDF · 2 Pages</div>
            </div>
          </div>
        </div>

        {/* Right: spinning disc — clamps under 400 px on phones */}
        <div className="relative flex items-center justify-center">
          <div
            className="relative"
            style={{
              width: "min(400px, 88vw)",
              height: "min(400px, 88vw)",
            }}
          >
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-fg/15" />
            <div className="absolute inset-6 rounded-full border border-fg/10" />
            <div className="absolute inset-12 rounded-full border border-fg/10" />

            {/* Spinning disc */}
            <div
              ref={discRef}
              className="absolute inset-12"
              style={{ willChange: "transform" }}
            >
              <div className="relative h-full w-full rounded-full border border-blue/30 bg-gradient-to-br from-bg via-blue/5 to-bg">
                {/* Tick marks — each tick sits at the top of a full-size
                    wrapper rotated about the disc center, so the radius
                    follows the responsive disc size (no hardcoded px) */}
                {Array.from({ length: 60 }).map((_, i) => {
                  const angle = (i / 60) * 360;
                  const isMajor = i % 5 === 0;
                  return (
                    <div
                      key={i}
                      className="absolute inset-0"
                      style={{ transform: `rotate(${angle}deg)` }}
                    >
                      <div
                        className="absolute left-1/2 top-0 -translate-x-1/2"
                        style={{
                          height: isMajor ? "16px" : "8px",
                          width: "1px",
                          background: isMajor
                            ? "var(--blue)"
                            : "rgba(245,245,245,0.2)",
                        }}
                      />
                    </div>
                  );
                })}

                {/* Center hub */}
                <div className="absolute inset-1/3 flex items-center justify-center rounded-full border border-blue bg-bg">
                  <div className="text-center">
                    <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-fg/40">
                      VOL.
                    </div>
                    <div className="font-display text-3xl font-light text-blue glow-blue">
                      CV
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-orange">
                      2026
                    </div>
                  </div>
                </div>

                {/* Tracks */}
                <div className="absolute inset-[20%] rounded-full border border-fg/10" />
                <div className="absolute inset-[28%] rounded-full border border-fg/10" />
                <div className="absolute inset-[36%] rounded-full border border-fg/10" />
              </div>
            </div>

            {/* Fixed orbit text */}
            <div className="absolute inset-0">
              <svg viewBox="0 0 400 400" className="h-full w-full">
                <defs>
                  <path
                    id="orbitPath"
                    d="M 200,200 m -190,0 a 190,190 0 1,1 380,0 a 190,190 0 1,1 -380,0"
                  />
                </defs>
                <text
                  className="font-mono"
                  fill="rgba(245,245,245,0.4)"
                  fontSize="11"
                  letterSpacing="6"
                >
                  <textPath href="#orbitPath">
                    NANDAKISHORE.REDDY · CV · 2026 · HYD.IN · FULL-STACK ·
                    B.TECH CSE · ▸
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
