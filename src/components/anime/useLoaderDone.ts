"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

let doneOnce = false;
const listeners = new Set<() => void>();
const markDone = () => {
  if (doneOnce) return;
  doneOnce = true;
  listeners.forEach((l) => l());
};
if (typeof window !== "undefined") {
  window.addEventListener("loader:done", markDone);
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

/**
 * True once the boot Loader has lifted its curtain (it dispatches a
 * `loader:done` window event). Components that run an entrance
 * animation wait on this so they don't fire behind the overlay.
 * Falls back to `true` after a timeout in case the Loader was never
 * mounted (e.g. a page that doesn't render it).
 */
export function useLoaderDone(fallbackMs = 4000): boolean {
  const done = useSyncExternalStore(
    subscribe,
    () => doneOnce,
    () => false
  );
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    if (done) return;
    const id = setTimeout(() => setTimedOut(true), fallbackMs);
    return () => clearTimeout(id);
  }, [done, fallbackMs]);
  return done || timedOut;
}
