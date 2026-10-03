import { useLayoutEffect, useRef, useState } from "react";
import { cssVars } from "./cssVars";

/**
 * Line centered on SOD+A.
 * Draws in once, then reverses out as the centre axis wipes through it.
 * Ellipses sit between the words.
 */
const PIECES = [
  { label: "Creativity", box: 430, delay: "0s", float: "a", dur: "6.4s" },
  { label: "...", box: 130, delay: "0.22s", float: "b", dur: "5.8s" },
  { label: "Curiosity", box: 400, delay: "0.55s", float: "c", dur: "7.1s" },
  { label: "...", box: 130, delay: "0.77s", float: "d", dur: "6.2s" },
  { label: "Collaboration", box: 590, delay: "1.05s", float: "a", dur: "6.6s" },
] as const;

export default function HeroHook() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [lengths, setLengths] = useState<number[] | null>(null);

  // Dash length has to match the rendered outline, or the draw finishes early.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const next = [...root.querySelectorAll<SVGTextElement>(".hook-word")].map((node) =>
      Math.ceil(node.getBoundingClientRect().width * 4.2),
    );
    setLengths(next);
  }, []);

  return (
    <div
      ref={rootRef}
      className={lengths ? "hero-hook hero-hook--measured" : "hero-hook"}
      role="img"
      aria-label="Creativity ... Curiosity ... Collaboration"
    >
      {PIECES.map((piece, index) => (
        <svg
          key={`${piece.label}-${index}`}
          className="hook-piece"
          viewBox={`0 0 ${piece.box} 120`}
          aria-hidden="true"
        >
          <text
            className={`hook-word float-${piece.float}`}
            x="0"
            y="96"
            style={cssVars({
              "--delay": piece.delay,
              "--float-dur": piece.dur,
              "--len": `${lengths?.[index] ?? 2400}px`,
            })}
          >
            {piece.label}
          </text>
        </svg>
      ))}
    </div>
  );
}
