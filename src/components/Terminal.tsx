"use client";

import { useEffect, useRef, useState } from "react";
import { Sounds } from "@/components/Sound";

/**
 * Hidden terminal.
 *
 * Press ` (backquote/tilde) anywhere — or tap the Terminal card in the
 * footer (CustomEvent "portfolio:terminal") — and a drawer shell slides
 * down. It's a toy, but a functional one: navigation, resume, contact,
 * and triggers for the other easter eggs all work.
 */

type Line = { kind: "in" | "out" | "accent"; text: string };

const BANNER: Line[] = [
  { kind: "accent", text: "NANDAKISHORE-OS v2026.06 — guest shell" },
  { kind: "out", text: "type 'help' for commands · 'exit' to close" },
];

const HELP: string[] = [
  "help            this list",
  "whoami          who runs this machine",
  "ls projects     list shipped + in-flight work",
  "open <section>  jump to a section (skills, projects, contact…)",
  "resume          open the CV pdf",
  "contact         email / github / linkedin",
  "neofetch        system card",
  "time            current time in Hyderabad",
  "matrix          green glyph storm",
  "hireme          open-to-hire sweep",
  "konami          you know what this does",
  "sudo hire       escalate privileges",
  "clear           wipe the buffer",
  "exit            close terminal",
];

const SECTIONS = [
  "home",
  "skills",
  "projects",
  "experience",
  "achievements",
  "resume",
  "about",
  "interests",
  "tracks",
  "contact",
];

function run(raw: string): { out: Line[]; close?: boolean } {
  const cmd = raw.trim().toLowerCase();
  const o = (text: string): Line => ({ kind: "out", text });
  const a = (text: string): Line => ({ kind: "accent", text });

  if (!cmd) return { out: [] };

  if (cmd === "help") return { out: HELP.map(o) };

  if (cmd === "whoami")
    return {
      out: [
        a("nandakishore reddy"),
        o("full-stack developer · hyderabad, in"),
        o("dev / devops / cloud-sec"),
      ],
    };

  if (cmd === "ls" || cmd === "ls projects" || cmd === "projects")
    return {
      out: [
        o("drwx  solderdb/     go · lsm engine · wails"),
        o("drwx  pyroos/       asm · c · bare metal"),
        o("drwx  algowizard/   react · next · supabase"),
        o("drwx  coefficient/  next · ssr · logic sim"),
        o("drwx  portfolio/    the thing you are inside"),
      ],
    };

  if (cmd.startsWith("open ") || cmd.startsWith("goto ") || cmd.startsWith("cd ")) {
    const target = cmd.split(/\s+/)[1] || "";
    const match = SECTIONS.find((s) => s.startsWith(target));
    if (match) {
      document.getElementById(match)?.scrollIntoView({ behavior: "smooth" });
      return { out: [o(`navigating → #${match}`)], close: true };
    }
    return { out: [o(`no such section: ${target}`), o(`sections: ${SECTIONS.join(", ")}`)] };
  }

  if (cmd === "resume" || cmd === "cat resume" || cmd === "cv") {
    window.open("/Nandakishore_Reddy_CV.pdf", "_blank");
    return { out: [o("opening CV.pdf …")] };
  }

  if (cmd === "contact" || cmd === "socials")
    return {
      out: [
        o("email     nandakishorereddyg@outlook.com"),
        o("github    github.com/N9601"),
        o("linkedin  in/gnandhakishorereddy"),
        o("dev.to    @n9601"),
      ],
    };

  if (cmd === "neofetch")
    return {
      out: [
        a("      ▄▄▄        guest@nandakishore-os"),
        a("    ▄█████▄      ---------------------"),
        o("   ███████████   OS:      NANDAKISHORE-OS 2026.06"),
        o("   ███▀ ▀▀███    Host:    portfolio v2 (bare metal)"),
        o("   ███▄ ▄▄███    Kernel:  next 16 / three / lenis"),
        o("    ▀█████▀      Uptime:  est. 2023"),
        o("      ▀▀▀        Shell:   guest (read-only)"),
        o("                 Edu:     B.Tech CSE · VNR VJIET"),
      ],
    };

  if (cmd === "time" || cmd === "date") {
    const t = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Kolkata",
    }).format(new Date());
    return { out: [o(`${t} IST · hyderabad`)] };
  }

  if (cmd === "matrix" || cmd === "hireme" || cmd === "konami") {
    window.dispatchEvent(new CustomEvent("portfolio:egg", { detail: cmd }));
    return { out: [a(`running ${cmd} …`)], close: true };
  }

  if (cmd === "sudo hire" || cmd === "sudo hireme" || cmd === "hire") {
    window.dispatchEvent(new CustomEvent("portfolio:egg", { detail: "hireme" }));
    return {
      out: [
        o("[sudo] password for guest: ********"),
        a("privileges escalated. inbox: nandakishorereddyg@outlook.com"),
      ],
      close: true,
    };
  }

  if (cmd.startsWith("sudo"))
    return { out: [o("guest is not in the sudoers file. this incident will be reported.")] };

  if (cmd === "rm -rf /" || cmd.startsWith("rm "))
    return { out: [o("nice try. filesystem is read-only.")] };

  if (cmd === "exit" || cmd === "quit" || cmd === "q") return { out: [], close: true };

  return { out: [o(`command not found: ${cmd} — try 'help'`)] };
}

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Open/close triggers: backquote key + footer card event
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          (el as HTMLElement).isContentEditable);
      if ((e.key === "`" || e.key === "~") && !typing) {
        e.preventDefault();
        setOpen((v) => !v);
        Sounds.toggle();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onEvent = () => {
      setOpen((v) => !v);
      Sounds.toggle();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("portfolio:terminal", onEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("portfolio:terminal", onEvent);
    };
  }, []);

  // Focus input when opened; keep scrolled to bottom on new lines
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  const submit = () => {
    const cmd = value;
    setValue("");
    if (cmd.trim().toLowerCase() === "clear") {
      setLines(BANNER);
      return;
    }
    const res = run(cmd);
    setLines((l) => [...l, { kind: "in", text: cmd }, ...res.out]);
    Sounds.click();
    if (res.close) setTimeout(() => setOpen(false), 350);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[9990] flex justify-center px-0 sm:px-6">
      <div
        data-lenis-prevent
        className="w-full max-w-3xl border-x-0 border-b border-fg/20 bg-bg/95 backdrop-blur-xl sm:border-x"
        style={{
          boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(0,102,255,0.12)",
          animation: "termDrop 320ms cubic-bezier(.2,.85,.2,1)",
        }}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-fg/10 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.3em] text-fg/40">
          <div className="flex items-center gap-2">
            <span className="relative inline-block">
              <span className="absolute inset-0 rounded-full bg-blue pulse-dot" />
              <span className="relative block h-1.5 w-1.5 rounded-full bg-blue" />
            </span>
            <span className="text-blue">guest@nandakishore-os</span>
            <span className="text-fg/25">~ read-only</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            data-cursor="hover"
            data-cursor-label="CLOSE"
            className="text-fg/40 transition hover:text-orange"
            aria-label="Close terminal"
          >
            ✕ ESC
          </button>
        </div>

        {/* Output */}
        <div
          ref={scrollRef}
          className="max-h-[50vh] overflow-y-auto px-4 py-3 font-mono text-[11px] leading-relaxed"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((l, i) => (
            <div
              key={i}
              className={
                l.kind === "in"
                  ? "text-fg"
                  : l.kind === "accent"
                  ? "text-blue"
                  : "text-fg/65"
              }
              style={{ whiteSpace: "pre-wrap" }}
            >
              {l.kind === "in" ? (
                <>
                  <span className="text-orange">❯ </span>
                  {l.text}
                </>
              ) : (
                l.text
              )}
            </div>
          ))}

          {/* Prompt */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-orange">❯</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              className="w-full bg-transparent font-mono text-[11px] text-fg outline-none placeholder:text-fg/25"
              style={{ cursor: "text" }}
              placeholder="type a command…"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Terminal command input"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes termDrop {
          from { transform: translateY(-100%); opacity: 0.4; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
