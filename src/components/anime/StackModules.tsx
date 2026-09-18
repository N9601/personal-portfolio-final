"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, onScroll, stagger, utils, type ScrollObserver, type Timeline } from "animejs";
import { prefersReducedMotion } from "@/components/reducedMotion";
import { SKILLS, CATEGORY_META, type Category } from "@/components/sections/Skills";

/**
 * animejs.com's "Bundle size" card: a stacked bar chart, one segment
 * per module, with the total counting up via a `roundPad` modifier and
 * a dotted legend. Here the modules are the skill categories and the
 * size is the summed weight of each category's entries.
 */

const ORDER: Category[] = ["lang", "front", "back", "data", "devops", "cloud", "sec", "auto", "tools"];

const MODULES = ORDER.map((cat) => {
  const items = SKILLS.filter((s) => s.cat === cat);
  const size = items.reduce((a, s) => a + (s.weight ?? 0.8), 0);
  return { cat, size, count: items.length, ...CATEGORY_META[cat] };
});
const TOTAL = MODULES.reduce((a, m) => a + m.size, 0);

export function StackModules() {
  const rootRef = useRef<HTMLElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sizeRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const total = totalRef.current;
    if (!root || !total) return;
    const bars = barRefs.current.filter(Boolean) as HTMLDivElement[];
    const sizes = sizeRefs.current.filter(Boolean) as HTMLSpanElement[];

    // Reduced motion, or the page was restored already scrolled past
    // the chart: render the final state without the count-up.
    if (prefersReducedMotion() || root.getBoundingClientRect().bottom < 0) {
      total.textContent = utils.roundPad(TOTAL, 1);
      bars.forEach((b, i) => (b.style.width = `${(MODULES[i].size / TOTAL) * 100}%`));
      sizes.forEach((s, i) => (s.textContent = utils.roundPad(MODULES[i].size, 1)));
      return;
    }

    bars.forEach((b) => (b.style.width = "0%"));
    total.textContent = "0.0";
    sizes.forEach((s) => (s.textContent = "0.0"));

    let tl: Timeline | null = null;
    const observers: ScrollObserver[] = [];

    const play = () => {
      tl?.cancel();
      tl = createTimeline({ defaults: { ease: "out(3)" } })
        .add(
          bars,
          {
            width: (_?: unknown, i = 0) => `${(MODULES[i].size / TOTAL) * 100}%`,
            duration: 900,
          },
          stagger(60)
        )
        .add(
          total,
          {
            innerHTML: [0, TOTAL],
            modifier: utils.roundPad(1),
            ease: "linear",
            duration: 1200,
          },
          0
        )
        .add(
          sizes,
          {
            innerHTML: (_?: unknown, i = 0) => MODULES[i].size,
            modifier: utils.roundPad(1),
            ease: "linear",
            duration: 900,
          },
          stagger(60, { start: 0 })
        )
        .add(
          root.querySelectorAll(".label-dot"),
          { scale: [0, 1], duration: 300, ease: "outBack" },
          stagger(40, { start: 200 })
        )
        .init();
    };
    const reset = () => {
      tl?.cancel();
      animate(bars, { width: "0%", duration: 300 });
      total.textContent = "0.0";
      sizes.forEach((s) => (s.textContent = "0.0"));
    };

    observers.push(
      onScroll({
        target: root,
        enter: "bottom-=15% top",
        leave: "top bottom",
        repeat: true,
        onEnterForward: play,
        onLeaveBackward: reset,
      })
    );
    return () => {
      tl?.cancel();
      observers.forEach((o) => o.revert());
      utils.remove([...bars, total, ...sizes]);
    };
  }, []);

  return (
    <section
      id="modules"
      ref={rootRef}
      className="relative border-t border-fg/10 px-6 py-20 md:px-10 md:py-28"
    >
      <div className="absolute inset-0 grid-bg opacity-10" aria-hidden />
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
        <div>
          <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-fg/50">
            <span className="block h-px w-8 bg-blue" />
            <span>{"/// 04 — Modules"}</span>
          </div>
          <h2
            className="font-display font-light leading-[0.95] tracking-[-0.04em] text-fg"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
          >
            A lightweight
            <br />
            and modular <span className="text-blue glow-blue">stack</span>.
          </h2>
          <p className="mt-5 max-w-md font-display text-base leading-relaxed text-fg/60">
            Every project pulls only the parts it needs. Weighted by how
            often each tool ships in my work, not by how many logos fit on
            a slide.
          </p>
        </div>

        {/* The card */}
        <div className="modules-sizes section-card border border-fg/15 bg-bg/70 p-5 backdrop-blur-md md:p-6">
          <div className="box-heading mb-4 flex items-center justify-between">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg/50">
              Stack weight
            </h3>
            <div className="modules-bundle-size font-mono text-sm text-fg">
              <span ref={totalRef} className="size text-blue">
                0.0
              </span>{" "}
              <span className="text-fg/40">pts</span>
            </div>
          </div>

          <div className="chart mb-4 flex h-4 w-full overflow-hidden bg-fg/[0.06]">
            {MODULES.map((m, i) => (
              <div
                key={m.cat}
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
                className="chart-bar h-full"
                style={{ width: "0%", background: m.color, willChange: "width" }}
                title={`${m.label} · ${utils.roundPad(m.size, 1)}`}
              />
            ))}
          </div>

          <ul className="modules-list grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
            {MODULES.map((m, i) => (
              <li
                key={m.cat}
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg/65"
              >
                <span
                  className="label-dot inline-block h-2 w-2 shrink-0 rounded-full"
                  style={{ background: m.color }}
                />
                <span>{m.label}</span>
                <span className="ml-auto text-fg/35">
                  +
                  <span
                    ref={(el) => {
                      sizeRefs.current[i] = el;
                    }}
                    className="size"
                  >
                    0.0
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
