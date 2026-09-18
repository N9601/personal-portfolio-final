"use client";

import { RevealCard } from "@/components/RevealCard";
import { SplitReveal } from "@/components/SplitReveal";
import { Hover3D } from "@/components/Hover3D";

type Interest = {
  num: string;
  title: string;
  subtitle: string;
  reveal: {
    headline: string;
    body: string;
    tags: string[];
  };
  accent: "blue" | "orange" | "red";
};

const INTERESTS: Interest[] = [
  {
    num: "01",
    title: "OPEN-SOURCE ANDROID",
    subtitle: "OS customization",
    reveal: {
      headline: "Flashing custom ROMs, debloating, kernel tweaks.",
      body: "Stock Android is rarely the best Android. AOSP forks, magisk modules, kernel switching — the whole hidden layer of the device.",
      tags: ["LineageOS", "Magisk", "Custom kernels"],
    },
    accent: "blue",
  },
  {
    num: "02",
    title: "PHOTOGRAPHY",
    subtitle: "Visual capture",
    reveal: {
      headline: "Composition is just UX for a still frame.",
      body: "Light, geometry, the choice of what to leave out. The same decisions a good interface makes, frozen.",
      tags: ["Street", "Portrait", "Low-light"],
    },
    accent: "orange",
  },
  {
    num: "03",
    title: "FILMS",
    subtitle: "Frame by frame",
    reveal: {
      headline: "Cinematography is system design you can watch.",
      body: "Blocking, light, cuts — every frame is a decision about where the viewer's eye goes next. The same discipline as interface design.",
      tags: ["Nolan", "Villeneuve", "Film essays"],
    },
    accent: "red",
  },
  {
    num: "04",
    title: "MUSIC",
    subtitle: "Always playing",
    reveal: {
      headline: "The focus loop.",
      body: "Synthwave and lo-fi for deep work, soundtracks for late-night builds. The right loop makes a four-hour session feel like one.",
      tags: ["Synthwave", "Lo-fi", "Soundtracks"],
    },
    accent: "blue",
  },
];

const ACCENT_BG = {
  blue: "linear-gradient(135deg, #0066ff 0%, #003388 100%)",
  orange: "linear-gradient(135deg, #ff5500 0%, #882200 100%)",
  red: "linear-gradient(135deg, #ff1133 0%, #660011 100%)",
} as const;

const ACCENT_COLOR = {
  blue: "var(--blue)",
  orange: "var(--orange)",
  red: "var(--red)",
} as const;

export function Interests() {
  return (
    <section
      id="interests"
      className="relative overflow-hidden border-t border-fg/10 px-6 py-24 md:px-10 md:py-32"
    >
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />

      <div className="relative z-10 mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-fg/50">
        <span className="block h-px w-8 bg-orange" />
        <span>/// 10 — Off the clock</span>
      </div>

      <div className="relative z-10 mb-12 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <SplitReveal
          as="h2"
          text="Obsessions."
          className="block font-display text-5xl font-light tracking-[-0.04em] text-fg md:text-7xl"
          stagger={60}
        />
        <div className="max-w-md font-mono text-[11px] leading-relaxed tracking-[0.15em] text-fg/55">
          <span className="text-orange">▸</span> Hover — or tap — each card.
          Same performance instinct, different surface.
        </div>
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INTERESTS.map((it) => (
          <Hover3D
            key={it.num}
            intensity={0.7}
            perspective={800}
            glareOpacity={0.12}
            className="aspect-[3/4]"
          >
          <RevealCard
            direction="up"
            label={`#${it.num}`}
            className="h-full w-full"
            face={
              <div className="flex h-full flex-col justify-between p-5">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg/35">
                    #{it.num}
                  </div>
                </div>
                <div>
                  <div
                    className="font-display text-2xl font-light leading-tight tracking-tight text-fg md:text-3xl"
                  >
                    {it.title}
                  </div>
                  <div
                    className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em]"
                    style={{ color: ACCENT_COLOR[it.accent] }}
                  >
                    {it.subtitle}
                  </div>
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-fg/30">
                  <span className="hidden md:inline">HOVER</span>
                  <span className="md:hidden">TAP</span>
                  <span style={{ color: ACCENT_COLOR[it.accent] }}>↗</span>
                </div>
              </div>
            }
            reveal={
              <div
                className="flex h-full flex-col justify-between p-5"
                style={{
                  background: ACCENT_BG[it.accent],
                  color: "#fff",
                }}
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/60">
                  /// REVEAL
                </div>
                <div>
                  <p className="font-display text-lg font-light leading-snug">
                    {it.reveal.headline}
                  </p>
                  <p className="mt-3 font-mono text-[10px] leading-relaxed tracking-[0.1em] text-white/75">
                    {it.reveal.body}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {it.reveal.tags.map((t) => (
                    <span
                      key={t}
                      className="border border-white/30 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/85"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            }
          />
          </Hover3D>
        ))}
      </div>
    </section>
  );
}
