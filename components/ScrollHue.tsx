"use client";

import { useEffect } from "react";

/** Pastel stops: sage → yellow → orange → pink as the page scrolls. */
const STOPS = [
  { t: 0, h: 160, s: 18, l: 90 },
  { t: 0.34, h: 50, s: 42, l: 90 },
  { t: 0.64, h: 22, s: 46, l: 90 },
  { t: 1, h: 338, s: 32, l: 91 },
];

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

export default function ScrollHue() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    let frame = 0;

    function paint() {
      const max = root.scrollHeight - window.innerHeight;
      const color = colorAt(max <= 0 ? 0 : window.scrollY / max);
      root.style.backgroundColor = color;
      body.style.backgroundColor = color;
    }

    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        paint();
      });
    }

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
