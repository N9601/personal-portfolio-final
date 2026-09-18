"use client";

import { useEffect } from "react";
import { LsmVisualizer } from "@/components/LsmVisualizer";

export type ProjectDetail = {
  num: string;
  title: string;
  role: string;
  year: string;
  tags: string[];
  // Hue used to tint the modal accent
  accent: [number, number, number]; // r,g,b 0-1
  // Long-form content
  intro: string;
  problem: string;
  solution: string;
  highlights: string[];
  links?: { label: string; href: string }[];
  // Optional stat row
  metrics?: { value: string; unit?: string; label: string }[];
  // Optional interactive demo rendered inside the case study
  demo?: "lsm";
};

type Props = {
  project: ProjectDetail | null;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: Props) {
  // Esc closes; lock body scroll while open
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  const [r, g, b] = project.accent;
  const accentRgb = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  const accentRgba = (a: number) =>
    `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-stretch justify-center bg-bg/85 backdrop-blur-xl"
      onClick={onClose}
      style={{ animation: "modalFadeIn 300ms cubic-bezier(.2,.85,.2,1)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative my-0 flex w-full max-w-5xl flex-col overflow-y-auto border-fg/15 bg-bg mx-0 sm:my-8 sm:mx-4 sm:border md:mx-auto"
        style={{
          animation:
            "modalSlideUp 500ms cubic-bezier(.2,.85,.2,1)",
          boxShadow: `0 0 80px ${accentRgba(0.15)}`,
        }}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-fg/10 bg-bg/85 px-6 py-4 backdrop-blur-xl md:px-10">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
            <span className="block h-px w-6" style={{ background: accentRgb }} />
            <span style={{ color: accentRgb }}>/// CASE.STUDY</span>
            <span className="text-fg/30">·</span>
            <span>{project.num}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-cursor="hover"
            data-cursor-label="CLOSE"
            className="flex h-9 items-center gap-2 border border-fg/15 px-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fg transition hover:border-fg hover:text-fg"
            aria-label="Close"
          >
            <span>Close</span>
            <span className="text-fg/40">ESC</span>
          </button>
        </div>

        {/* Hero banner */}
        <div
          className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[5/2]"
          style={{
            background: `linear-gradient(135deg, ${accentRgba(0.85)} 0%, ${accentRgba(0.25)} 60%, var(--bg) 100%)`,
          }}
        >
          {/* Animated grid overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Big project title */}
          <div className="relative flex h-full flex-col justify-end p-6 md:p-10">
            <div
              className="mb-2 font-mono text-[11px] uppercase tracking-[0.35em] text-fg/85"
            >
              {project.role} · {project.year}
            </div>
            <h2 className="font-display text-4xl font-light leading-[0.95] tracking-[-0.04em] text-fg sm:text-5xl md:text-7xl">
              {project.title}
            </h2>
          </div>
          {/* Big number watermark */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 font-display text-[18vw] font-light leading-none tracking-tighter text-fg/15 md:text-[14vw]"
          >
            {project.num}
          </div>
        </div>

        {/* Body grid */}
        <div className="grid grid-cols-1 gap-10 p-6 md:grid-cols-[2fr_1fr] md:gap-12 md:p-10">
          {/* Left column */}
          <div>
            {/* Intro */}
            <p className="font-display text-2xl font-light leading-snug tracking-tight text-fg md:text-3xl">
              {project.intro}
            </p>

            {/* Problem / Solution */}
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <div
                  className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: accentRgb }}
                >
                  /// Problem
                </div>
                <p className="font-mono text-[12px] leading-relaxed tracking-[0.1em] text-fg/65">
                  {project.problem}
                </p>
              </div>
              <div>
                <div
                  className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: accentRgb }}
                >
                  /// Solution
                </div>
                <p className="font-mono text-[12px] leading-relaxed tracking-[0.1em] text-fg/65">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Interactive demo */}
            {project.demo === "lsm" && (
              <div className="mt-12">
                <div
                  className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: accentRgb }}
                >
                  /// Try the engine
                </div>
                <LsmVisualizer accent={accentRgb} />
                <p className="mt-3 font-mono text-[10px] leading-relaxed tracking-[0.1em] text-fg/45">
                  ▸ A toy-scale echo of SolderDB&apos;s storage path: writes hit
                  the WAL and memtable, full memtables flush to L0 SSTables,
                  full levels compact downward. The desktop app renders this
                  live from the real engine.
                </p>
              </div>
            )}

            {/* Highlights */}
            <div className="mt-12">
              <div
                className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: accentRgb }}
              >
                /// Key engineering
              </div>
              <ul className="space-y-3">
                {project.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 font-mono text-[12px] leading-relaxed tracking-[0.05em] text-fg/75"
                  >
                    <span
                      className="mt-1 block h-px w-6 flex-shrink-0"
                      style={{ background: accentRgb }}
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            {/* Tech stack */}
            <div>
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
                /// Stack
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="border border-fg/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg/65"
                    style={{
                      borderColor: accentRgba(0.3),
                      color: accentRgb,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <div>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
                  /// Numbers
                </div>
                <div className="grid grid-cols-2 gap-px bg-fg/10">
                  {project.metrics.map((m, i) => (
                    <div key={i} className="bg-bg p-4">
                      <div className="font-display text-2xl font-light text-fg">
                        {m.value}
                        {m.unit && (
                          <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg/40">
                            {m.unit}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-fg/45">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {project.links && project.links.length > 0 && (
              <div>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
                  /// Links
                </div>
                <div className="space-y-2">
                  {project.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        l.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      data-cursor="hover"
                      className="group flex items-center justify-between border border-fg/15 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-fg transition hover:bg-fg/[0.03]"
                      style={{ borderColor: accentRgba(0.2) }}
                    >
                      <span>{l.label}</span>
                      <span
                        className="transition group-hover:translate-x-1"
                        style={{ color: accentRgb }}
                      >
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between border-t border-fg/10 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40 md:px-10"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <span className="hidden sm:inline">
            NANDAKISHORE.REDDY / CASE.STUDY / {project.num}
          </span>
          <span className="sm:hidden">CASE.{project.num}</span>
          <button
            type="button"
            onClick={onClose}
            data-cursor="hover"
            className="text-fg/60 hover:text-fg transition"
          >
            ← Back to gallery
          </button>
        </div>

        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modalSlideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
