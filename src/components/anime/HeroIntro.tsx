"use client";

import { useEffect, useRef } from "react";
import {
  createTimeline,
  stagger,
  utils,
  splitText,
  type Timeline,
  type TextSplitter,
} from "animejs";
import { prefersReducedMotion } from "@/components/reducedMotion";
import { useLoaderDone } from "./useLoaderDone";
import "./devEngine";

/**
 * Hero headline + tagline, animated the way animejs.com's intro is:
 *
 *  - headline split into chars; each char slides in from `.35em` with an
 *    `outIn(2)`-eased stagger and `outQuint` motion
 *  - the full-stop after the headline is a separate "red dot" that slides
 *    in late and flashes from white to red
 *  - the tagline splits into words, then its last phrase cycles through a
 *    word list: chars collapse (scaleX 0, from the last char) while a dot
 *    stretches and slides back to the start, then the next word's chars
 *    pop in from the first char while the dot rides back out to the end.
 */

const WORDS = [
  "the web",
  "React apps",
  "Go services",
  "WebGL scenes",
  "n8n pipelines",
  "anything",
];

export function HeroIntro() {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ready = useLoaderDone();

  useEffect(() => {
    const h1 = h1Ref.current;
    const p = pRef.current;
    const word = wordRef.current;
    const dot = dotRef.current;
    if (!h1 || !p || !word || !dot) return;
    if (!ready) {
      // Hold everything invisible until the loader lifts.
      h1.style.opacity = "0";
      p.style.opacity = "0";
      return;
    }

    const reduced = prefersReducedMotion();
    h1.style.opacity = "1";
    p.style.opacity = "1";
    if (reduced) return;

    const cleanups: Array<() => void> = [];
    const tls: Timeline[] = [];

    // Split + slide-in, same params the anime.js homepage uses.
    const textAppear = (target: HTMLElement, chars: boolean) => {
      const split = splitText(target, {
        words: { class: "word" },
        chars: chars && { class: "char" },
      });
      cleanups.push(() => split.revert());
      const tl = createTimeline().add(
        chars ? split.chars : split.words,
        {
          x: [".35em", 0],
          opacity: [0, 1],
          duration: 1000,
          delay: stagger(25, { ease: "outIn(2)" }),
          ease: "outQuint",
        }
      );
      tls.push(tl);
      return tl;
    };

    const h1Tl = textAppear(h1, true);
    const redDot = h1.querySelector<HTMLElement>(".red-dot");
    if (redDot) {
      h1Tl
        .add(
          redDot,
          {
            x: [".25em", "0em"],
            opacity: [0, 1],
            color: { from: "#fff" },
            duration: 300,
            ease: "inOut(3)",
          },
          550
        )
        .add(
          redDot,
          { color: "var(--red)", duration: 1200 },
          "<+=400"
        );
    }

    // Tagline: words only, then hand off to the word cycler.
    const pTl = textAppear(p, false);

    // ---- "animate anything" cycler ---------------------------------
    let idx = 0;
    let current: TextSplitter | null = null;
    let loop: Timeline | null = null;
    let stopped = false;

    const resplit = (html?: string) => {
      if (current) current.revert();
      if (html !== undefined) word.innerHTML = html;
      current = splitText(word, {
        words: { class: "word" },
        chars: { class: "char" },
      });
      return current;
    };

    const cycle = () => {
      if (stopped) return;
      const chars = resplit().chars;
      loop = createTimeline({
        delay: 1400,
        onComplete: () => {
          if (stopped) return;
          const next = resplit(WORDS[idx++ % WORDS.length]);
          idx %= WORDS.length;
          loop = createTimeline({ onComplete: cycle })
            .add(
              next.chars,
              {
                opacity: [0, 1],
                scaleX: [0, 1],
                x: [10, 0],
                duration: 150,
                delay: stagger(25, { from: "first", ease: "in(3)", start: 100 }),
              },
              0
            )
            .add(
              dot,
              {
                x: [-word.offsetWidth, 0],
                scaleX: [8, 1],
                transformOrigin: ["0% 0%", "0% 0%"],
                color: "rgba(245,245,245,0.75)",
                duration: next.chars.length * 25 + 75,
                ease: "out(3)",
              },
              0
            )
            .add({ duration: 750 })
            .init();
        },
      })
        .add(
          chars,
          {
            opacity: 0,
            scaleX: 0,
            duration: 100,
            delay: stagger(25, { from: "last", ease: "in(3)" }),
          },
          0
        )
        .add(
          dot,
          {
            x: -word.offsetWidth,
            transformOrigin: ["100% 0%", "100% 0%"],
            scaleX: [4, 1],
            duration: chars.length * 25 + 100,
            color: "var(--red)",
            delay: 50,
            ease: "out(3)",
          },
          0
        )
        .init();
    };

    pTl.onComplete = cycle;
    // Children were added after creation: init() re-syncs duration and
    // (re)starts playback, matching how animejs.com chains its timelines.
    h1Tl.init();
    pTl.init();

    return () => {
      stopped = true;
      loop?.cancel();
      tls.forEach((t) => t.cancel());
      current?.revert();
      cleanups.forEach((c) => c());
      utils.remove([h1, p, word, dot]);
    };
  }, [ready]);

  return (
    <>
      <h1
        ref={h1Ref}
        className="font-display font-light leading-[0.95] tracking-[-0.04em] text-fg"
        style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)", opacity: 0 }}
      >
        MAKING
        <br />
        <span className="text-fg/80">SYSTEMS</span>{" "}
        <span className="italic font-light text-blue glow-blue">feel</span>
        <br />
        <span className="text-fg/80">ALIVE</span>
        <span className="red-dot inline-block text-red">.</span>
      </h1>
      <p
        ref={pRef}
        className="mt-5 max-w-md font-display text-base font-medium leading-snug text-fg/70 md:text-lg"
        style={{ opacity: 0 }}
      >
        A full-stack developer from Hyderabad
        <br />
        who builds{" "}
        <span className="animate-anything-wrapper relative inline-block whitespace-nowrap">
          <span ref={wordRef} className="animate-anything relative text-fg">
            {WORDS[0]}
          </span>
          <span
            ref={dotRef}
            aria-hidden
            className="animate-anything-dot absolute text-fg/75"
            style={{ right: "-.3em", bottom: 0 }}
          >
            .
          </span>
        </span>
      </p>
    </>
  );
}
