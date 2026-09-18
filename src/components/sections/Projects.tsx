"use client";

import { useEffect, useRef, useState } from "react";
import { SplitReveal } from "@/components/SplitReveal";
import { ProjectModal, ProjectDetail } from "@/components/ProjectModal";
import { Sounds } from "@/components/Sound";

const PROJECTS: ProjectDetail[] = [
  {
    num: "01",
    title: "SolderDB",
    role: "Systems · Local-First Database",
    year: "2026",
    tags: ["Go", "LSM Tree", "Wails", "React", "SSE", "Bloom Filter", "CRC32C"],
    accent: [0.0, 0.7, 1.0],
    intro:
      "A local-first database with PocketBase / Supabase parity, built on a from-scratch Go LSM storage engine and shipped as a single Wails desktop executable.",
    problem:
      "Existing local-first BaaS options either ship as bloated runtimes (SQLite plus a server) or require Docker stacks. I wanted a single binary that gives you collections, auth, files, and realtime — and physically owns the storage layer instead of leaning on SQLite under the hood.",
    solution:
      "Wrote a complete LSM-tree storage engine in Go from scratch: WAL, memtable flush, SSTables, leveled compaction, bloom filters, CRC32C corruption detection. Wrapped it in a BaaS layer (collections, rules, auth, files, realtime via SSE), embedded an HTTP server on localhost:8787, packaged SDKs in JS and Go, and built a Wails React control center that talks to the engine directly via Wails bindings.",
    highlights: [
      "Custom LSM engine with WAL recovery — CRC32C hashing detects torn-tail writes on reboot and rolls back cleanly, so the database survives mid-write power loss.",
      "Power-aware compaction — reads OS battery and thermal state and pauses background work when the device is throttled.",
      "Bloom filters in front of disk reads skip lookups for keys that don't exist, killing expensive false-positive seeks.",
      "Native auth: bcrypt password hashing plus HMAC-SHA256 stateless session tokens.",
      "Realtime via Server-Sent Events — clients receive pushed database changes without polling.",
      "Multipart blob storage for file uploads, REST CRUD endpoints, JS and Go SDKs, plus a CLI for headless ops.",
      "Wails desktop GUI uses bindings (not HTTP) to talk to the engine — zero network overhead — and renders a live LSM visualizer where you watch the memtable fill and flush to disk in real time.",
    ],
    metrics: [
      { value: "Single", unit: "BIN", label: "Ships everything" },
      { value: "0", unit: "DEPS", label: "No SQLite, no Postgres" },
      { value: "SSE", label: "Realtime push" },
      { value: "LSM", label: "Custom engine" },
    ],
    links: [
      { label: "GitHub (in progress)", href: "https://github.com/N9601" },
    ],
    demo: "lsm",
  },
  {
    num: "02",
    title: "PyroOS",
    role: "Systems · Custom OS · In Progress",
    year: "2026—",
    tags: ["Assembly", "C", "x86", "Kernel", "Bare Metal", "QEMU"],
    accent: [1.0, 0.4, 0.05],
    intro:
      "A custom operating system built from the bootloader up — an x86 hobby kernel written to understand the deepest layer of the stack.",
    problem:
      "OS development is the deepest stack a developer can touch. Most courses stop at process-management theory; PyroOS forces every decision at every layer — memory map, interrupt routing, scheduler design. Building it teaches what every higher layer is hiding from you.",
    solution:
      "An assembly bootloader (boot.asm) transitions the CPU from Real to Protected Mode, sets up the Global Descriptor Table and Interrupt Descriptor Table, and ships a VGA text-mode driver — with a C kernel growing on top, developed and debugged entirely in QEMU.",
    highlights: [
      "boot.asm performs the Real Mode → Protected Mode transition, configures the GDT for segmented memory, installs the IDT for interrupt handling, and writes a raw VGA text driver.",
      "Single-source toolchain: NASM for assembly, gcc for C, QEMU for emulation and debugging.",
      "Goal: an OS small enough to understand end-to-end — every interrupt vector, every memory page, every scheduled task.",
    ],
    metrics: [
      { value: "WIP", label: "Active development" },
      { value: "x86", unit: "ASM", label: "Bare metal" },
      { value: "QEMU", label: "Dev loop" },
    ],
    links: [
      { label: "GitHub (private for now)", href: "https://github.com/N9601" },
    ],
  },
  {
    num: "03",
    title: "AlgoWizard",
    role: "Full-Stack · Educational Platform",
    year: "2025—26",
    tags: ["React", "Next.js", "TypeScript", "Supabase"],
    accent: [0.0, 0.4, 1.0],
    intro:
      "An educational ecosystem that turns abstract data structures and algorithms into real-time, interactive visualizations.",
    problem:
      "DSA courses lean on static diagrams and pseudocode. Students memorize without truly seeing the runtime: pointer movement, recursive call stacks, heap mutations. The gap between reading code and intuiting it is enormous.",
    solution:
      "A platform that animates every algorithm step in the browser. Users scrub through execution, watch state change, and learn by manipulation rather than reading. Supabase handles auth and tracks per-user progress across all modules.",
    highlights: [
      "Architected secure user auth and persistent state with Supabase row-level security.",
      "Optimized client-side rendering so heavy algorithmic simulations stay smooth even at high step counts.",
      "Modular learning-track system with progress persistence and resume-where-you-left-off semantics.",
      "Type-safe API surface across React + Next.js + Supabase to prevent runtime data shape mismatches.",
    ],
    metrics: [
      { value: "Realtime", label: "Visualization" },
      { value: "60", unit: "FPS", label: "Render target" },
    ],
    links: [{ label: "GitHub repo", href: "https://github.com/N9601" }],
  },
  {
    num: "04",
    title: "Coefficient",
    role: "Frontend · Logic Simulator",
    year: "2025—26",
    tags: ["Next.js", "React", "SSR"],
    accent: [1.0, 0.33, 0.0],
    intro:
      "A high-performance frontend tool for simulating complex system logic and performance optimization techniques in the browser.",
    problem:
      "Teaching computer architecture and logic-gate design usually means whiteboard diagrams or heavyweight EDA tools. Neither gives the immediate feedback loop students need to internalize how state propagates through a circuit.",
    solution:
      "Reusable logic components that handle sub-millisecond state transitions. Users wire gates together, toggle inputs, and watch results propagate instantly. SSR ensures fast initial paint and SEO accessibility for the educational content.",
    highlights: [
      "Custom reactive component layer with sub-millisecond logic state transitions.",
      "Server-side rendering for fast first paint and discoverability of teaching content.",
      "Reusable building blocks designed to compose into arbitrarily complex architectures.",
      "Low-latency input handling so the simulation feels responsive even with deep gate chains.",
    ],
    metrics: [
      { value: "<1", unit: "MS", label: "State transition" },
      { value: "SSR", label: "First paint" },
    ],
    links: [{ label: "GitHub repo", href: "https://github.com/N9601" }],
  },
  {
    num: "05",
    title: "This Portfolio",
    role: "Creative Engineering",
    year: "2026",
    tags: ["Three.js", "GLSL", "GSAP", "Next.js"],
    accent: [1.0, 0.07, 0.2],
    intro:
      "The site you're reading right now. A WebGL-driven portfolio built from scratch to feel like an instrument panel, not a document.",
    problem:
      "Most developer portfolios read like a resume in browser tabs. Static cards, generic transitions, no sense of the person behind the code. I wanted something that immediately said: I build performance interfaces.",
    solution:
      "An exploded motherboard hero in Three.js with custom GLSL shaders for animated traces. A folded 3D project gallery. Particle-sphere skill cloud. Magnetic buttons, mask reveals, hover curtains. Every section is its own micro-experience.",
    highlights: [
      "Custom Three.js scenes with shader-driven PCB traces, cursor-magnetic component physics, and additive-blend particles.",
      "Reusable motion primitives: SplitReveal, MaskReveal, RevealCard, MagneticButton.",
      "Procedural intro loader with curtain wipe, scroll progress, section navigator, keyboard shortcuts, optional sound system.",
      "All effects use performance.now() timing and pixel-ratio-clamped rendering for smooth 60fps on mid-range devices.",
    ],
    metrics: [
      { value: "10", label: "Sections" },
      { value: "60", unit: "FPS", label: "Render target" },
    ],
    links: [],
  },
];

// === Stack configuration
const STACK_VISIBLE = 3; // how many cards behind the top one are visible
const STACK_OFFSET_Y = 22; // px offset between each layer (more separation)
const STACK_SCALE_STEP = 0.06; // scale shrink per layer
const STACK_OPACITY_STEP = 0.22; // opacity drop per layer (deeper = dimmer)
const SWIPE_THRESHOLD = 120; // px drag before swipe commits

function rgbAccent(a: [number, number, number]) {
  return `rgb(${Math.round(a[0] * 255)}, ${Math.round(a[1] * 255)}, ${Math.round(
    a[2] * 255
  )})`;
}

function rgbaAccent(a: [number, number, number], alpha: number) {
  return `rgba(${Math.round(a[0] * 255)}, ${Math.round(a[1] * 255)}, ${Math.round(
    a[2] * 255
  )}, ${alpha})`;
}

export function Projects() {
  // Order of cards in the stack — first index is the TOP card
  const [order, setOrder] = useState<number[]>(() =>
    PROJECTS.map((_, i) => i)
  );
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // Drag state for the TOP card
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [exiting, setExiting] = useState<{
    idx: number;
    direction: 1 | -1;
  } | null>(null);

  const startRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const movedRef = useRef(false);

  // Programmatic swipe (button click)
  const swipe = (direction: 1 | -1) => {
    if (exiting) return;
    Sounds.swipe();
    const topIdx = order[0];
    setExiting({ idx: topIdx, direction });
    setDrag(null);
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setExiting(null);
    }, 420);
  };

  // Pointer drag handlers (top card only)
  const onPointerDown = (e: React.PointerEvent) => {
    if (exiting) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    movedRef.current = false;
    setDrag({ x: 0, y: 0 });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const start = startRef.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) movedRef.current = true;
    setDrag({ x: dx, y: dy });
  };
  // Browser took the gesture (vertical page scroll on touch) — just
  // spring back, never treat it as a tap.
  const onPointerCancel = (e: React.PointerEvent) => {
    startRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // capture may already be released
    }
    setDrag(null);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const start = startRef.current;
    startRef.current = null;
    if (!start) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    if (!drag) return;
    const elapsed = performance.now() - start.t;
    const speed = Math.abs(drag.x) / Math.max(elapsed, 1);
    const distance = Math.abs(drag.x);

    if (distance > SWIPE_THRESHOLD || speed > 0.6) {
      // Commit swipe
      swipe(drag.x > 0 ? 1 : -1);
    } else if (!movedRef.current) {
      // Treat as click — open modal
      Sounds.open();
      setOpenIdx(order[0]);
      setDrag(null);
    } else {
      // Spring back
      setDrag(null);
    }
  };

  // Keyboard shortcuts: left/right swipe when section is in focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const a = document.activeElement;
      if (
        a &&
        (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || (a as HTMLElement).isContentEditable)
      )
        return;
      const section = document.getElementById("projects");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4;
      if (!inView) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        swipe(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        swipe(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, exiting]);

  const topProjectIdx = order[0];
  const topProject = PROJECTS[topProjectIdx];

  return (
    <section
      id="projects"
      className="relative overflow-hidden border-t border-fg/10 px-6 py-24 md:px-10 md:py-32"
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />

      {/* Header */}
      <div className="relative z-10 mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-fg/50">
        <span className="block h-px w-8 bg-orange" />
        <span>/// 05 — Selected Work</span>
      </div>

      <div className="relative z-10 mb-12 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <SplitReveal
          as="h2"
          text="Projects."
          className="block font-display text-5xl font-light tracking-[-0.04em] text-fg md:text-7xl"
          stagger={60}
        />
        <div className="max-w-md font-mono text-[11px] leading-relaxed tracking-[0.15em] text-fg/55">
          <span className="text-orange">▸</span> Drag the top card to swipe.
          Tap to open the case study. Arrow keys also work.
        </div>
      </div>

      {/* Stack + info grid */}
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* Left: stack of cards — height clamped responsively */}
        <div
          className="relative mx-auto w-full max-w-[420px]"
          style={{ height: "clamp(420px, 75vw, 560px)" }}
        >
          {order.map((projectIdx, stackPos) => {
            const project = PROJECTS[projectIdx];
            const isTop = stackPos === 0;
            const isExitingCard = exiting?.idx === projectIdx;

            // Compute card transform based on stack position
            const depth = Math.min(stackPos, STACK_VISIBLE);
            const baseScale = 1 - depth * STACK_SCALE_STEP;
            const baseY = depth * STACK_OFFSET_Y;
            const baseOpacity = Math.max(0, 1 - depth * STACK_OPACITY_STEP);
            const hidden = stackPos > STACK_VISIBLE;

            // Drag transform for top card
            let dragX = 0;
            let dragY = 0;
            let dragRot = 0;
            if (isTop && drag && !isExitingCard) {
              dragX = drag.x;
              dragY = drag.y * 0.3;
              dragRot = drag.x * 0.04; // degrees
            }

            // Exit transform
            let exitTransform = "";
            if (isExitingCard && exiting) {
              const dir = exiting.direction;
              exitTransform = `translate3d(${dir * 700}px, 60px, 0) rotate(${dir * 24}deg)`;
            }

            const transform = isExitingCard
              ? exitTransform
              : `translate3d(${dragX}px, ${baseY + dragY}px, 0) scale(${baseScale}) rotate(${dragRot}deg)`;

            const transition = isExitingCard
              ? "transform 420ms cubic-bezier(.5,0,.75,0)"
              : drag && isTop
              ? "none"
              : "transform 500ms cubic-bezier(.2,.85,.2,1), opacity 500ms cubic-bezier(.2,.85,.2,1)";

            return (
              <div
                key={projectIdx}
                onPointerDown={isTop ? onPointerDown : undefined}
                onPointerMove={isTop ? onPointerMove : undefined}
                onPointerUp={isTop ? onPointerUp : undefined}
                onPointerCancel={isTop ? onPointerCancel : undefined}
                data-cursor={isTop ? "view" : undefined}
                data-cursor-label={isTop ? "DRAG · TAP" : undefined}
                className="absolute inset-0 select-none touch-pan-y"
                style={{
                  transform,
                  transition,
                  opacity: hidden ? 0 : isExitingCard ? 0 : baseOpacity,
                  zIndex: PROJECTS.length - stackPos,
                  willChange: "transform, opacity",
                  pointerEvents: isTop && !exiting ? "auto" : "none",
                }}
              >
                <CardFace project={project} isTop={isTop} />
              </div>
            );
          })}

          {/* Swipe direction indicators (faint when dragging) */}
          {drag && (
            <>
              <div
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 border border-fg/30 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-fg"
                style={{
                  opacity: Math.max(0, Math.min(1, -drag.x / SWIPE_THRESHOLD)),
                  background: "rgba(255,17,51,0.15)",
                  borderColor: "var(--red)",
                  color: "var(--red)",
                }}
              >
                ← NEXT
              </div>
              <div
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border border-fg/30 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-fg"
                style={{
                  opacity: Math.max(0, Math.min(1, drag.x / SWIPE_THRESHOLD)),
                  background: "rgba(0,102,255,0.15)",
                  borderColor: "var(--blue)",
                  color: "var(--blue)",
                }}
              >
                NEXT →
              </div>
            </>
          )}
        </div>

        {/* Right: project info that morphs with active card */}
        <div className="relative">
          <div
            key={topProject.num}
            style={{
              animation: "infoFade 500ms cubic-bezier(.2,.85,.2,1)",
            }}
          >
            <div
              className="mb-4 font-mono text-[10px] uppercase tracking-[0.35em]"
              style={{ color: rgbAccent(topProject.accent) }}
            >
              /// CASE.{topProject.num}
            </div>
            <div
              className="mb-2 font-display font-light leading-[0.85] tracking-tighter text-fg"
              style={{
                fontSize: "clamp(56px, 14vw, 100px)",
                textShadow: `0 0 35px ${rgbaAccent(topProject.accent, 0.45)}`,
              }}
            >
              {topProject.num}
            </div>
            <h3 className="font-display text-4xl font-light tracking-tight text-fg md:text-5xl">
              {topProject.title}
            </h3>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-fg/60">
              {topProject.role}{" "}
              <span className="text-fg/30">/ {topProject.year}</span>
            </div>
            <p className="mt-5 max-w-md font-mono text-[11px] leading-relaxed tracking-[0.05em] text-fg/65">
              {topProject.intro}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {topProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-fg/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-fg/55"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Controls */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  Sounds.open();
                  setOpenIdx(topProjectIdx);
                }}
                data-cursor="hover"
                data-cursor-label="OPEN"
                className="group flex items-center gap-3 border border-blue bg-blue/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fg transition hover:bg-blue/20"
              >
                <span>View case study</span>
                <span className="text-blue transition group-hover:translate-x-1">
                  ↗
                </span>
              </button>
              <button
                type="button"
                onClick={() => swipe(-1)}
                data-cursor="hover"
                data-cursor-label="PREV"
                className="flex h-12 w-12 items-center justify-center border border-fg/15 text-fg/70 transition hover:border-orange hover:text-orange"
                aria-label="Previous"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => swipe(1)}
                data-cursor="hover"
                data-cursor-label="NEXT"
                className="flex h-12 w-12 items-center justify-center border border-fg/15 text-fg/70 transition hover:border-blue hover:text-blue"
                aria-label="Next"
              >
                →
              </button>
            </div>

            {/* Counter + progress */}
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
                <span>
                  {String(
                    PROJECTS.findIndex((p) => p.num === topProject.num) + 1
                  ).padStart(2, "0")}{" "}
                  / {String(PROJECTS.length).padStart(2, "0")}
                </span>
                <span>Stack of {PROJECTS.length}</span>
              </div>
              <div className="flex gap-1">
                {PROJECTS.map((p, i) => {
                  const isCurrent = i === topProjectIdx;
                  return (
                    <button
                      key={p.num}
                      type="button"
                      onClick={() => {
                        if (i === topProjectIdx || exiting) return;
                        // Reorder so target is on top
                        const pos = order.indexOf(i);
                        const newOrder = [
                          ...order.slice(pos),
                          ...order.slice(0, pos),
                        ];
                        setOrder(newOrder);
                      }}
                      data-cursor="hover"
                      data-cursor-label={p.title.toUpperCase()}
                      className="h-1 flex-1 transition-all duration-500"
                      style={{
                        background: isCurrent
                          ? rgbAccent(p.accent)
                          : "rgba(245,245,245,0.12)",
                      }}
                      aria-label={`Jump to ${p.title}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProjectModal
        project={openIdx !== null ? PROJECTS[openIdx] : null}
        onClose={() => setOpenIdx(null)}
      />

      <style>{`
        @keyframes infoFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

// ---------- Card visual ----------

function CardFace({
  project,
  isTop = false,
}: {
  project: ProjectDetail;
  isTop?: boolean;
}) {
  const accent = rgbAccent(project.accent);
  const accentSoft = rgbaAccent(project.accent, 0.55);

  return (
    <div
      className="relative h-full w-full overflow-hidden border border-fg/25"
      style={{
        // SOLID dark base layer first, then accent tint on top — opaque,
        // so cards in the stack behind don't bleed through.
        background:
          `linear-gradient(155deg, ${rgbaAccent(project.accent, 0.75)} 0%, ${rgbaAccent(project.accent, 0.2)} 55%, rgba(15, 17, 25, 0.0) 100%), ` +
          `radial-gradient(at 80% 100%, ${rgbaAccent(project.accent, 0.2)}, transparent 60%), ` +
          "#0c0e16",
        boxShadow: `0 30px 60px -20px ${rgbaAccent(project.accent, 0.5)}, 0 0 0 1px ${accentSoft} inset`,
      }}
    >
      {/* Animated pulse halo on the top card to signal it's live */}
      {isTop && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: `inset 0 0 0 1px ${accent}`,
            animation: "cardPulse 2.4s ease-in-out infinite",
          }}
        />
      )}
      {/* Animated grid overlay */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-25"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 3px)",
        }}
        aria-hidden
      />

      {/* Top HUD */}
      <div className="absolute left-4 top-4 right-4 flex items-start justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg/80">
          /// CASE.{project.num}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg/60">
          {project.year}
        </div>
      </div>

      {/* Center number watermark */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[180px] font-light leading-none tracking-tighter text-fg/15 select-none"
        aria-hidden
      >
        {project.num}
      </div>

      {/* Bottom info */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg/70">
          {project.role}
        </div>
        <div className="mt-1 font-display text-3xl font-light leading-tight tracking-tight text-fg md:text-4xl">
          {project.title}
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-fg/55">
          <span>{project.tags.slice(0, 3).join(" · ")}</span>
          <span style={{ color: accent }}>↗</span>
        </div>
      </div>

      <style>{`
        @keyframes cardPulse {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
