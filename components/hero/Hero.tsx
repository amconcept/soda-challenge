"use client";

import { useLayoutEffect, useRef, useState } from "react";
import HeroLockup from "./HeroLockup";
import { cssVars } from "./cssVars";
import "./hero.css";

const asset = (file: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/partners/${file}`;

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  // Wait until after hydration so the sequence starts once, like Replay —
  // not during SSR paint and again when React attaches.
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    setReady(true);
  }, []);

  // Reset intro animations via the Web Animations API; float loops keep running.
  function replay() {
    const root = rootRef.current;
    if (!root) return;
    for (const anim of root.getAnimations({ subtree: true })) {
      const name =
        "animationName" in anim ? String((anim as CSSAnimation).animationName) : "";
      if (name.startsWith("float") || name === "hover3d" || name === "nudge") continue;
      anim.currentTime = 0;
      anim.play();
    }
  }

  function discover() {
    document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      ref={rootRef}
      className={ready ? "hero hero--ready" : "hero"}
      data-show-mark="false"
      data-show-schematic="true"
      data-show-partners="true"
      aria-label="SOD+A CHALLENGE"
    >
      <HeroLockup />

      <div className="hero-partners">
        <div className="hero-partners-label" style={{ opacity: 0 }}>
          <div className="hero-rule" />
          <span>Co-created by</span>
          <div className="hero-rule" />
        </div>
        <div className="hero-stickers">
          <img
            src={asset("soda-16.svg")}
            alt="OCAD University"
            className="sticker float-a"
            style={{
              opacity: 0,
              height: "clamp(84px, 16vh, 132px)",
              width: "auto",
              ...cssVars({
                "--delay": "7.3s",
                "--float-dur": "7.2s",
                "--float-delay": "8.3s",
              }),
            }}
          />
          <img
            src={asset("soda-17.svg")}
            alt="Fab Lab BCN"
            className="sticker float-c"
            style={{
              opacity: 0,
              height: "clamp(84px, 16vh, 132px)",
              width: "auto",
              ...cssVars({
                "--delay": "7.5s",
                "--float-dur": "6.4s",
                "--float-delay": "8.5s",
              }),
            }}
          />
          <img
            src={asset("soda-18.svg")}
            alt="LCC Fab Lab"
            className="sticker float-b"
            style={{
              opacity: 0,
              height: "clamp(84px, 16vh, 132px)",
              width: "auto",
              ...cssVars({
                "--delay": "7.7s",
                "--float-dur": "7.8s",
                "--float-delay": "8.7s",
              }),
            }}
          />
        </div>
      </div>

      <button type="button" className="hero-discover" style={{ opacity: 0 }} onClick={discover}>
        Discover
        <svg width="13" height="17" viewBox="0 0 13 17" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <line x1="6.5" y1="1" x2="6.5" y2="14" />
          <polyline points="1.5 9.5 6.5 15 11.5 9.5" />
        </svg>
      </button>

      <button type="button" className="hero-replay" onClick={replay}>
        Replay
      </button>
    </section>
  );
}
