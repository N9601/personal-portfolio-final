"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/reducedMotion";

export type Category =
  | "lang"
  | "front"
  | "back"
  | "data"
  | "devops"
  | "cloud"
  | "sec"
  | "tools"
  | "auto";

type Skill = {
  label: string;
  cat: Category;
  weight?: number; // 0..1 — affects scale + opacity
};

export const SKILLS: Skill[] = [
  // Languages
  { label: "JAVASCRIPT", cat: "lang", weight: 1.0 },
  { label: "TYPESCRIPT", cat: "lang", weight: 1.0 },
  { label: "PYTHON", cat: "lang", weight: 0.9 },
  { label: "GO", cat: "lang", weight: 0.85 },
  { label: "JAVA", cat: "lang", weight: 0.9 },
  { label: "C / C++", cat: "lang", weight: 0.8 },
  { label: "C#", cat: "lang", weight: 0.7 },
  { label: "BASH", cat: "lang", weight: 0.8 },
  { label: "SQL", cat: "lang", weight: 0.9 },
  { label: "HTML5", cat: "lang", weight: 0.95 },
  { label: "CSS3", cat: "lang", weight: 0.95 },
  // Frontend
  { label: "REACT", cat: "front", weight: 1.0 },
  { label: "NEXT.JS", cat: "front", weight: 1.0 },
  { label: "TAILWIND", cat: "front", weight: 0.95 },
  { label: "GSAP", cat: "front", weight: 0.8 },
  { label: "THREE.JS", cat: "front", weight: 0.8 },
  { label: "WEBGL", cat: "front", weight: 0.75 },
  // Backend
  { label: "NODE.JS", cat: "back", weight: 0.9 },
  { label: ".NET", cat: "back", weight: 0.7 },
  { label: "REST APIs", cat: "back", weight: 0.95 },
  // Data
  { label: "SUPABASE", cat: "data", weight: 0.95 },
  { label: "POSTGRES", cat: "data", weight: 0.9 },
  { label: "RDBMS", cat: "data", weight: 0.85 },
  // DevOps (learning, conservative)
  { label: "CI / CD", cat: "devops", weight: 0.8 },
  { label: "GITHUB ACTIONS", cat: "devops", weight: 0.85 },
  { label: "DOCKER", cat: "devops", weight: 0.8 },
  { label: "KUBERNETES", cat: "devops", weight: 0.7 },
  { label: "TERRAFORM", cat: "devops", weight: 0.7 },
  { label: "NGINX", cat: "devops", weight: 0.75 },
  // Cloud
  { label: "VERCEL", cat: "cloud", weight: 0.95 },
  { label: "CLOUDFLARE", cat: "cloud", weight: 0.75 },
  { label: "AWS", cat: "cloud", weight: 0.7 },
  // Cloud Sec (focus area, learning)
  { label: "CLOUD SEC", cat: "sec", weight: 0.8 },
  { label: "IAM", cat: "sec", weight: 0.75 },
  { label: "OAUTH / JWT", cat: "sec", weight: 0.85 },
  { label: "SECRETS MGMT", cat: "sec", weight: 0.75 },
  { label: "NETWORKING", cat: "sec", weight: 0.8 },
  { label: "TLS", cat: "sec", weight: 0.75 },
  // Automation (day job)
  { label: "N8N", cat: "auto", weight: 1.0 },
  { label: "AUTOMATION", cat: "auto", weight: 0.95 },
  { label: "WORKFLOWS", cat: "auto", weight: 0.9 },
  { label: "WEBHOOKS", cat: "auto", weight: 0.95 },
  { label: "API INTEGRATION", cat: "auto", weight: 0.95 },
  { label: "E-COMMERCE OPS", cat: "auto", weight: 0.85 },
  { label: "MARKETING OPS", cat: "auto", weight: 0.85 },
  { label: "ZAPIER", cat: "auto", weight: 0.7 },
  { label: "CRON", cat: "auto", weight: 0.85 },
  // Tools
  { label: "GIT", cat: "tools", weight: 1.0 },
  { label: "LINUX", cat: "tools", weight: 0.95 },
  { label: "VS CODE", cat: "tools", weight: 0.95 },
  { label: "AGILE", cat: "tools", weight: 0.85 },
  { label: "FIGMA", cat: "tools", weight: 0.8 },
];

export const CATEGORY_META: Record<
  Category,
  { color: string; bg: string; label: string }
> = {
  lang: { color: "#88bbff", bg: "rgba(0,102,255,0.08)", label: "LANG" },
  front: { color: "#88bbff", bg: "rgba(0,102,255,0.08)", label: "FRONT" },
  back: { color: "#aaccff", bg: "rgba(50,120,255,0.08)", label: "BACK" },
  data: { color: "#bbccff", bg: "rgba(80,140,255,0.08)", label: "DATA" },
  devops: { color: "#ff9966", bg: "rgba(255,85,0,0.08)", label: "DEVOPS" },
  cloud: { color: "#ffaa77", bg: "rgba(255,100,30,0.08)", label: "CLOUD" },
  sec: { color: "#ff5577", bg: "rgba(255,17,51,0.1)", label: "SEC" },
  tools: { color: "#cccccc", bg: "rgba(245,245,245,0.04)", label: "TOOLS" },
  auto: { color: "#88ff99", bg: "rgba(40,200,80,0.08)", label: "AUTO" },
};

/**
 * Text-built Skills sphere.
 *
 * Every skill label is its own DOM element positioned in 3D via a
 * Fibonacci sphere distribution. A parent group rotates each frame
 * (auto-rotation + cursor steering), and we project each label to 2D
 * screen coordinates so the text stays upright (no per-label
 * counter-rotation needed). Front-facing labels are bright and large,
 * back-facing labels fade out and shrink.
 *
 * This replaces the previous WebGL particle cloud — the labels
 * themselves now ARE the sphere, no generic dots.
 */
export function Skills() {
  const mountRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const tagLayer = tagsRef.current;
    const mount = mountRef.current;
    if (!tagLayer || !mount) return;

    // Reduced motion: project the sphere once so every label has a
    // position, then hold still — no drift, no steering.
    const reduced = prefersReducedMotion();

    // Sphere radius scales with viewport so labels don't overlap on
    // small screens. Phone: ~140-170. Tablet: ~220. Desktop: ~300.
    const radiusFor = (w: number) => {
      if (w < 480) return Math.max(130, w * 0.34);
      if (w < 900) return Math.max(200, w * 0.27);
      return Math.min(320, w * 0.22);
    };
    let RADIUS = radiusFor(window.innerWidth);
    const N = SKILLS.length;

    // Pre-compute UNIT positions on Fibonacci sphere — multiply by
    // current RADIUS at render time so a resize can update the layout
    // without rebuilding the array.
    const baseUnits = SKILLS.map((_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return {
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.cos(phi),
        z: Math.sin(theta) * Math.sin(phi),
      };
    });

    const onResize = () => {
      RADIUS = radiusFor(window.innerWidth);
    };
    window.addEventListener("resize", onResize);

    // Rotation state (radians)
    const rot = { y: 0, x: 0 };
    const target = { y: 0, x: 0 };

    const onMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      target.y = nx * 0.6; // horizontal cursor → Y rotation
      target.x = -ny * 0.4; // vertical cursor → X rotation
    };
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    // Gyroscope steering on touch devices — there's no cursor, so tilt
    // the phone instead. Android fires deviceorientation freely; iOS
    // requires a permission gesture, where this just never fires and
    // the globe keeps its auto-drift.
    let onOrient: ((e: DeviceOrientationEvent) => void) | null = null;
    if (!reduced && window.matchMedia("(pointer: coarse)").matches) {
      onOrient = (e: DeviceOrientationEvent) => {
        if (e.gamma == null || e.beta == null) return;
        // gamma: left/right tilt (−90..90), beta: pitch — neutral
        // hand-held pitch is ~45°, so steer relative to that.
        target.y = Math.max(-1, Math.min(1, e.gamma / 40)) * 0.6;
        target.x = Math.max(-1, Math.min(1, (e.beta - 45) / 40)) * 0.4;
      };
      window.addEventListener("deviceorientation", onOrient, {
        passive: true,
      });
    }

    let raf = 0;
    let visible = true;
    let docVisible = true;
    const start = performance.now();

    // Pause the per-frame DOM transform updates when the section is
    // off-screen or the tab is backgrounded. With ~55 labels updating
    // transform/opacity every frame, this is meaningful CPU savings.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
        }
        if (visible && docVisible && !raf) {
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.01 }
    );
    io.observe(mount);

    const onVis = () => {
      docVisible = document.visibilityState === "visible";
      if (visible && docVisible && !raf) {
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    const tick = () => {
      // Frozen scene time under reduced motion — one static projection.
      const t = reduced ? 0 : (performance.now() - start) / 1000;

      // Ease cursor target
      rot.y += (target.y - rot.y) * 0.06;
      rot.x += (target.x - rot.x) * 0.06;

      // Auto-drift on top of cursor steering
      const ry = rot.y + t * 0.12;
      const rx = rot.x + Math.sin(t * 0.2) * 0.05;

      const cy = Math.cos(ry);
      const sy = Math.sin(ry);
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);

      const rect = mount.getBoundingClientRect();
      const cw = rect.width / 2;
      const ch = rect.height / 2;
      const camZ = 900; // virtual camera distance for perspective math

      for (let i = 0; i < N; i++) {
        const el = cardsRef.current[i];
        if (!el) continue;
        const u = baseUnits[i];
        const px = u.x * RADIUS;
        const py = u.y * RADIUS;
        const pz = u.z * RADIUS;

        // rotateY then rotateX
        const x1 = px * cy - pz * sy;
        const z1 = px * sy + pz * cy;
        const y1 = py * cx - z1 * sx;
        const z2 = py * sx + z1 * cx;

        // Perspective projection
        const scale = camZ / (camZ + z2);
        const screenX = cw + x1 * scale;
        const screenY = ch + y1 * scale;

        // Depth factor: 1 at front, 0 at back
        const facing = (z2 + RADIUS) / (RADIUS * 2);
        const opacity = Math.max(0, Math.min(1, facing * 1.6 - 0.05));
        const baseScale = 0.65 + facing * 0.55;

        el.style.transform = `translate3d(${screenX.toFixed(2)}px, ${screenY.toFixed(2)}px, 0) translate(-50%, -50%) scale(${baseScale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(Math.round(facing * 100));
      }

      if (visible && docVisible && !reduced) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      if (onOrient) window.removeEventListener("deviceorientation", onOrient);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      id="skills"
      className="relative min-h-[100svh] w-full overflow-hidden border-t border-fg/10"
    >
      {/* Background ribbon text */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[20vw] font-light leading-none tracking-tighter text-fg/[0.025] md:text-[14vw]"
        aria-hidden
        style={{ WebkitTextStroke: "1px rgba(245,245,245,0.04)" }}
      >
        STACK · STACK
      </div>

      {/* Section label */}
      <div className="absolute left-6 top-12 z-30 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-fg/50 md:left-10">
        <span className="block h-px w-8 bg-orange" />
        <span>/// 03 — Stack</span>
      </div>

      {/* Title */}
      <h2 className="pointer-events-none absolute left-6 top-20 z-20 block font-display text-5xl font-light tracking-[-0.04em] text-fg md:left-10 md:top-24 md:text-7xl">
        Skills<span className="text-blue glow-blue">.</span>
      </h2>

      {/* Description */}
      <div className="pointer-events-none absolute left-6 bottom-12 z-30 max-w-md md:left-10">
        <p className="font-mono text-[11px] leading-relaxed tracking-[0.15em] text-fg/55">
          <span className="text-blue">▸</span> <span className="hidden md:inline">Move your cursor to steer the
          globe.</span><span className="md:hidden">Tilt your phone to steer the globe.</span>{" "}
          {SKILLS.length} entries across language, framework, DevOps,
          cloud, security, and automation.
        </p>
      </div>

      {/* Top-right meta — desktop only, collides with the title on phones */}
      <div className="pointer-events-none absolute right-6 top-12 z-30 hidden text-right font-mono text-[10px] uppercase tracking-[0.25em] text-fg/40 md:right-10 md:block">
        <div className="text-fg/30">/// STACK</div>
        <div className="mt-1">Active rotation</div>
      </div>

      {/* Bottom-right meta — desktop only, overlaps the description on phones */}
      <div className="pointer-events-none absolute right-6 bottom-12 z-30 hidden text-right font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40 md:right-10 md:block">
        <div>{SKILLS.length} entries</div>
        <div className="text-fg/25">cursor to disturb</div>
      </div>

      {/* Category legend — hidden below tablet to free up space */}
      <div className="pointer-events-none absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 lg:flex md:right-10">
        {(["lang", "front", "back", "data", "devops", "cloud", "sec", "auto", "tools"] as Category[]).map(
          (c) => (
            <div
              key={c}
              className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em]"
              style={{ color: CATEGORY_META[c].color }}
            >
              <span
                className="block h-1.5 w-1.5"
                style={{ background: CATEGORY_META[c].color }}
              />
              <span>{CATEGORY_META[c].label}</span>
            </div>
          )
        )}
      </div>

      {/* Sphere mount + tags */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-10"
        style={{ perspective: "1200px" }}
      >
        <div ref={tagsRef} className="pointer-events-none absolute inset-0">
          {SKILLS.map((skill, i) => {
            const meta = CATEGORY_META[skill.cat];
            const weight = skill.weight ?? 0.8;
            return (
              <a
                key={skill.label}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                href="#"
                onClick={(e) => e.preventDefault()}
                data-cursor="hover"
                data-cursor-label={skill.label}
                className="pointer-events-auto absolute left-0 top-0 select-none whitespace-nowrap border px-2.5 py-1 font-mono uppercase tracking-[0.2em] backdrop-blur-md transition-colors hover:bg-fg/[0.06]"
                style={{
                  fontSize: `clamp(9px, ${0.4 + weight * 0.3}vw, ${10 + weight * 3}px)`,
                  borderColor: meta.color + "60",
                  background: meta.bg,
                  color: meta.color,
                  willChange: "transform, opacity",
                }}
              >
                {skill.label}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
