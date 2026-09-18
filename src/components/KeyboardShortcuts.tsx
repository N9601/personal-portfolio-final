"use client";

import { useEffect, useState } from "react";

const SECTIONS: { key: string; id: string; label: string }[] = [
  { key: "h", id: "home", label: "Hero" },
  { key: "s", id: "skills", label: "Skills" },
  { key: "p", id: "projects", label: "Projects" },
  { key: "e", id: "experience", label: "Experience" },
  { key: "n", id: "achievements", label: "Numbers" },
  { key: "r", id: "resume", label: "Resume" },
  { key: "a", id: "about", label: "About" },
  { key: "o", id: "interests", label: "Off the clock" },
  { key: "t", id: "tracks", label: "Tracks" },
  { key: "c", id: "contact", label: "Contact" },
];

const ACTIONS = [
  { keys: "?", desc: "Toggle this overlay" },
  { keys: "G then [letter]", desc: "Jump to a section" },
  { keys: "↑ / K", desc: "Scroll up" },
  { keys: "↓ / J", desc: "Scroll down" },
  { keys: "Home", desc: "Jump to top" },
  { keys: "End", desc: "Jump to bottom" },
  { keys: "Esc", desc: "Close menu / overlay" },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 'G' multi-key chord state
    let gActive = false;
    let gTimer: ReturnType<typeof setTimeout> | null = null;

    const isTyping = () => {
      const a = document.activeElement;
      if (!a) return false;
      const tag = a.tagName.toLowerCase();
      return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        (a as HTMLElement).isContentEditable
      );
    };

    const onKey = (e: KeyboardEvent) => {
      if (isTyping()) return;

      // Esc closes overlay
      if (e.key === "Escape" && open) {
        setOpen(false);
        return;
      }

      // ? toggles overlay (Shift + /)
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }

      // G chord start
      if (e.key === "g" || e.key === "G") {
        gActive = true;
        if (gTimer) clearTimeout(gTimer);
        gTimer = setTimeout(() => {
          gActive = false;
        }, 1200);
        return;
      }

      // After G — jump to section
      if (gActive) {
        const section = SECTIONS.find(
          (s) => s.key === e.key.toLowerCase()
        );
        if (section) {
          e.preventDefault();
          const el = document.getElementById(section.id);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          gActive = false;
          if (gTimer) clearTimeout(gTimer);
          return;
        }
      }

      // Vim-style scroll
      if (e.key === "j" || e.key === "J") {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight * 0.6, behavior: "smooth" });
      }
      if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        window.scrollBy({ top: -window.innerHeight * 0.6, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (gTimer) clearTimeout(gTimer);
    };
  }, [open]);

  return (
    <>
      {/* Floating ? button (bottom-left) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-cursor="hover"
        data-cursor-label="HELP"
        className="pointer-events-auto fixed bottom-5 left-5 z-[60] hidden h-9 w-9 items-center justify-center border border-fg/15 bg-bg/60 font-mono text-xs text-fg backdrop-blur-md transition hover:border-blue hover:text-blue md:flex"
        aria-label="Show keyboard shortcuts"
      >
        ?
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[59] flex items-center justify-center bg-bg/85 p-6 backdrop-blur-xl"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl border border-fg/15 bg-bg p-8 md:p-12"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              data-cursor="hover"
              data-cursor-label="CLOSE"
              className="absolute right-4 top-4 h-8 w-8 border border-fg/15 font-mono text-xs text-fg hover:border-blue hover:text-blue"
              aria-label="Close"
            >
              ×
            </button>

            <div className="mb-1 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
              <span className="block h-px w-8 bg-orange" />
              <span>/// Shortcuts</span>
            </div>
            <h3 className="mb-8 font-display text-3xl font-light tracking-tight text-fg md:text-4xl">
              Keyboard{" "}
              <span className="text-blue glow-blue">interface</span>.
            </h3>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {/* Sections */}
              <div>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/45">
                  /// Jump (press G then…)
                </div>
                <ul className="space-y-2">
                  {SECTIONS.map((s) => (
                    <li
                      key={s.key}
                      className="flex items-center justify-between"
                    >
                      <span className="font-display text-base text-fg/80">
                        {s.label}
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="flex h-7 w-7 items-center justify-center border border-fg/20 bg-bg font-mono text-[10px] uppercase text-fg">
                          G
                        </kbd>
                        <span className="font-mono text-[10px] text-fg/40">+</span>
                        <kbd className="flex h-7 w-7 items-center justify-center border border-fg/20 bg-bg font-mono text-[10px] uppercase text-blue">
                          {s.key}
                        </kbd>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/45">
                  /// Actions
                </div>
                <ul className="space-y-2">
                  {ACTIONS.map((a, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-fg/65">
                        {a.desc}
                      </span>
                      <kbd className="flex h-7 items-center justify-center border border-fg/20 bg-bg px-2 font-mono text-[10px] uppercase text-orange">
                        {a.keys}
                      </kbd>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-fg/10 pt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/35">
              Press <span className="text-fg">?</span> anytime · Esc to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}
