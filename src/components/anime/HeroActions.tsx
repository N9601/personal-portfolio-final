"use client";

import { useEffect, useRef, useState } from "react";
import { animate, utils } from "animejs";
import { prefersReducedMotion } from "@/components/reducedMotion";
import { useLoaderDone } from "./useLoaderDone";

const EMAIL = "nandakishorereddyg@outlook.com";

/**
 * The `npm i animejs` / "Learn more" row from animejs.com's hero,
 * remapped to a portfolio: a copyable mono command pill holding the
 * email address, and a button whose arrow icon slides out the bottom
 * while a second one drops in from the top on hover.
 */
export function HeroActions() {
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);
  const ready = useLoaderDone();

  // Entrance: slide up once the loader lifts.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !ready) return;
    if (prefersReducedMotion()) {
      el.style.opacity = "1";
      return;
    }
    const a = animate(el, {
      opacity: [0, 1],
      y: [16, 0],
      duration: 900,
      delay: 900,
      ease: "outQuint",
    });
    return () => {
      a.cancel();
      utils.remove(el);
    };
  }, [ready]);

  // Hover: the two stacked arrows swap places.
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const icons = btn.querySelectorAll<SVGElement>(".icon");
    if (icons.length < 2) return;
    const [ghost, main] = [icons[0], icons[1]];
    const enter = () => {
      animate(main, { y: ["0%", "120%"], duration: 250, ease: "inOut(3)" });
      animate(ghost, { y: ["-120%", "0%"], duration: 250, ease: "inOut(3)" });
    };
    const leave = () => {
      animate(main, { y: "0%", duration: 250, ease: "inOut(3)" });
      animate(ghost, { y: "-120%", duration: 250, ease: "inOut(3)" });
    };
    btn.addEventListener("mouseenter", enter);
    btn.addEventListener("mouseleave", leave);
    return () => {
      btn.removeEventListener("mouseenter", enter);
      btn.removeEventListener("mouseleave", leave);
      utils.remove([ghost, main]);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked; the text is still selectable
    }
  };

  return (
    <div
      ref={rootRef}
      className="ui-group pointer-events-auto mt-7 hidden items-center gap-3 md:flex"
      style={{ opacity: 0 }}
    >
      <pre className="npm-install m-0">
        <code
          className="relative block h-12 overflow-hidden border border-fg/15 bg-fg/[0.04] py-3.5 pl-4 pr-12 font-mono text-[12px] tracking-wide text-fg/85 backdrop-blur-md"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="text-blue">$</span> mail {EMAIL}
          <button
            type="button"
            onClick={copy}
            data-cursor="hover"
            data-cursor-label={copied ? "COPIED" : "COPY"}
            aria-label="Copy email address"
            className="copy-button absolute right-0 top-0 flex h-full w-11 items-center justify-center border-l border-fg/15 text-fg/50 transition hover:bg-fg/[0.06] hover:text-fg"
          >
            {copied ? (
              <svg viewBox="0 0 24 24" className="icon h-5 w-5" aria-hidden>
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  d="M5 12.5l4.5 4.5L19 7.5"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="icon h-5 w-5" aria-hidden>
                <rect
                  x="8.5"
                  y="8.5"
                  width="10"
                  height="10"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  d="M15.5 8.5V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6.5a2 2 0 0 0 2 2h1.5"
                />
              </svg>
            )}
          </button>
        </code>
      </pre>

      <a
        ref={btnRef}
        href="#toolbox"
        data-cursor="hover"
        className="learn-more relative flex h-12 items-center gap-2 overflow-hidden border border-blue bg-blue/10 px-5 font-mono text-[11px] uppercase tracking-[0.25em] text-fg transition hover:bg-blue/20"
      >
        <span>Learn more</span>
        <span className="relative block h-5 w-5">
          <svg
            viewBox="0 0 24 24"
            className="icon absolute inset-0 h-5 w-5"
            style={{ transform: "translateY(-120%)" }}
            aria-hidden
          >
            <polygon
              fill="currentColor"
              points="12 18 17.237 12.763 16 11.525 12.875 14.651 12.875 6.763 11.125 6.763 11.125 14.651 8 11.525 6.763 12.763"
            />
          </svg>
          <svg
            viewBox="0 0 24 24"
            className="icon absolute inset-0 h-5 w-5"
            aria-hidden
          >
            <polygon
              fill="currentColor"
              points="12 18 17.237 12.763 16 11.525 12.875 14.651 12.875 6.763 11.125 6.763 11.125 14.651 8 11.525 6.763 12.763"
            />
          </svg>
        </span>
      </a>
    </div>
  );
}
