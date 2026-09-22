"use client";

import { useEffect } from "react";

/** Pastel stops: sage → yellow → orange → pink. */
const STOPS = [
  { t: 0, h: 160, s: 18, l: 90 },
  { t: 0.34, h: 50, s: 42, l: 90 },
  { t: 0.64, h: 22, s: 46, l: 90 },
  { t: 1, h: 338, s: 32, l: 91 },
];

/** Idle wash on the hero: a full sage → pink → sage breath. */
const IDLE_CYCLE_MS = 20_000;
const IDLE_TOP_PX = 48;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpHue(a: number, b: number, t: number) {
  const delta = ((b - a + 540) % 360) - 180;
  return (a + delta * t + 360) % 360;
}

function colorAt(progress: number) {
  const t = Math.min(1, Math.max(0, progress));
  let i = 0;
  while (i < STOPS.length - 2 && t > STOPS[i + 1].t) i += 1;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const u = (t - a.t) / (b.t - a.t || 1);
  const h = lerpHue(a.h, b.h, u);
  const s = lerp(a.s, b.s, u);
  const l = lerp(a.l, b.l, u);
  return `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;
}

/** 0→1→0 so standby color eases back to sage without a jump. */
function pingPong(cycle: number) {
  return cycle < 0.5 ? cycle * 2 : 2 - cycle * 2;
}

export default function ScrollHue() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const origin = performance.now();

    function progressAt(now: number) {
      const max = root.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      // On the hero (standby), shift color over time. Once you scroll, follow the page.
      if (!reduced && scrolled <= IDLE_TOP_PX) {
        return pingPong(((now - origin) / IDLE_CYCLE_MS) % 1);
      }
      return max <= 0 ? 0 : scrolled / max;
    }

    function paint(now: number) {
      const color = colorAt(progressAt(now));
      root.style.backgroundColor = color;
      body.style.backgroundColor = color;
    }

    function loop(now: number) {
      frame = window.requestAnimationFrame(loop);
      if (window.scrollY <= IDLE_TOP_PX) paint(now);
    }

    function onScroll() {
      paint(performance.now());
    }

    paint(origin);
    if (!reduced) frame = window.requestAnimationFrame(loop);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
