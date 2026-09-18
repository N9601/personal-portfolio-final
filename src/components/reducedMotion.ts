/**
 * Media-query check for the OS "reduce motion" setting.
 *
 * Declarative CSS animation is already collapsed globally in
 * globals.css; JS-driven rAF loops can't see that rule, so they call
 * this before starting.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
