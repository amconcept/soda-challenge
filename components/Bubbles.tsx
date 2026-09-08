"use client";

import { useEffect, useRef } from "react";

type Size = "lg" | "md" | "sm";

const SIZES: Size[] = ["lg", "md", "sm", "md"];
const FLOATS = ["a", "b", "c", "d"] as const;

/** Photos in overlapping circular frames, clustered so a short band sits between copy blocks. */
export default function Bubbles({
  images,
  variant,
  slot,
}: {
  images: string[];
  variant: "a" | "b" | "c";
  slot: number;
}) {
  const bandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = bandRef.current;
    if (!root) return;

    let current = 0;
    let target = 0;
    let frame = 0;

    function measure() {
      const node = bandRef.current;
      if (!node) return;
      const box = node.getBoundingClientRect();
      const mid = box.top + box.height / 2;
      target = Math.max(
        -0.7,
        Math.min(0.7, (window.innerHeight / 2 - mid) / window.innerHeight),
      );
    }

    function tick() {
      const node = bandRef.current;
      if (!node) return;
      frame = 0;
      measure();
      current += (target - current) * 0.12;
      node.style.setProperty("--shift", current.toFixed(4));
      if (Math.abs(target - current) > 0.002) {
        frame = requestAnimationFrame(tick);
      }
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(tick);
    }

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [variant, slot]);

  if (!images.length) return <div className={`bubbles bubbles--${variant}`} aria-hidden="true" />;

  const photos = SIZES.map((_, i) => images[(slot * 4 + i) % images.length]);

  return (
    <div ref={bandRef} className={`bubbles bubbles--${variant}`} aria-hidden="true">
      <div className="bubble-cluster">
        {photos.map((src, index) => (
          <div
            key={`${slot}-${index}`}
            className={`bubble bubble--${SIZES[index]}`}
          >
            <span className={`bubble-float bubble-float--${FLOATS[index]}`}>
              <span className="bubble-photo">
                <img src={src} alt="" draggable={false} />
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
