import { Manifesto } from "@/components/hud/Manifesto";
import { ScrollIndicator } from "@/components/hud/ScrollIndicator";
import { FloatingCard } from "@/components/hud/FloatingCard";
import { MotherboardLazy as Motherboard } from "@/components/MotherboardLazy";
import { HeroIntro } from "@/components/anime/HeroIntro";
import { HeroActions } from "@/components/anime/HeroActions";

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate h-[100svh] min-h-[700px] w-full overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />

      {/* Oversized translucent display name (behind motherboard) */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <h2
          aria-hidden
          className="font-display text-[24vw] font-light leading-none tracking-tighter text-fg/[0.025] md:text-[18vw]"
          style={{
            WebkitTextStroke: "1px rgba(245,245,245,0.05)",
          }}
        >
          NANDAKISHORE
        </h2>
      </div>

      {/* 3D Motherboard */}
      <Motherboard />

      {/* HUD overlays */}
      <Manifesto />
      <ScrollIndicator />
      <FloatingCard />

      {/* Bottom-left bold title (Slixel-style) */}
      <div className="pointer-events-none absolute bottom-8 left-6 z-30 max-w-[90vw] md:bottom-12 md:left-10 md:max-w-[60vw]">
        <div className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-fg/50 md:mb-4">
          <span className="block h-px w-8 bg-blue" />
          <span>/// 01 — Hero</span>
        </div>
        <HeroIntro />
        <HeroActions />

        {/* Quick CTAs — phones only; desktop has the HUD + scroll cue */}
        <div className="pointer-events-auto mt-6 flex gap-3 md:hidden">
          <a
            href="#projects"
            className="flex items-center gap-2 border border-blue bg-blue/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-fg active:bg-blue/25"
          >
            <span>View work</span>
            <span className="text-blue">↓</span>
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 border border-fg/20 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-fg/80 active:border-orange active:text-orange"
          >
            <span>Contact</span>
            <span className="text-orange">↗</span>
          </a>
        </div>
      </div>

      {/* Bottom-right meta */}
      <div className="pointer-events-none absolute bottom-6 right-6 z-30 hidden text-right font-mono text-[10px] uppercase tracking-[0.25em] text-fg/40 md:block">
        &gt; Next Level of Digital Realities
      </div>

      {/* Top-left typing tagline */}
      <div className="pointer-events-none absolute left-6 top-24 z-30 font-mono text-[11px] uppercase tracking-[0.2em] text-blue glow-blue md:left-10">
        <span className="inline-block">I architect systems</span>
        <span className="inline-block animate-pulse">_</span>
      </div>
    </section>
  );
}
