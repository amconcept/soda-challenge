"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import HeroLockup from "./HeroLockup";
import { cssVars } from "./cssVars";
import { useLanguage } from "@/components/LanguageProvider";
import { PARTNER_PATH } from "@/lib/contact";
import "./hero.css";

const asset = (file: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/partners/${file}`;

/** Draw, hold, fade out, then restart from the centered logo. */
const HERO_LOOP_MS = 20_000;

export default function Hero() {
  const { t } = useLanguage();
  // Wait until after hydration so the sequence starts once —
  // not during SSR paint and again when React attaches.
  const [ready, setReady] = useState(false);
  const [cycle, setCycle] = useState(0);

  useLayoutEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setCycle((n) => n + 1), HERO_LOOP_MS);
    return () => window.clearInterval(id);
  }, [ready]);

  function discover() {
    document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      className={ready ? "hero hero--ready" : "hero"}
      style={{ ["--hero-loop" as string]: `${HERO_LOOP_MS}ms` }}
      data-show-schematic="true"
      data-show-partners="true"
      aria-label="SOD+A CHALLENGE"
    >
      {/* Remount to replay string-in, rise, and partner reveal. */}
      <div key={cycle} className="hero-cycle">
        <div className="hero-stage">
          <HeroLockup />
        </div>

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
            <Link
              href={PARTNER_PATH}
              className="sticker sticker-invite float-c"
              aria-label={t.becomeLabel}
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
            </Link>
          </div>
        </div>

        <button type="button" className="hero-discover" style={{ opacity: 0 }} onClick={discover}>
          {t.discover}
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <polyline points="1 1 9 11 17 1" />
          </svg>
        </button>
      </div>
    </section>
  );
}
