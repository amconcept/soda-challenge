"use client";

import { useLayoutEffect, useRef, useState } from "react";
import HeroHook from "./HeroHook";
import HeroLockup from "./HeroLockup";
import StoryLayer, { WatchStoryButton } from "@/components/story/StoryLayer";
import { cssVars } from "./cssVars";
import { useLanguage } from "@/components/LanguageProvider";
import "./hero.css";

const asset = (file: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/partners/${file}`;

export default function Hero() {
  const { t, locale } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  // Wait until after hydration so the sequence starts once —
  // not during SSR paint and again when React attaches.
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    setReady(true);
  }, []);

  function discover() {
    document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      ref={heroRef}
      className={ready ? "hero hero--ready hero--balloons" : "hero hero--balloons"}
      data-show-schematic="false"
      data-show-partners="true"
      data-mode="intro"
      aria-label={`${t.hook.join(" ... ")}. SOD+A CHALLENGE`}
    >
      <StoryLayer heroRef={heroRef} ready={ready}>
      <p className="hero-season">
        {t.season}
      </p>

      <div className="hero-cycle">
        {/* Restart the hook when the language changes, so the new words draw in. */}
        <HeroHook key={locale} />
        <div className="hero-play">
        <div className="hero-stage">
          <div className="hero-mark">
            <HeroLockup />
          </div>
        </div>

        <div className="hero-partners" data-reveal="3">
          <div className="hero-partners-label" style={{ opacity: 0 }}>
            <div className="hero-rule" />
            <span>{t.collaboration}</span>
            <div className="hero-rule" />
          </div>
          <div className="hero-stickers" data-reveal-target="3">
            <a
              className="sticker sticker-link float-c"
              href="https://fablabbcn.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Fab Lab Barcelona"
              style={{
                opacity: 0,
                ...cssVars({
                  "--delay": "6.55s",
                  "--float-dur": "6.4s",
                  "--float-delay": "7.35s",
                }),
              }}
            >
              <img src={asset("soda-17.svg")} alt="Fab Lab Barcelona" />
            </a>
            <a
              className="sticker sticker-link float-a"
              href="https://www.ocadu.ca/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="OCAD University"
              style={{
                opacity: 0,
                ...cssVars({
                  "--delay": "6.75s",
                  "--float-dur": "7.2s",
                  "--float-delay": "7.55s",
                }),
              }}
            >
              <img src={asset("soda-16.svg")} alt="OCAD University" />
            </a>
            <a
              className="sticker sticker-link float-b"
              href="https://www.lcc.ca/student-life/fablab"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LCC Fab Lab"
              style={{
                opacity: 0,
                ...cssVars({
                  "--delay": "6.85s",
                  "--float-dur": "6.9s",
                  "--float-delay": "7.65s",
                }),
              }}
            >
              <img src={asset("soda-18.svg")} alt="LCC Fab Lab" />
            </a>
            {/* Label only. Partners are invited by email, so this is not a link. See DESIGN_DECISIONS.md. */}
            <div
              className="sticker sticker-invite float-c"
              style={{
                opacity: 0,
                ...cssVars({
                  "--delay": "6.95s",
                  "--float-dur": "7.8s",
                  "--float-delay": "7.75s",
                }),
              }}
            >
              <span>{t.becomeLine1}</span>
              <span>{t.becomeLine2}</span>
            </div>
          </div>
        </div>

        <div className="hero-actions">
          <button type="button" className="hero-discover" onClick={discover}>
            {t.discover}
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <polyline points="1 1 9 11 17 1" />
            </svg>
          </button>
          <WatchStoryButton />
        </div>
        </div>
      </div>
      </StoryLayer>
    </section>
  );
}
