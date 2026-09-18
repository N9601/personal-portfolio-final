"use client";

import { useEffect, useRef, useState } from "react";
import { SplitReveal } from "@/components/SplitReveal";

type Entry = {
  year: string;
  title: string;
  org: string;
  location: string;
  highlight?: string;
  tags?: string[];
  kind: "education" | "leadership" | "award" | "work";
};

const TIMELINE: Entry[] = [
  {
    year: "2026 — Present",
    title: "B.Tech · Computer Science & Engineering",
    org: "VNR VJIET",
    location: "Hyderabad, India",
    highlight:
      "VNR Vignana Jyothi Institute of Engineering and Technology · Joined 2026, building core CS depth on top of the diploma",
    tags: ["Computer Science", "Engineering", "In Progress"],
    kind: "education",
  },
  {
    year: "Jan 2026 — Present",
    title: "Software Engineer – AI & Automation",
    org: "Verge Scales",
    location: "Remote · IST",
    highlight:
      "Automation pipelines for e-commerce and marketing (n8n-first), end-to-end logistics and supplier coordination, front-line customer relations. On the team through the company's revenue scale from 5-figure to 8-figure.",
    tags: [
      "n8n",
      "Automation",
      "E-commerce",
      "Logistics",
      "Suppliers",
      "Customer Ops",
      "Remote",
    ],
    kind: "work",
  },
  {
    year: "2026",
    title: "Academic Excellence",
    org: "TRR College of Technology",
    location: "Hyderabad",
    highlight: "Top 1% of the CSE department",
    tags: ["A+ Grade · Java", "A+ Grade · DSA", "A+ Grade · RDBMS"],
    kind: "award",
  },
  {
    year: "2023 — 2026",
    title: "Class Representative",
    org: "Polytechnic, TRR College",
    location: "Hyderabad",
    highlight:
      "Elected three years running · Liaison between students and faculty",
    tags: ["Leadership", "Tech tutoring", "Mentorship"],
    kind: "leadership",
  },
  {
    year: "2023 — Apr 2026",
    title: "Polytechnic Diploma · Computer Science & Engineering",
    org: "TRR College of Technology",
    location: "Hyderabad, India",
    highlight: "CGPA 9.18 / 10 · Top 1% of cohort · Completed April 2026",
    tags: ["Java", "Data Structures", "RDBMS", "Systems"],
    kind: "education",
  },
  {
    year: "2013 — 2023",
    title: "10th · CBSE",
    org: "Delhi School of Excellence",
    location: "Hyderabad, India",
    kind: "education",
  },
];

const KIND_META = {
  work: { label: "WORK", color: "var(--blue)" },
  education: { label: "EDU", color: "var(--blue)" },
  leadership: { label: "LEAD", color: "var(--orange)" },
  award: { label: "AWARD", color: "var(--red)" },
} as const;

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.8;
        const end = -rect.height + vh * 0.5;
        const raw = (start - rect.top) / (start - end);
        const progress = Math.min(1, Math.max(0, raw));
        line.style.transform = `scaleY(${progress})`;

        // Active entry highlighting
        const idx = Math.min(
          TIMELINE.length - 1,
          Math.floor(progress * TIMELINE.length * 0.999)
        );
        setActiveIdx(idx);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative border-t border-fg/10 px-6 py-24 md:px-10 md:py-32"
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />

      {/* Section label */}
      <div className="relative z-10 mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-fg/50">
        <span className="block h-px w-8 bg-orange" />
        <span>/// 06 — Experience</span>
      </div>

      {/* Title with orbiting text */}
      <div className="relative z-10 mb-16 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <SplitReveal
          as="h2"
          text="Path."
          className="font-display text-5xl font-light tracking-[-0.04em] text-fg md:text-7xl"
          stagger={60}
        />
        <div className="max-w-md font-mono text-[11px] leading-relaxed tracking-[0.15em] text-fg/55">
          <span className="text-orange">▸</span> Three years of engineering
          school, a remote engineering role, a B.Tech underway. The receipts.
        </div>
      </div>

      {/* Timeline */}
      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 h-full w-[2px] bg-fg/10 md:left-1/2 md:-translate-x-1/2" />
        <div
          ref={lineRef}
          className="absolute left-6 top-0 h-full w-[2px] origin-top bg-gradient-to-b from-blue via-orange to-red md:left-1/2 md:-translate-x-1/2"
          style={{ transform: "scaleY(0)" }}
        />

        {/* Entries */}
        <div className="space-y-12 md:space-y-20">
          {TIMELINE.map((entry, i) => {
            const meta = KIND_META[entry.kind];
            const isActive = i <= activeIdx;
            const isEven = i % 2 === 0;
            return (
              <div
                key={i}
                className="relative md:grid md:grid-cols-2 md:gap-12"
              >
                {/* Node marker */}
                <div className="absolute left-6 top-2 z-20 -translate-x-1/2 md:left-1/2">
                  <div
                    className="flex h-4 w-4 items-center justify-center rounded-full border bg-bg transition-all duration-700"
                    style={{
                      borderColor: isActive
                        ? meta.color
                        : "rgba(245,245,245,0.2)",
                      boxShadow: isActive
                        ? `0 0 18px ${meta.color}`
                        : "none",
                    }}
                  >
                    <div
                      className="h-1.5 w-1.5 rounded-full transition-all duration-700"
                      style={{
                        background: isActive ? meta.color : "rgba(245,245,245,0.2)",
                      }}
                    />
                  </div>
                </div>

                {/* Spacer for odd entries on desktop (right-aligned) */}
                {!isEven && <div className="hidden md:block" />}

                {/* Content */}
                <div
                  className={`pl-12 transition-all duration-700 md:pl-0 ${
                    isActive ? "opacity-100" : "opacity-40"
                  } ${!isEven ? "md:order-1 md:text-right" : ""}`}
                  data-cursor="hover"
                >
                  <div
                    className={`mb-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] ${
                      !isEven ? "md:justify-end" : ""
                    }`}
                  >
                    <span
                      className="border px-2 py-0.5"
                      style={{
                        borderColor: meta.color,
                        color: meta.color,
                      }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-fg/40">{entry.year}</span>
                  </div>
                  <h3 className="font-display text-2xl font-light leading-tight tracking-tight text-fg md:text-3xl">
                    {entry.title}
                  </h3>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-fg/60">
                    {entry.org}{" "}
                    <span className="text-fg/30">/ {entry.location}</span>
                  </div>
                  {entry.highlight && (
                    <p className="mt-3 max-w-md font-mono text-[11px] leading-relaxed tracking-[0.1em] text-fg/55">
                      <span className="text-blue">▸</span> {entry.highlight}
                    </p>
                  )}
                  {entry.tags && (
                    <div
                      className={`mt-4 flex flex-wrap gap-2 ${
                        !isEven ? "md:justify-end" : ""
                      }`}
                    >
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-fg/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-fg/55"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Year on opposite side (desktop only) */}
                <div
                  className={`hidden font-mono text-[11px] uppercase tracking-[0.3em] text-fg/30 md:block ${
                    !isEven ? "md:text-left" : "md:order-1 md:text-right"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
