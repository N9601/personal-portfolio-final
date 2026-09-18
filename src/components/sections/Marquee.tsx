const ITEMS = [
  "REACT",
  "★",
  "THREE.JS",
  "★",
  "GSAP",
  "★",
  "WEBGL",
  "★",
  "NEXT.JS",
  "★",
  "GLSL",
  "★",
  "TYPESCRIPT",
  "★",
  "MOTION",
  "★",
];

export function Marquee() {
  const items = [...ITEMS, ...ITEMS];
  return (
    <section
      aria-hidden
      className="relative z-20 overflow-hidden border-y border-fg/10 bg-bg py-4"
    >
      <div className="marquee">
        {items.map((item, i) => (
          <span
            key={i}
            className="mx-6 inline-flex items-center font-mono text-[11px] uppercase tracking-[0.4em] text-fg/65"
          >
            {item === "★" ? (
              <span className="text-orange">●</span>
            ) : (
              item
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
