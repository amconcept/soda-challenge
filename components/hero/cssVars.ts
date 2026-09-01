import type { CSSProperties } from "react";

/** CSS custom properties for per-stroke timing (see hero.css). */
export function cssVars(vars: Record<string, string>): CSSProperties {
  return vars as CSSProperties;
}
