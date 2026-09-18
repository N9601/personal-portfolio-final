"use client";

import { useEffect, useState } from "react";

const SEQ = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * Konami code easter egg.
 * Triggers a 6-second visual override:
 * - Inverts the document color tokens (white background, dark text, rainbow accents)
 * - Spawns a celebratory toast
 * - Plays a quick rising chime if the sound system has been enabled
 */
export function Konami() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const expected = SEQ[pos];
      const got = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (got === expected) {
        pos++;
        if (pos === SEQ.length) {
          pos = 0;
          setActive(true);
        }
      } else {
        // Only restart if the first key matches
        pos = got === SEQ[0] ? 1 : 0;
      }
    };
    // Programmatic trigger (footer egg card — no arrow keys on touch)
    const onEggEvent = (e: Event) => {
      if ((e as CustomEvent<string>).detail === "konami") setActive(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("portfolio:egg", onEggEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("portfolio:egg", onEggEvent);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    // Optional little chime via WebAudio (only fires if user has unmuted)
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("sound-on") : null;
    if (stored === "1") {
      try {
        const AudioCtor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const c = new AudioCtor();
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
          const o = c.createOscillator();
          const g = c.createGain();
          o.type = "sine";
          o.frequency.value = freq;
          o.connect(g);
          g.connect(c.destination);
          const start = c.currentTime + i * 0.08;
          g.gain.setValueAtTime(0, start);
          g.gain.linearRampToValueAtTime(0.05, start + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, start + 0.25);
          o.start(start);
          o.stop(start + 0.27);
        });
      } catch {
        // ignore
      }
    }
    const id = setTimeout(() => setActive(false), 6000);
    return () => clearTimeout(id);
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[120]"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,102,255,0.15), rgba(255,85,0,0.15), rgba(255,17,51,0.15))",
          mixBlendMode: "color",
          animation: "konamiPulse 1.2s ease-in-out infinite alternate",
        }}
      />

      <div className="pointer-events-auto fixed bottom-20 left-1/2 z-[121] -translate-x-1/2">
        <div
          className="flex items-center gap-3 border border-fg/15 bg-bg/90 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-fg backdrop-blur-xl"
          style={{
            animation: "konamiPop 500ms cubic-bezier(.2,.85,.2,1)",
            boxShadow: "0 0 40px rgba(0,102,255,0.4)",
          }}
        >
          <span className="relative inline-block">
            <span className="absolute inset-0 rounded-full bg-blue pulse-dot" />
            <span className="relative block h-2 w-2 rounded-full bg-blue" />
          </span>
          <span>
            <span className="text-blue glow-blue">CHEAT</span>{" "}
            <span className="text-fg">activated</span>{" "}
            <span className="text-orange glow-orange">↑↑↓↓←→←→BA</span>
          </span>
        </div>
      </div>

      <style>{`
        @keyframes konamiPulse {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }
        @keyframes konamiPop {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
