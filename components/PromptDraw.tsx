"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { drawHand, phrase, scrambleHand, STILL_HAND, type PromptPick } from "@/lib/promptDeck";

const SPIN_MS = 900;
const TICK_MS = 80;
const HOLD_MS = 4200;

/**
 * A short loop of the Rando Calrissian draw, under the first photo pile.
 * It runs only while it is on screen. See DESIGN_DECISIONS.md.
 */
export default function PromptDraw() {
  const { locale, t } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const [hand, setHand] = useState<PromptPick>(STILL_HAND);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let spinTimer = 0;
    let holdTimer = 0;
    let running = false;
    let alive = true;

    const stop = () => {
      window.clearInterval(spinTimer);
      window.clearTimeout(holdTimer);
      spinTimer = 0;
      holdTimer = 0;
    };

    const hold = () => {
      if (!alive || !running) return;
      setSpinning(false);
      setHand(drawHand());
      holdTimer = window.setTimeout(spin, HOLD_MS);
    };

    const spin = () => {
      if (!alive || !running) return;
      setSpinning(true);
      const started = performance.now();
      window.clearInterval(spinTimer);
      spinTimer = window.setInterval(() => {
        setHand(scrambleHand());
        if (performance.now() - started >= SPIN_MS) {
          window.clearInterval(spinTimer);
          hold();
        }
      }, TICK_MS);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (running) return;
          running = true;
          spin();
          return;
        }
        running = false;
        stop();
        setSpinning(false);
      },
      { threshold: 0.5 },
    );
    observer.observe(root);

    return () => {
      alive = false;
      running = false;
      stop();
      observer.disconnect();
    };
  }, []);

  const words = {
    includes: phrase(hand.includes, "includes", locale),
    uses: phrase(hand.uses, "uses", locale),
    explores: phrase(hand.explores, "explores", locale),
  };
  const slots = [
    [t.challenge.draw.includes, words.includes],
    [t.challenge.draw.uses, words.uses],
    [t.challenge.draw.explores, words.explores],
  ] as const;

  return (
    <div
      ref={rootRef}
      className={`prompt-draw${spinning ? " is-spinning" : ""}`}
    >
      <p className="prompt-draw-objective">{t.challenge.draw.objective}</p>
      <div className="prompt-draw-slots">
        {slots.map(([label, word]) => (
          <div className="prompt-draw-slot" key={label}>
            <span className="prompt-draw-label">{label}</span>
            <span className="prompt-draw-word" aria-hidden={spinning}>
              {word}
            </span>
          </div>
        ))}
      </div>
      <div className="visually-hidden" aria-live="polite">
        {spinning
          ? ""
          : `${t.challenge.draw.includes} ${words.includes}. ${t.challenge.draw.uses} ${words.uses}. ${t.challenge.draw.explores} ${words.explores}.`}
      </div>
    </div>
  );
}
