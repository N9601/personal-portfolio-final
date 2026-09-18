"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll, stagger, utils, svg, type ScrollObserver } from "animejs";
import { prefersReducedMotion } from "@/components/reducedMotion";
import { DEMO_FACTORIES, type Demo, type DemoKey } from "./demos";

type Chapter = {
  id: string;
  demo: DemoKey;
  color: string;
  eyebrow: string;
  title: string;
  blurb: string;
  links: { label: string; href: string }[];
  tags: string[];
};

/**
 * animejs.com's feature gallery: text chapters scroll past while a
 * demo stage stays pinned. Each chapter swaps the demo, the accent
 * colour, the floating "toolbox" labels around the stage, and reveals
 * its link list with the site's line + stagger animation.
 */
const CHAPTERS: Chapter[] = [
  {
    id: "frontend",
    demo: "grid",
    color: "#4d9cff",
    eyebrow: "01 / Frontend",
    title: "Interfaces that feel inevitable",
    blurb:
      "Component systems in React and Next.js, typed end to end, with motion that explains the UI instead of decorating it.",
    links: [
      { label: "Design systems", href: "#projects" },
      { label: "Motion & micro-interactions", href: "#projects" },
      { label: "Accessibility first", href: "#about" },
    ],
    tags: ["react", "next.js", "typescript", "tailwind", "gsap", "anime.js"],
  },
  {
    id: "backend",
    demo: "clock",
    color: "#00ffaa",
    eyebrow: "02 / Backend",
    title: "Runs like clockwork",
    blurb:
      "Go and Node services on Postgres and Supabase. Typed APIs, row-level security, and the observability to prove it.",
    links: [
      { label: "Typed REST APIs", href: "#projects" },
      { label: "Row-level security", href: "#projects" },
      { label: "Storage engines", href: "#projects" },
    ],
    tags: ["go", "node.js", "supabase", "postgres", "rest", "lsm-tree"],
  },
  {
    id: "interaction",
    demo: "drag",
    color: "#a369ff",
    eyebrow: "03 / 3D & Interaction",
    title: "Springs, physics, and 60fps",
    blurb:
      "WebGL scenes with Three.js and hand-written shaders, gestures with real inertia, and a frame budget that never slips.",
    links: [
      { label: "Shader pipelines", href: "#projects" },
      { label: "Gesture-driven UI", href: "#skills" },
      { label: "Performance budgets", href: "#about" },
    ],
    tags: ["three.js", "webgl", "glsl", "canvas", "draggable", "springs"],
  },
  {
    id: "automation",
    demo: "track",
    color: "#ff7d36",
    eyebrow: "04 / Automation",
    title: "Pipelines on rails",
    blurb:
      "Event-driven n8n workflows gluing storefronts, CRMs, and ad platforms together, with retries and idempotency built in.",
    links: [
      { label: "Event-driven flows", href: "#experience" },
      { label: "Webhooks & cron", href: "#experience" },
      { label: "Ops dashboards", href: "#experience" },
    ],
    tags: ["n8n", "webhooks", "cron", "zapier", "shopify", "meta ads"],
  },
  {
    id: "infra",
    demo: "responsive",
    color: "#26f2d5",
    eyebrow: "05 / Infra & Cloud",
    title: "Ships anywhere, adapts everywhere",
    blurb:
      "Docker images through GitHub Actions to Vercel and Cloudflare. IAM, secrets, and TLS handled before the first deploy.",
    links: [
      { label: "CI / CD", href: "#skills" },
      { label: "Edge deploys", href: "#skills" },
      { label: "IAM & secrets", href: "#skills" },
    ],
    tags: ["docker", "github actions", "vercel", "cloudflare", "iam", "tls"],
  },
];

const N = CHAPTERS.length;

export function FeatureGallery() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGPathElement>(null);
  const leftRef = useRef<HTMLUListElement>(null);
  const rightRef = useRef<HTMLUListElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const spacerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!root || !stage || !left || !right) return;

    const reduced = prefersReducedMotion();
    const demos: Demo[] = CHAPTERS.map((c) => {
      const d = DEMO_FACTORIES[c.demo](stage);
      utils.set(d.el, { opacity: 0.001 });
      return d;
    });
    const observers: ScrollObserver[] = [];
    const labelsL = Array.from(left.querySelectorAll<HTMLLIElement>("li"));
    const labelsR = Array.from(right.querySelectorAll<HTMLLIElement>("li"));
    let active = -1;

    const setLabels = (tags: string[]) => {
      labelsL.forEach((li, i) => (li.textContent = tags[i] ?? ""));
      labelsR.forEach((li, i) => (li.textContent = tags[i + 3] ?? ""));
    };

    const activate = (i: number) => {
      if (active === i) return;
      const prev = active;
      active = i;
      const ch = CHAPTERS[i];
      root.style.setProperty("--accent-current", ch.color);

      if (prev >= 0) {
        demos[prev].leave();
        animate(demos[prev].el, { opacity: 0.001, duration: 250, ease: "inOut(3)" });
        const pt = textRefs.current[prev];
        if (pt) {
          animate(pt, { opacity: 0, y: -12, duration: 250, ease: "out(3)" });
          const ul = pt.querySelector<HTMLElement>(".feature-links");
          if (ul) animate(ul, { opacity: 0, duration: 200 });
        }
        animate([...labelsL, ...labelsR], { opacity: 0, duration: 150 });
      }

      demos[i].enter();
      animate(demos[i].el, { opacity: 1, duration: 250, ease: "inOut(3)" });
      const t = textRefs.current[i];
      if (t) {
        animate(t, { opacity: [0, 1], y: [12, 0], duration: 350, ease: "out(3)" });
        const ul = t.querySelector<HTMLElement>(".feature-links");
        if (ul) {
          animate(ul, {
            opacity: 1,
            "--scaleX": { to: [0, 1], duration: 300, ease: "inOut(2.4)" },
            duration: 350,
            ease: "inOut(3)",
          });
          animate(ul.querySelectorAll("li"), {
            opacity: [0.001, 1],
            duration: 250,
            delay: stagger(100, { start: 350 }),
            ease: "inOut(3)",
          });
          animate(ul.querySelectorAll(".icon"), {
            x: ["-.25rem", 0],
            duration: 250,
            delay: stagger(100, { start: 350 }),
            ease: "inOut(3)",
          });
        }
      }
      setTimeout(() => {
        if (active !== i) return;
        setLabels(ch.tags);
        animate(labelsL, { opacity: [0, 1], x: ["-.5rem", 0], duration: 300, delay: stagger(60) });
        animate(labelsR, { opacity: [0, 1], x: [".5rem", 0], duration: 300, delay: stagger(60) });
      }, 160);
    };

    if (reduced) {
      // No scroll choreography: show the first chapter, static.
      activate(0);
      demos[0].leave();
      return () => demos.forEach((d) => d.destroy());
    }

    CHAPTERS.forEach((_, i) => {
      const spacer = spacerRefs.current[i];
      if (!spacer) return;
      observers.push(
        onScroll({
          target: spacer,
          enter: "center top",
          leave: "center bottom",
          repeat: true,
          onEnter: () => activate(i),
          onEnterForward: () => activate(i),
          onEnterBackward: () => activate(i),
        })
      );
    });

    // Progress ring around the stage, scrubbed by the section's scroll.
    let ringAnim: ReturnType<typeof animate> | null = null;
    if (ringRef.current) {
      const drawable = svg.createDrawable(ringRef.current);
      ringAnim = animate(drawable, {
        draw: ["0 0", "0 1"],
        ease: "linear",
        autoplay: onScroll({
          target: root,
          enter: "top top",
          leave: "bottom bottom",
          sync: 0.2,
        }),
      });
    }

    return () => {
      observers.forEach((o) => o.revert());
      ringAnim?.revert();
      demos.forEach((d) => d.destroy());
      utils.remove([...labelsL, ...labelsR]);
    };
  }, []);

  return (
    <section
      id="toolbox"
      ref={rootRef}
      className="feature-gallery relative border-t border-fg/10"
      style={
        {
          height: `${(N + 1) * 100}vh`,
          "--accent-current": CHAPTERS[0].color,
        } as React.CSSProperties
      }
    >
      {/* invisible scroll spacers, one per chapter; the last one doubles
          so the final chapter dwells before the section unpins */}
      <div className="absolute inset-0" aria-hidden>
        {CHAPTERS.map((c, i) => (
          <div
            key={c.id}
            ref={(el) => {
              spacerRefs.current[i] = el;
            }}
            style={{ height: i === N - 1 ? "200vh" : "100vh" }}
          />
        ))}
      </div>

      <div className="sticky top-0 h-[100vh] overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />

        {/* Section header */}
        <div className="absolute left-6 top-20 z-20 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-fg/50 md:left-10 md:top-24">
          <span className="block h-px w-8" style={{ background: "var(--accent-current)" }} />
          <span>{"/// 02 — Toolbox"}</span>
        </div>

        {/* Chapter copy (stacked; only the active one is visible) */}
        <div className="absolute left-6 top-32 z-20 w-[calc(100%-3rem)] md:bottom-16 md:left-10 md:top-auto md:w-[26rem]">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.id}
              ref={(el) => {
                textRefs.current[i] = el;
              }}
              className="feature-text absolute left-0 top-0 w-full md:bottom-0 md:top-auto"
              style={{ opacity: 0 }}
            >
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--accent-current)" }}>
                {c.eyebrow}
              </div>
              <h2
                className="font-display font-medium leading-[0.95] tracking-[-0.03em] text-fg"
                style={{ fontSize: "clamp(1.75rem, 4vw, 3.25rem)" }}
              >
                {c.title}
              </h2>
              <p className="mt-4 max-w-sm font-display text-sm leading-relaxed text-fg/60 md:text-base">
                {c.blurb}
              </p>
              <ul className="feature-links mt-5 hidden md:block" style={{ opacity: 0 }}>
                {c.links.map((l) => (
                  <li key={l.label} className="relative">
                    <a
                      href={l.href}
                      data-cursor="hover"
                      className="group flex items-center gap-2 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-fg/60 transition-colors hover:text-[var(--accent-current)]"
                    >
                      <svg viewBox="0 0 24 24" className="icon h-4 w-4 text-fg/40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[var(--accent-current)]" aria-hidden>
                        <polygon fill="currentColor" points="17.737 11.987 12.5 17.225 11.263 15.987 14.388 12.862 6.5 12.862 6.5 11.112 14.388 11.112 11.263 7.987 12.5 6.75" />
                      </svg>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Pinned demo stage */}
        <div className="feature-stage-wrap absolute left-1/2 top-[58%] z-10 -translate-x-1/2 -translate-y-1/2 md:left-[62%] md:top-1/2">
          <svg viewBox="0 0 440 440" className="stage-ring pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            <circle cx="220" cy="220" r="212" fill="none" stroke="var(--accent-current)" strokeOpacity="0.12" strokeWidth="1" />
            <path
              ref={ringRef}
              d="M220 8 a212 212 0 1 1 -0.01 0"
              fill="none"
              stroke="var(--accent-current)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div ref={stageRef} className="feature-stage" />

          {/* floating toolbox labels */}
          <ul ref={leftRef} className="toolbox-labels toolbox-labels-left" aria-hidden>
            <li /><li /><li />
          </ul>
          <ul ref={rightRef} className="toolbox-labels toolbox-labels-right" aria-hidden>
            <li /><li /><li />
          </ul>
        </div>
      </div>
    </section>
  );
}
