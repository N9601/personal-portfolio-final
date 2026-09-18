export function ScrollIndicator() {
  return (
    <div className="pointer-events-none absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 items-center gap-3 md:flex">
      <div className="vertical-rl font-mono text-[10px] uppercase tracking-[0.4em] text-fg/50">
        Scroll to Explore
      </div>
      <div className="relative h-24 w-[1px] overflow-hidden bg-fg/20">
        <div
          className="absolute inset-x-0 top-0 h-6 bg-blue"
          style={{ animation: "scrollPing 2.4s ease-in-out infinite" }}
        />
      </div>
      <style>{`
        @keyframes scrollPing {
          0% { transform: translateY(-100%); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(400%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
