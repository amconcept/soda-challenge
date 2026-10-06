import { useLayoutEffect, useRef, useState } from "react";
import { cssVars } from "./cssVars";
import { useLanguage } from "@/components/LanguageProvider";

/**
 * Line centered on SOD+A.
 * Draws in once, then reverses out as the centre axis wipes through it.
 * Ellipses sit between the words.
 * The three words follow the selected language. English widths stay hand-tuned.
 */
const TIMING = [
  { delay: "0s", float: "a", dur: "6.4s" },
  { delay: "0.22s", float: "b", dur: "5.8s" },
  { delay: "0.55s", float: "c", dur: "7.1s" },
  { delay: "0.77s", float: "d", dur: "6.2s" },
  { delay: "1.05s", float: "a", dur: "6.6s" },
] as const;

/** English boxes were tuned so the words sit on the lockup. Other languages are measured. */
const TUNED: Record<string, number> = {
  Creativity: 430,
  "...": 130,
  Curiosity: 400,
  Collaboration: 590,
};

function boxFor(label: string) {
  return TUNED[label] ?? Math.ceil(label.length * 46);
}

export default function HeroHook() {
  const { t } = useLanguage();
  const words = t.hook;
  const pieces = [
    words[0],
    "...",
    words[1],
    "...",
    words[2],
  ];
  const labelKey = pieces.join("|");
  const fallback = pieces.map(boxFor);
  const rootRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ key: string; boxes: number[]; lengths: number[] | null } | null>(
    null,
  );
  const fitForKey = fit?.key === labelKey ? fit : null;
  const boxes = fitForKey?.boxes ?? fallback;
  const lengths = fitForKey?.lengths ?? null;

  // Dash length has to match the rendered outline, or the draw finishes early.
  // A longer translation gets a wider box so it does not run into the next word.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = [...root.querySelectorAll<SVGTextElement>(".hook-word")];
    const measuredBoxes = nodes.map((node) => {
      const label = node.textContent ?? "";
      if (label in TUNED) return TUNED[label];
      const width = node.getBBox().width;
      if (!Number.isFinite(width) || width < 8) return boxFor(label);
      return Math.ceil(width) + 16;
    });
    const current = nodes.map(
      (node) => node.ownerSVGElement?.viewBox.baseVal.width || boxFor(node.textContent ?? ""),
    );
    const boxesDiffer = measuredBoxes.some((width, index) => Math.abs(width - current[index]) > 2);
    if (boxesDiffer) {
      setFit({ key: labelKey, boxes: measuredBoxes, lengths: null });
      return;
    }
    const nextLengths = nodes.map((node) => Math.ceil(node.getBoundingClientRect().width * 4.2));
    const lengthsDiffer =
      !fitForKey?.lengths || nextLengths.some((length, index) => length !== fitForKey.lengths?.[index]);
    if (lengthsDiffer) setFit({ key: labelKey, boxes: current, lengths: nextLengths });
  }, [labelKey, fitForKey]);

  return (
    <div
      ref={rootRef}
      className={lengths ? "hero-hook hero-hook--measured" : "hero-hook"}
      role="img"
      aria-label={words.join(" ... ")}
    >
      {pieces.map((label, index) => (
        <svg
          key={`${label}-${index}`}
          className="hook-piece"
          viewBox={`0 0 ${boxes[index]} 120`}
          aria-hidden="true"
        >
          <text
            className={`hook-word float-${TIMING[index].float}`}
            x="0"
            y="96"
            style={cssVars({
              "--delay": TIMING[index].delay,
              "--float-dur": TIMING[index].dur,
              "--len": `${lengths?.[index] ?? 2400}px`,
            })}
          >
            {label}
          </text>
        </svg>
      ))}
    </div>
  );
}
