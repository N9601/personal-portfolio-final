"use client";

import { useEffect, useRef } from "react";
import { SplitReveal } from "@/components/SplitReveal";

type TrackItem = {
  label: string;
  detail: string;
};

type Track = {
  kicker: string;
  title: string;
  subtitle: string;
  accent: "blue" | "orange";
  items: TrackItem[];
  footer: string;
};

const BUILD: Track = {
  kicker: "/// BUILD",
  title: "Build",
  subtitle: "Making the thing",
  accent: "blue",
  items: [
    {
      label: "Full-Stack",
      detail: "React, Next.js, TypeScript, Supabase, Postgres",
    },
    {
      label: "Automation",
      detail: "n8n pipelines for e-commerce and marketing workflows",
    },
    {
      label: "Systems",
      detail: "Go, custom storage engines, low-level data paths",
    },
    {
      label: "Creative Frontend",
      detail: "Three.js, GLSL shaders, GSAP, WebGL",
    },
  ],
  footer: "What ships.",
};

const OPERATE: Track = {
  kicker: "/// OPERATE",
  title: "Operate",
  subtitle: "Keeping it running",
  accent: "orange",
  items: [
    {
      label: "DevOps",
      detail: "Docker, Kubernetes, CI/CD, Terraform, nginx",
    },
    {
      label: "Cloud Security",
      detail: "IAM, OAuth / JWT, secrets, networking, least privilege",
    },
    {
      label: "Cloud Platforms",
      detail: "Vercel, Cloudflare, AWS",
    },
    {
      label: "Linux",
      detail: "Servers, Bash, cron, systemd — comfortable at the shell",
    },
  ],
  footer: "What keeps it alive.",
};

const ACCENT_COLOR = {
  blue: "var(--blue)",
  orange: "var(--orange)",
} as const;

const ACCENT_GLOW = {
  blue: "rgba(0, 102, 255, 0.35)",
  orange: "rgba(255, 85, 0, 0.35)",
} as const;

export function Tracks() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translate3d(0, 0, 0)";
            observer.unobserve(e.target);
          }
        }
      },
      { threshold: 0.2 }
    );
    if (leftRef.current) observer.observe(leftRef.current);
    if (rightRef.current) observer.observe(rightRef.current);
    if (lineRef.current) observer.observe(lineRef.current);
    return () => observer.disconnect();
  }, []);

  const baseTransition =
    "opacity 800ms cubic-bezier(.2,.85,.2,1), transform 800ms cubic-bezier(.2,.85,.2,1)";

  return (
    <section
      id="tracks"
      className="relative overflow-hidden border-t border-fg/10 px-6 py-24 md:px-10 md:py-32"
    >
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />

      {/* Section label */}
      <div className="relative z-10 mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-fg/50">
        <span className="block h-px w-8 bg-orange" />
        <span>/// 11 — Tracks</span>
      </div>

      <div className="relative z-10 mb-16 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <SplitReveal
          as="h2"
          text="Focus."
          className="block font-display text-5xl font-light tracking-[-0.04em] text-fg md:text-7xl"
          stagger={60}
        />
        <div className="max-w-md font-mono text-[11px] leading-relaxed tracking-[0.15em] text-fg/55">
          <span className="text-orange">▸</span> Primary work is full-stack
          development with a DevOps and cloud-security bent. Building the
          thing and keeping it running are the same job.
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Two parallel columns with a connecting center line on desktop */}
        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-12">
          {/* Center divider with drawing line */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden -translate-x-1/2 md:block">
            <div className="absolute inset-0 w-px bg-fg/10" />
            <div
              ref={lineRef}
              className="absolute inset-x-0 top-0 w-px origin-top bg-gradient-to-b from-blue to-orange"
              style={{
                opacity: 0,
                transform: "scaleY(0)",
                transition:
                  "transform 1400ms cubic-bezier(.2,.85,.2,1), opacity 600ms",
              }}
            />
          </div>

          {/* Build */}
          <div
            ref={leftRef}
            style={{
              opacity: 0,
              transform: "translate3d(-30px, 0, 0)",
              transition: baseTransition,
            }}
          >
            <TrackColumn track={BUILD} align="left" />
          </div>

          {/* Operate */}
          <div
            ref={rightRef}
            style={{
              opacity: 0,
              transform: "translate3d(30px, 0, 0)",
              transition: baseTransition,
              transitionDelay: "150ms",
            }}
          >
            <TrackColumn track={OPERATE} align="right" />
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-fg/10 pt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40 md:flex-row md:items-center">
          <span>BUILD · SHIP</span>
          <span className="text-fg/25">// OPERATE · KEEP IT RUNNING</span>
        </div>
      </div>
    </section>
  );
}

function TrackColumn({
  track,
  align,
}: {
  track: Track;
  align: "left" | "right";
}) {
  const color = ACCENT_COLOR[track.accent];
  const glow = ACCENT_GLOW[track.accent];
  const alignClass = align === "right" ? "md:text-right md:items-end" : "";
  return (
    <div className={`flex flex-col ${alignClass}`}>
      <div
        className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em]"
        style={{ color }}
      >
        {track.kicker}
      </div>
      <h3
        className="font-display text-5xl font-light leading-none tracking-[-0.04em] text-fg md:text-6xl"
        style={{ textShadow: `0 0 30px ${glow}` }}
      >
        {track.title}
        <span style={{ color }}>.</span>
      </h3>
      <div
        className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em]"
        style={{ color: "rgba(245, 245, 245, 0.55)" }}
      >
        {track.subtitle}
      </div>

      <ul className="mt-8 space-y-5">
        {track.items.map((item, i) => (
          <li
            key={i}
            data-cursor="hover"
            className={`group relative pl-5 transition ${
              align === "right" ? "md:pl-0 md:pr-5" : ""
            }`}
          >
            <span
              className={`absolute top-1.5 block h-2 w-2 transition group-hover:scale-150 ${
                align === "right" ? "md:left-auto md:right-0 left-0" : "left-0"
              }`}
              style={{ background: color, boxShadow: `0 0 12px ${glow}` }}
            />
            <div className="font-display text-xl font-light text-fg md:text-2xl">
              {item.label}
            </div>
            <div className="mt-0.5 font-mono text-[11px] leading-relaxed tracking-[0.1em] text-fg/55">
              {item.detail}
            </div>
          </li>
        ))}
      </ul>

      <div
        className={`mt-10 border-t pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-fg/40`}
        style={{ borderColor: "rgba(245, 245, 245, 0.1)" }}
      >
        ▸ {track.footer}
      </div>
    </div>
  );
}
