"use client";

import { useEffect, useRef, useState } from "react";
import { MagneticButton } from "@/components/MagneticButton";
import { SplitReveal } from "@/components/SplitReveal";
import { LinksGrid } from "@/components/anime/LinksGrid";

const EMAIL = "nandakishorereddyg@outlook.com";
const PHONE = "+91 8555 042 086";
const LOCATION = "Hyderabad, India · IST";

const SOCIALS = [
  { label: "GITHUB", href: "https://github.com/N9601", handle: "@N9601" },
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/gnandhakishorereddy/",
    handle: "in/gnandhakishorereddy",
  },
  { label: "DEV.TO", href: "https://dev.to/n9601", handle: "@n9601" },
  { label: "EMAIL", href: `mailto:${EMAIL}`, handle: "Direct" },
];

export function Contact() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);

  // Parallax title following cursor
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      el.style.transform = `translate3d(${dx * 30}px, ${dy * 20}px, 0)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-fg/10 px-6 py-24 md:px-10 md:py-40"
    >
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />

      {/* Background gradient orb */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(0,102,255,0.35) 0%, rgba(255,85,0,0.15) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-fg/50">
        <span className="block h-px w-8 bg-orange" />
        <span>/// 13 — Let&apos;s Connect</span>
      </div>

      {/* Giant cursor-parallax title */}
      <h2
        ref={titleRef}
        className="relative z-10 select-none font-display font-light leading-[0.9] tracking-[-0.05em] text-fg"
        style={{
          fontSize: "clamp(3rem, 11vw, 10rem)",
          transition: "transform 600ms cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <SplitReveal as="span" text="Let's " className="inline" stagger={25} />
        <span className="italic text-blue glow-blue">build</span>
        <br />
        <SplitReveal as="span" text="something " className="inline" stagger={25} delay={300} />
        <span className="text-fg/60">unforgettable</span>
        <span className="text-orange glow-orange">.</span>
      </h2>

      <div className="relative z-10 mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        {/* Left: contact info + copyable email */}
        <div>
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
            /// Direct line
          </div>

          <MagneticButton onClick={copyEmail} label={copied ? "COPIED" : "COPY"} strength={0.25}>
            <div
              className="group inline-flex flex-col text-left"
              data-cursor-label={copied ? "COPIED" : "COPY"}
            >
              <span className="break-all font-display text-xl font-light text-fg transition group-hover:text-blue sm:text-2xl md:text-4xl">
                {EMAIL}
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
                {copied ? "✓ Copied to clipboard" : "▸ Click to copy"}
              </span>
            </div>
          </MagneticButton>

          <div className="mt-12 grid grid-cols-1 gap-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
                Phone
              </div>
              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                data-cursor="hover"
                className="font-display text-xl font-light text-fg hover:text-blue transition"
              >
                {PHONE}
              </a>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
                Location
              </div>
              <div className="font-display text-xl font-light text-fg">
                {LOCATION}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
                Status
              </div>
              <div className="flex items-center gap-2">
                <span className="relative inline-block">
                  <span className="absolute inset-0 rounded-full bg-red pulse-dot" />
                  <span className="relative block h-2 w-2 rounded-full bg-red" />
                </span>
                <span className="font-display text-xl font-light text-fg">
                  Open to opportunities
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: social grid — magnetic effect lives on the email
            copy-CTA on the left; right column stays calm, just links */}
        <div>
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
            /// Find me elsewhere
          </div>

          <div className="grid grid-cols-1 gap-px bg-fg/10">
            {SOCIALS.map((s) => {
              const isMailto = s.href.startsWith("mailto:");
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={isMailto ? undefined : "_blank"}
                  rel={isMailto ? undefined : "noopener noreferrer"}
                  data-cursor="hover"
                  data-cursor-label="OPEN"
                  className="group flex items-center justify-between bg-bg px-6 py-5 transition hover:bg-fg/[0.03]"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40 group-hover:text-blue transition">
                      {s.label}
                    </span>
                    <span className="font-display text-lg font-light text-fg md:text-xl">
                      {s.handle}
                    </span>
                  </div>
                  <span className="font-mono text-fg/40 transition group-hover:text-orange group-hover:translate-x-1">
                    ↗
                  </span>
                </a>
              );
            })}
          </div>

          <div className="mt-10 border border-fg/15 p-5">
            <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-fg/40">
              /// Response time
            </div>
            <div className="font-display text-2xl font-light text-fg">
              Usually within{" "}
              <span className="text-blue glow-blue">24 hours</span>
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-fg/45">
              IST (UTC+5:30) · I&apos;m awake when most of the world isn&apos;t
            </div>
          </div>
        </div>
      </div>

      <LinksGrid />
    </section>
  );
}
