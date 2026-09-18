"use client";

import { useEffect, useState } from "react";

const STATES = [
  { label: "Shipping SolderDB v1", detail: "Go · LSM engine · Wails GUI" },
  { label: "Tinkering with PyroOS", detail: "x86 bootloader · GDT · IDT" },
  { label: "Building this portfolio", detail: "Next.js · Three.js · GSAP" },
  { label: "Automating workflows", detail: "n8n · webhooks · ops" },
  { label: "Starting a B.Tech in CSE", detail: "VNR VJIET · Hyderabad" },
  { label: "Open to opportunities", detail: "Dev · DevOps · CloudSec" },
];

export function Currently() {
  const [idx, setIdx] = useState(0);
  const [time, setTime] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  // Cycle the state every 4 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % STATES.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  // Live clock (IST)
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const fmt = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      });
      setTime(fmt.format(d));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        data-cursor="hover"
        data-cursor-label="EXPAND"
        className="pointer-events-auto fixed bottom-5 right-5 z-50 hidden h-9 items-center gap-2 border border-fg/15 bg-bg/70 px-3 font-mono text-[10px] uppercase tracking-[0.25em] text-fg backdrop-blur-md transition hover:border-blue hover:text-blue md:flex"
      >
        <span className="relative inline-block">
          <span className="absolute inset-0 rounded-full bg-blue pulse-dot" />
          <span className="relative block h-1.5 w-1.5 rounded-full bg-blue" />
        </span>
        <span>NOW</span>
      </button>
    );
  }

  const state = STATES[idx];

  return (
    <div
      className="pointer-events-auto fixed bottom-5 right-5 z-50 hidden w-[280px] overflow-hidden border border-fg/15 bg-bg/70 backdrop-blur-xl md:block"
      data-cursor="hover"
    >
      {/* Top strip */}
      <div className="flex items-center justify-between border-b border-fg/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.3em] text-fg/40">
        <div className="flex items-center gap-2">
          <span className="relative inline-block">
            <span className="absolute inset-0 rounded-full bg-blue pulse-dot" />
            <span className="relative block h-1.5 w-1.5 rounded-full bg-blue" />
          </span>
          <span className="text-blue">/// NOW</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{time} IST</span>
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            data-cursor="hover"
            data-cursor-label="HIDE"
            className="text-fg/40 hover:text-orange transition"
            aria-label="Collapse"
          >
            —
          </button>
        </div>
      </div>

      {/* Content (animated swap) */}
      <div className="relative px-3 py-3" style={{ minHeight: 60 }}>
        <div
          key={idx}
          className="animate-fade-in-up"
          style={{
            animation: "fadeUpCurr 600ms cubic-bezier(.2,.85,.2,1)",
          }}
        >
          <div className="font-display text-sm font-light text-fg">
            {state.label}
          </div>
          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg/45">
            ▸ {state.detail}
          </div>
        </div>
      </div>

      {/* Progress / cycle indicator */}
      <div className="flex gap-1 border-t border-fg/10 px-3 py-2">
        {STATES.map((_, i) => (
          <span
            key={i}
            className="h-[2px] flex-1 transition-all duration-500"
            style={{
              background:
                i === idx
                  ? "var(--blue)"
                  : i < idx
                  ? "rgba(245,245,245,0.25)"
                  : "rgba(245,245,245,0.1)",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeUpCurr {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
