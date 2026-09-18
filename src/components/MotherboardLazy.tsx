"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/components/reducedMotion";

/**
 * Client-side dynamic import for the WebGL motherboard scene.
 * Lives in its own client component because Next 16 forbids
 * `ssr: false` in server components.
 *
 * No loading state — the hero shell (title, HUD, manifesto) is
 * already meaningful first paint, the 3D mounts on top once Three.js
 * has loaded.
 */
const MotherboardScene = dynamic(
  () => import("@/components/Motherboard").then((m) => m.Motherboard),
  { ssr: false, loading: () => null }
);

/**
 * The scene is perpetual motion by design (assembly choreography,
 * particle drift, cursor sway), so under prefers-reduced-motion it is
 * not mounted at all — the hero shell carries the first paint and the
 * visitor saves the Three.js download entirely.
 */
export function MotherboardLazy() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!prefersReducedMotion()) setEnabled(true);
  }, []);
  if (!enabled) return null;
  return <MotherboardScene />;
}
