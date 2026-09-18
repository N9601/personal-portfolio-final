"use client";

import { useEffect, useRef } from "react";

export function FloatingCard() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      el.style.setProperty("--rx", `${y * -8}deg`);
      el.style.setProperty("--ry", `${x * 10}deg`);
    };
    const onLeave = () => {
      el.style.setProperty("--rx", `0deg`);
      el.style.setProperty("--ry", `0deg`);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-cursor="hover"
      className="pointer-events-auto absolute bottom-10 right-6 z-30 hidden w-[280px] origin-center border border-fg/15 bg-bg/40 p-4 backdrop-blur-xl md:block"
      style={{
        transform:
          "perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
        transition: "transform 200ms cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-fg/40">
          /// Latest
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
          ●REC
        </span>
      </div>
      <div className="mb-2 h-24 w-full overflow-hidden bg-bg">
        <div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(135deg, #0066ff 0%, #ff1133 50%, #ff5500 100%)",
            filter: "blur(40px) saturate(140%)",
            opacity: 0.65,
          }}
        />
      </div>
      <div className="font-display text-sm font-medium text-fg">
        SolderDB
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg/40">
        Go · LSM · Wails · 2026
      </div>
    </div>
  );
}
