"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Subtle UI sound system.
 * - Generates short, low-volume tones with the WebAudio API (no asset downloads).
 * - Hover, click, and section-enter sounds.
 * - Persistent mute toggle (saved to localStorage).
 * - Disabled by default — user must opt in.
 */

type SoundCtx = AudioContext | null;
let ctx: SoundCtx = null;
let enabled = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctx = new AudioCtor();
    } catch {
      return null;
    }
  }
  return ctx;
}

function play(freq: number, dur: number, vol = 0.04, type: OscillatorType = "sine") {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.connect(g);
  g.connect(c.destination);
  const now = c.currentTime;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(vol, now + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  o.start(now);
  o.stop(now + dur + 0.02);
}

// Public sound triggers (consumed by other components if needed)
export const Sounds = {
  hover: () => play(880, 0.06, 0.015, "sine"),
  click: () => play(440, 0.1, 0.04, "triangle"),
  open: () => {
    play(523, 0.08, 0.035, "sine");
    setTimeout(() => play(784, 0.12, 0.03, "sine"), 50);
  },
  toggle: () => play(660, 0.05, 0.03, "sine"),
  // Quick descending tick — card swipes, dismissals
  swipe: () => {
    play(620, 0.07, 0.03, "triangle");
    setTimeout(() => play(380, 0.09, 0.025, "triangle"), 40);
  },
  // Rising boot chirp — loader completion
  boot: () => {
    play(392, 0.09, 0.03, "sine");
    setTimeout(() => play(587, 0.09, 0.03, "sine"), 70);
    setTimeout(() => play(880, 0.16, 0.035, "sine"), 140);
  },
};

export function SoundToggle() {
  const [on, setOn] = useState(false);
  const lastSrc = useRef<EventTarget | null>(null);

  // Restore from storage
  useEffect(() => {
    const saved = localStorage.getItem("sound-on");
    if (saved === "1") {
      setOn(true);
      enabled = true;
    }
  }, []);

  // Wire up global hover/click listeners
  useEffect(() => {
    enabled = on;
    if (!on) return;
    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-cursor]");
      if (!el || el === lastSrc.current) return;
      lastSrc.current = el;
      Sounds.hover();
    };
    const onOut = (e: MouseEvent) => {
      const to = (e.relatedTarget as HTMLElement | null)?.closest?.(
        "[data-cursor]"
      );
      if (!to) lastSrc.current = null;
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-cursor]");
      if (el) Sounds.click();
    };
    window.addEventListener("mouseover", onOver, true);
    window.addEventListener("mouseout", onOut, true);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("mouseover", onOver, true);
      window.removeEventListener("mouseout", onOut, true);
      window.removeEventListener("click", onClick, true);
    };
  }, [on]);

  const toggle = () => {
    const next = !on;
    setOn(next);
    enabled = next;
    localStorage.setItem("sound-on", next ? "1" : "0");
    // Always allow the toggle itself to make a sound
    enabled = true;
    Sounds.toggle();
    enabled = next;
  };

  return (
    <button
      type="button"
      onClick={toggle}
      data-cursor="hover"
      data-cursor-label={on ? "MUTE" : "SOUND"}
      className="pointer-events-auto fixed bottom-5 left-5 z-[60] flex h-9 items-center gap-2 border border-fg/15 bg-bg/60 px-3 font-mono text-[10px] uppercase tracking-[0.25em] text-fg backdrop-blur-md transition hover:border-blue hover:text-blue md:left-16"
      aria-label={on ? "Mute interface sounds" : "Enable interface sounds"}
    >
      {/* Speaker icon */}
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path d="M2 6h2l3-3v10l-3-3H2V6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        {on && (
          <>
            <path d="M11 5.5a4 4 0 010 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M13 3.5a7 7 0 010 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
        {!on && (
          <line x1="10" y1="5" x2="14" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        )}
      </svg>
      <span>{on ? "Sound" : "Muted"}</span>
    </button>
  );
}
