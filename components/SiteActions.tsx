"use client";

import { useEffect, useRef, useState } from "react";
import "./site-actions.css";

/** Swap these when a form or partner page exists. */
const JOIN_HREF = "mailto:hello@sodachallenge.org?subject=Join%20the%20SOD%2BA%20Challenge";
const PARTNER_HREF = "mailto:hello@sodachallenge.org?subject=SOD%2BA%20Partnership";

function ActionLinks() {
  return (
    <>
      <a className="site-btn site-btn--fill" href={JOIN_HREF}>
        Join the challenge
      </a>
      <a className="site-btn" href={PARTNER_HREF}>
        Partner
      </a>
    </>
  );
}

export default function SiteActions({
  placement,
}: {
  placement: "nav" | "footer";
}) {
  if (placement === "footer") {
    return (
      <nav className="site-actions site-actions--footer" aria-label="Get involved">
        <ActionLinks />
      </nav>
    );
  }

  return <SiteNav />;
}

function SiteNav() {
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
    <nav ref={rootRef} className={`site-nav${open ? " site-nav--open" : ""}`} aria-label="Menu">
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
        <span className="site-nav-label">{open ? "Close menu" : "Open menu"}</span>
      </button>
      <div id="site-nav-panel" className="site-nav-panel" hidden={!open}>
        <ActionLinks />
      </div>
    </nav>
  );
}
