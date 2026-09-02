"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import type { Locale } from "@/lib/copy";
import "./site-actions.css";

function ActionLinks() {
  const { t } = useLanguage();
  return (
    <>
      <button type="button" className="site-btn site-btn--fill">
        {t.join}
      </button>
      <button type="button" className="site-btn">
        {t.partner}
      </button>
    </>
  );
}

function LanguageSwitch() {
  const { locale, setLocale, t } = useLanguage();

  function select(next: Locale) {
    setLocale(next);
  }

  return (
    <div className="lang-switch" role="group" aria-label={t.language}>
      <button
        type="button"
        aria-pressed={locale === "en"}
        onClick={() => select("en")}
      >
        EN
      </button>
      <span aria-hidden="true">|</span>
      <button
        type="button"
        aria-pressed={locale === "es"}
        onClick={() => select("es")}
      >
        ES
      </button>
    </div>
  );
}

export default function SiteActions({
  placement,
}: {
  placement: "nav" | "footer";
}) {
  const { t } = useLanguage();

  if (placement === "footer") {
    return (
      <nav className="site-actions site-actions--footer" aria-label={t.involved}>
        <ActionLinks />
      </nav>
    );
  }

  return <SiteNav />;
}

function SiteNav() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <nav ref={rootRef} className={`site-nav${open ? " site-nav--open" : ""}`} aria-label={t.menu}>
      <div className="site-nav-top">
        <LanguageSwitch />
        <button
          type="button"
          className="site-nav-bubble"
          aria-expanded={open}
          aria-controls="site-nav-panel"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="site-nav-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="site-nav-label">{open ? t.closeMenu : t.openMenu}</span>
        </button>
      </div>
      <div id="site-nav-panel" className="site-nav-panel" hidden={!open}>
        <ActionLinks />
      </div>
    </nav>
  );
}
