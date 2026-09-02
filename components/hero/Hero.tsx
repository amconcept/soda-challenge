"use client";

import { useLayoutEffect, useState } from "react";
import HeroLockup from "./HeroLockup";
import { cssVars } from "./cssVars";
import { useLanguage } from "@/components/LanguageProvider";
import "./hero.css";

const asset = (file: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/partners/${file}`;

export default function Hero() {
  const { t } = useLanguage();
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
      className={ready ? "hero hero--ready" : "hero"}
      data-show-mark="false"
      data-show-schematic="true"
      data-show-partners="true"
      aria-label="SOD+A CHALLENGE"
    >
      <HeroLockup />

      <p className="hero-season" style={{ opacity: 0 }}>
        {t.season}
      </p>

      <div className="hero-partners">
        <div className="hero-partners-label" style={{ opacity: 0 }}>
          <div className="hero-rule" />
          <span>{t.collaboration}</span>
          <div className="hero-rule" />
        </div>
        <div className="hero-stickers">
          <span
            className="sticker sticker-link float-c"
            style={{
              opacity: 0,
              ...cssVars({
                "--delay": "6.05s",
                "--float-dur": "6.4s",
                "--float-delay": "6.85s",
              }),
            }}
          >
            <img src={asset("soda-17.svg")} alt="Fab Lab Barcelona" />
          </span>
          <span
            className="sticker sticker-link float-a"
            style={{
              opacity: 0,
              ...cssVars({
                "--delay": "6.25s",
                "--float-dur": "7.2s",
                "--float-delay": "7.05s",
              }),
            }}
          >
            <img src={asset("soda-16.svg")} alt="OCAD University" />
          </span>
          <span
            className="sticker sticker-invite float-b"
            aria-label={t.becomeLabel}
            style={{
              opacity: 0,
              ...cssVars({
                "--delay": "6.45s",
                "--float-dur": "7.8s",
                "--float-delay": "7.25s",
              }),
            }}
          >
            <span>{t.becomeLine1}</span>
            <span>{t.becomeLine2}</span>
          </span>
        </div>
      </div>

      <button type="button" className="hero-discover" style={{ opacity: 0 }} onClick={discover}>
        {t.discover}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <polyline points="1 1 9 11 17 1" />
        </svg>
      </button>
    </section>
  );
}
