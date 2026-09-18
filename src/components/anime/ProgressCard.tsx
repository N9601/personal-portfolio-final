"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  createAnimatable,
  createDraggable,
  createTimeline,
  onScroll,
  stagger,
  utils,
  type Draggable,
  type ScrollObserver,
} from "animejs";
import { prefersReducedMotion } from "@/components/reducedMotion";

/**
 * animejs.com's bottom "sub-nav": a tick-marked scroll bar with a red
 * cursor you can drag to scrub the whole page, a ghost cursor that
 * follows the pointer, one click-target per section, and a code card
 * that slides up while the matching section is on screen.
 *
 * Fixed bottom-centre so it doesn't collide with the "Currently" HUD
 * (bottom-right) or the sound toggle (bottom-left).
 */

type Section = { id: string; label: string; code?: string };

const SECTIONS: Section[] = [
  {
    id: "home",
    label: "Hero",
    code: `splitText('#intro h1', { chars: true })
animate(chars, {
  x: ['.35em', 0],
  opacity: [0, 1],
  delay: stagger(25, { ease: 'outIn(2)' }),
  ease: 'outQuint',
});`,
  },
  {
    id: "toolbox",
    label: "Toolbox",
    code: `createTimeline({ loop: true })
  .add('.dot', {
    scale: stagger([1.1, .75], { grid, from: 'center' }),
    ease: 'inOutQuad',
  }, stagger(200, { grid, from: 'center' }));`,
  },
  {
    id: "skills",
    label: "Skills",
    code: `const sphere = SKILLS.map((_, i) => {
  const phi = acos(1 - 2 * (i + .5) / N);
  const theta = PI * (1 + sqrt(5)) * i;
  return [cos(theta) * sin(phi), cos(phi), sin(theta) * sin(phi)];
});`,
  },
  {
    id: "projects",
    label: "Projects",
    code: `animate('.project-card', {
  y: [40, 0],
  opacity: [0, 1],
  delay: stagger(80),
  autoplay: onScroll({ enter: 'bottom-=10% top' }),
});`,
  },
  {
    id: "experience",
    label: "Experience",
    code: `createTimeline()
  .add('.tick', { y: '-=6', duration: 50 }, stagger(10))
  .add('.ticker', { rotate: 360, duration: 1920 }, '<');`,
  },
  { id: "achievements", label: "Numbers" },
  { id: "resume", label: "Resume" },
  {
    id: "about",
    label: "About",
    code: `createScope({ mediaQueries: { portrait: '(orientation: portrait)' } })
  .add(({ matches }) => {
    createTimeline().add('.circle', {
      y: matches.portrait ? 0 : [-50, 50, -50],
    }, stagger(100));
  });`,
  },
  { id: "interests", label: "Off the clock" },
  { id: "tracks", label: "Tracks" },
  {
    id: "contact",
    label: "Contact",
    code: `createDraggable('.circle', {
  releaseEase: createSpring({ stiffness: 120, damping: 6 }),
});
await navigator.clipboard.writeText(EMAIL);`,
  },
];

export function ProgressCard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const cardRefs = useRef<(HTMLPreElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const card = cardRef.current;
    const bar = barRef.current;
    const cursor = cursorRef.current;
    const ghost = ghostRef.current;
    if (!root || !card || !bar || !cursor || !ghost) return;
    if (prefersReducedMotion()) return;
    // Touch devices get the top edge bar from ScrollProgress instead.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const els = SECTIONS.map((s) => document.getElementById(s.id));
    const codeCards = cardRefs.current.filter(Boolean) as HTMLPreElement[];
    const observers: ScrollObserver[] = [];
    let shown = false;
    let grabbed = false;

    // Size each click-target proportionally to its section's height so
    // the buttons line up with where the cursor actually is.
    const layoutButtons = () => {
      const total = els.reduce((a, el) => a + (el?.offsetHeight ?? 0), 0) || 1;
      buttonRefs.current.forEach((b, i) => {
        if (b) b.style.width = `${((els[i]?.offsetHeight ?? 0) / total) * 100}%`;
      });
    };
    layoutButtons();
    window.addEventListener("resize", layoutButtons);

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollToProgress = (p: number) => {
      window.scrollTo(0, maxScroll() * utils.clamp(p, 0, 1));
    };
    const progressFromEvent = (e: MouseEvent) => {
      const r = bar.getBoundingClientRect();
      return utils.snap(1 / 65).round(4).clamp(0, 1)((e.clientX - r.left) / r.width);
    };

    // Show / hide the whole card near the page edges, like the site.
    const show = () => {
      if (shown) return;
      shown = true;
      utils.set(card, { pointerEvents: "auto" });
      createTimeline()
        .add(card, { opacity: 1, y: ["100%", 0], duration: 250 })
        .add(buttonRefs.current.filter(Boolean), {
          opacity: [0, 0.5],
          duration: 250,
          delay: stagger(20),
        })
        .add(cursor, { opacity: [0, 1], scale: [0, 1.2, 1], duration: 250 }, "<<+=250")
        .init();
    };
    const hide = () => {
      if (!shown) return;
      shown = false;
      utils.set(card, { pointerEvents: "none" });
      createTimeline().add(card, { opacity: 0, y: "100%", duration: 250 }).init();
    };

    // Ghost cursor that trails the pointer along the bar
    const ghostAnim = createAnimatable(ghost, { x: 150, scale: 250, opacity: 150 });
    const ghostShow = () => {
      ghostAnim.opacity(1);
      ghostAnim.scale(1);
    };
    const ghostHide = () => {
      ghostAnim.opacity(0);
      ghostAnim.scale(0);
    };

    const grow = () => animate(cursor, { scale: 1.25, duration: 250 });
    const shrink = () => animate(cursor, { scale: 1, duration: 150 });

    utils.set(cursor, { x: 0, scale: 1 });
    const drag: Draggable = createDraggable(cursor, {
      y: false,
      container: bar,
      containerFriction: 1,
      containerPadding: [0, -1, 0, -1],
      onGrab: () => {
        grabbed = true;
        grow();
        ghostHide();
      },
      onRelease: (d) => {
        grabbed = false;
        shrink();
        if (d.progressX < 0.02 || d.progressX > 0.98) hide();
        else show();
      },
      onUpdate: (d) => {
        if (d.grabbed) scrollToProgress(d.progressX);
      },
    });
    drag.progressX = 0;

    const onBarClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t && !t.classList.contains("scroll-cursor")) {
        e.preventDefault();
        scrollToProgress(progressFromEvent(e));
      }
    };
    const onBarMove = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t && !t.classList.contains("scroll-cursor") && !drag.grabbed) {
        ghostAnim.x(progressFromEvent(e) * bar.offsetWidth - 2);
        ghostShow();
      } else {
        ghostHide();
      }
    };
    bar.addEventListener("click", onBarClick);
    bar.addEventListener("mousemove", onBarMove);
    bar.addEventListener("mouseenter", ghostShow);
    bar.addEventListener("mouseleave", ghostHide);
    cursor.addEventListener("mouseenter", grow);
    cursor.addEventListener("mouseleave", shrink);

    // Page scroll -> cursor position + label
    let lastIdx = -1;
    observers.push(
      onScroll({
        target: document.body,
        enter: "max",
        leave: "min",
        sync: 0.9,
        onUpdate: ({ progress }) => {
          if (!grabbed) drag.progressX = progress;
          if (pctRef.current) pctRef.current.textContent = `${utils.round(progress * 100, 0)}%`;
          if (progress < 0.02 || progress > 0.98) hide();
          else show();
          const probe = window.innerHeight * 0.4;
          let idx = 0;
          for (let i = 0; i < els.length; i++) {
            const el = els[i];
            if (el && el.getBoundingClientRect().top <= probe) idx = i;
          }
          if (idx !== lastIdx) {
            lastIdx = idx;
            if (labelRef.current) labelRef.current.textContent = SECTIONS[idx].label.toUpperCase();
            buttonRefs.current.forEach((b, i) => b?.classList.toggle("is-active", i === idx));
          }
        },
      })
    );

    // Code cards: slide up while their section is in view
    SECTIONS.forEach((s, i) => {
      const el = els[i];
      const c = cardRefs.current[i];
      if (!el || !c) return;
      utils.set(c, { y: "120%", opacity: 0 });
      observers.push(
        onScroll({
          target: el,
          // visible while the section straddles the viewport centre, so
          // exactly one card is up at a time
          enter: "center top",
          leave: "center bottom",
          repeat: true,
          onEnter: () => animate(c, { y: 0, opacity: 1, ease: "inOut(3)", duration: 350 }),
          onLeave: () => animate(c, { y: "120%", opacity: 0, ease: "inOut(3)", duration: 250 }),
        })
      );
    });

    return () => {
      window.removeEventListener("resize", layoutButtons);
      bar.removeEventListener("click", onBarClick);
      bar.removeEventListener("mousemove", onBarMove);
      bar.removeEventListener("mouseenter", ghostShow);
      bar.removeEventListener("mouseleave", ghostHide);
      cursor.removeEventListener("mouseenter", grow);
      cursor.removeEventListener("mouseleave", shrink);
      observers.forEach((o) => o.revert());
      drag.revert();
      ghostAnim.revert();
      utils.remove([card, cursor, ghost, ...codeCards]);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="sub-nav pointer-events-none fixed bottom-5 left-1/2 z-40 hidden w-[21rem] -translate-x-1/2 overflow-hidden md:block"
      style={{ height: "12rem" }}
      aria-hidden
    >
      {SECTIONS.map((s, i) => (
        <pre
          key={s.id}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          data-card={s.id}
          className="sub-card absolute inset-x-0 bottom-12 m-0 overflow-hidden border border-fg/10 bg-bg/85 p-3 font-mono text-[10px] leading-[1.35] text-fg/70 backdrop-blur-md"
          style={{ opacity: 0 }}
        >
          {s.code ? <code>{s.code}</code> : <code className="text-fg/40">{`// ${s.label.toLowerCase()}`}</code>}
        </pre>
      ))}

      <div
        ref={cardRef}
        className="home-progress-card pointer-events-none absolute inset-x-0 bottom-0 h-11 border border-fg/15 bg-bg/80 backdrop-blur-md"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center justify-between px-3 pt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-fg/40">
          <span ref={labelRef}>HERO</span>
          <span ref={pctRef}>0%</span>
        </div>
        <div ref={barRef} className="scroll-bar">
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              ref={(el) => {
                buttonRefs.current[i] = el;
              }}
              href={`#${s.id}`}
              data-index={i}
              className="scroll-button"
              title={s.label}
            />
          ))}
          <div ref={cursorRef} className="scroll-cursor" />
          <div ref={ghostRef} className="scroll-cursor scroll-cursor-ghost" />
        </div>
      </div>
    </div>
  );
}
