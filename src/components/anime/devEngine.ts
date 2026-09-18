"use client";

import { engine, utils } from "animejs";

/**
 * Dev-only: expose the anime.js engine so automated checks can tick it
 * by hand in environments where requestAnimationFrame is throttled or
 * never fires (hidden tabs, headless panes). No-op in production.
 */
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  (window as unknown as { __anime?: unknown }).__anime = { engine, utils };
}
