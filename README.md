# Nandakishore Reddy — Personal Portfolio

A WebGL-driven personal portfolio built from scratch. Designed to feel like an instrument panel rather than a document.

Live at: TBD · Source: [`N9601/personal-portfolio`](https://github.com/N9601/personal-portfolio)

---

## What's inside

A single-page portfolio with ten interactive sections:

| # | Section | Highlight |
|---|---|---|
| 1 | **Hero** | Exploded 3D motherboard scene in Three.js with shader-driven PCB traces, cursor-magnetic components, additive-blend particles |
| 2 | **Marquee** | Tech-stack strip on infinite scroll |
| 3 | **Skills** | Text-built 3D globe — the labels themselves are the sphere (Fibonacci distribution), cursor steering on desktop, gyroscope steering on phones |
| 4 | **Projects** | Draggable card-stack deck — swipe or arrow keys to cycle, tap to open case-study modals, live LSM visualizer demo for SolderDB |
| 5 | **Experience** | Scroll-pinned timeline with a gradient line that draws as you scroll (blue → orange → red) |
| 5.5 | **Numbers** | Achievement metric cards with glowing values and accent bottom lines |
| 6 | **Resume** | Spinning CV disc with orbiting curved text, magnetic download / view buttons |
| 7 | **About** | XRay portrait card with cursor-reveal glow, split-text bio reveal, stats grid |
| 7.5 | **Off the clock** | RevealCard hover-curtain grid for ROM, photography, films, and music interests |
| 8 | **Tracks** | Build / Operate split columns with a center line that draws itself on scroll |
| 9 | **Contact** | Cursor-parallax title, click-to-copy email, magnetic socials grid |
| 10 | **Footer** | Marquee strip, link columns, oversized brand watermark, live IST clock |

Plus globally:

- **Loader** with name reveal, percentage counter, status phrases, curtain wipe
- **Custom cursor** — soft blue ring + dot + red trail, morphs to orange on hover with optional labels
- **Lenis smooth scroll**
- **Film grain + scanlines + vignette** overlays
- **Left scroll progress bar** + **right section navigator dots**
- **Keyboard shortcuts** — `?` to open, `g [letter]` to jump, `j`/`k` to scroll
- **Sound system** — optional WebAudio chirps on hover/click, mute toggle persists
- **Currently widget** — live floating status card, cycles through what's being built
- **Easter eggs** — Konami code (`↑↑↓↓←→←→BA`), typed `matrix` / `hireme` triggers, and a working guest-shell terminal on `` ` `` with navigation, resume, and contact commands
- **Reduced motion** — honors `prefers-reduced-motion`: native scroll instead of Lenis, no WebGL hero, static skills globe, instant loader, frozen disc
- **Custom 404** with glitched RGB-split heading

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, TypeScript, Turbopack)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) with custom CSS variables
- **3D / WebGL:** [Three.js](https://threejs.org) with hand-written GLSL shaders
- **Motion:** [GSAP](https://gsap.com) (installed) + custom IntersectionObserver patterns
- **Smooth scroll:** [Lenis](https://lenis.darkroom.engineering)
- **Audio:** WebAudio API (procedural, zero asset weight)

No design templates. No animation libraries beyond GSAP. Every shader, every component, every motion primitive written by hand.

## Reusable primitives

Components designed to drop into any future project:

- **`SplitReveal`** — character/word-level scroll-triggered reveal (Revelo-style)
- **`MaskReveal`** — clip-path scroll wipe in any direction, with optional accent line
- **`RevealCard`** — hover-triggered curtain card with face and back layers
- **`MagneticButton`** — cursor-magnetic wrapper with configurable strength
- **`ProjectModal`** — full-screen case-study sheet with accent theming
- **`Cursor`** — custom cursor with morph states driven by `data-cursor` attributes
- **`SmoothScroll`** — Lenis wrapper
- **`Sound`** — WebAudio chirp system with mute toggle
- **`Loader`** — intro reveal sequence

## Getting started

```bash
git clone https://github.com/N9601/personal-portfolio.git
cd personal-portfolio
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Turbopack dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx       — metadata, global providers, overlays
│  ├─ page.tsx         — section composition
│  ├─ not-found.tsx    — custom 404
│  └─ globals.css      — design tokens, grain, scanlines, marquee
└─ components/
   ├─ Motherboard.tsx       — hero 3D scene
   ├─ Terminal.tsx          — hidden guest-shell drawer
   ├─ LsmVisualizer.tsx     — SolderDB case-study demo
   ├─ Cursor.tsx            — custom cursor
   ├─ Loader.tsx            — intro reveal
   ├─ Konami.tsx            — easter egg
   ├─ ProjectModal.tsx      — case-study sheet
   ├─ MagneticButton.tsx    — cursor magnetism
   ├─ MaskReveal.tsx        — clip-path scroll reveal
   ├─ SplitReveal.tsx       — character scroll reveal
   ├─ RevealCard.tsx        — hover curtain card
   ├─ SmoothScroll.tsx      — Lenis wrapper
   ├─ Sound.tsx             — WebAudio chirps
   ├─ KeyboardShortcuts.tsx — ? overlay + g[letter] chord
   ├─ hud/                  — HUD chrome (nav, clock, manifesto, scroll progress, currently)
   └─ sections/             — every page section
```

## Deployment

The project is a standard Next.js 16 app. Deploy targets:

- **Vercel** (recommended): import the repo at [vercel.com/new](https://vercel.com/new), no config needed
- Anywhere else: `npm run build` produces a `.next/` directory ready for `npm start`

## License

MIT — see [LICENSE](LICENSE) if added.

## Contact

- **Email:** nandakishorereddyg@outlook.com
- **GitHub:** [@N9601](https://github.com/N9601)
- **Location:** Hyderabad, India · IST (UTC+5:30)
