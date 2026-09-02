"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Size = "lg" | "md" | "sm";

const ORDER: Size[] = ["lg", "md", "sm", "md", "sm"];

type Float = "a" | "b" | "c" | "d";

type Spot = {
  size: Size;
  s: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  float: Float;
  dur: number;
  delay: number;
  src: string;
};

const DeckContext = createContext<string[]>([]);

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/** Shuffles the photo list once per page load so bands don't all show the same crop. */
export function BubbleDeckProvider({
  images,
  children,
}: {
  images: string[];
  children: ReactNode;
}) {
  // Shuffle on first render so child bands can place photos in their mount effect.
  const [deck] = useState(() => (images.length ? shuffle(images) : []));
  return <DeckContext.Provider value={deck}>{children}</DeckContext.Provider>;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function measureSize(width: number, height: number, size: Size) {
  const maxFit = Math.max(72, height - 24);
  if (size === "lg") return Math.min(width * 0.42, 480, maxFit);
  if (size === "md") return Math.min(width * 0.26, 280, maxFit);
  return Math.min(width * 0.16, 180, maxFit);
}

function overlaps(placed: Spot[], x: number, y: number, s: number) {
  const cx = x + s / 2;
  const cy = y + s / 2;
  return placed.some((p) => {
    const d = Math.hypot(p.x + p.s / 2 - cx, p.y + p.s / 2 - cy);
    return d < (p.s + s) * 0.4;
  });
}

function scatter(width: number, height: number, photos: string[]): Spot[] {
  const pad = 12;
  const placed: Spot[] = [];
  const sizes = height < 400 ? (["md", "sm", "sm"] as Size[]) : ORDER;
  const floats: Float[] = ["a", "b", "c", "d"];

  for (const size of sizes) {
    const s = measureSize(width, height, size);
    const maxX = Math.max(pad, width - s - pad);
    const maxY = Math.max(pad, height - s - pad);
    let x = rand(pad, maxX);
    let y = rand(pad, maxY);
    for (let attempt = 0; attempt < 80; attempt++) {
      const nx = rand(pad, maxX);
      const ny = rand(pad, maxY);
      if (!overlaps(placed, nx, ny, s)) {
        x = nx;
        y = ny;
        break;
      }
    }
    placed.push({
      size,
      s,
      x: Math.min(Math.max(x, pad), maxX),
      y: Math.min(Math.max(y, pad), maxY),
      dx: rand(-22, 22),
      dy: rand(14, 40) * (Math.random() < 0.5 ? 1 : -1),
      float: floats[placed.length % 4],
      dur: rand(5.8, 7.8),
      delay: rand(0, 1.8),
      src: photos[placed.length % Math.max(photos.length, 1)] ?? "",
    });
  }

  return placed;
}

/** Photos in circular frames. Positions and which photo each shows randomise on load. */
export default function Bubbles({
  variant,
  slot,
}: {
  variant: "a" | "b" | "c";
  slot: number;
}) {
  const [bandEl, setBandEl] = useState<HTMLDivElement | null>(null);
  const deck = useContext(DeckContext);
  const [spots, setSpots] = useState<Spot[] | null>(null);

  useEffect(() => {
    if (!bandEl || !deck.length) return;
    const { width, height } = bandEl.getBoundingClientRect();
    const count = height < 400 ? 3 : 5;
    const start = slot * 5;
    const photos = Array.from(
      { length: count },
      (_, i) => deck[(start + i) % deck.length],
    );
    setSpots(scatter(width, height, photos));
  }, [variant, slot, deck, bandEl]);

  useEffect(() => {
    if (!bandEl || !spots) return;

    let current = 0;
    let target = 0;
    let frame = 0;

    function measure() {
      const box = bandEl.getBoundingClientRect();
      const mid = box.top + box.height / 2;
      target = Math.max(
        -0.7,
        Math.min(0.7, (window.innerHeight / 2 - mid) / window.innerHeight),
      );
    }

    function tick() {
      frame = 0;
      measure();
      current += (target - current) * 0.12;
      bandEl.style.setProperty("--shift", current.toFixed(4));
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
  }, [spots, bandEl]);

  return (
    <div ref={setBandEl} className={`bubbles bubbles--${variant}`} aria-hidden="true">
      {spots?.map((spot, index) => (
        <div
          key={`${spot.size}-${index}`}
          className={`bubble bubble--${spot.size}`}
          style={{
            left: spot.x,
            top: spot.y,
            width: spot.s,
            height: spot.s,
            ["--dx" as string]: String(spot.dx),
            ["--dy" as string]: String(spot.dy),
          }}
        >
          <span
            className={`bubble-float bubble-float--${spot.float}`}
            style={{
              ["--float-dur" as string]: `${spot.dur.toFixed(2)}s`,
              ["--float-delay" as string]: `${spot.delay.toFixed(2)}s`,
            }}
          >
            {spot.src ? (
              <img src={spot.src} alt="" draggable={false} />
            ) : null}
          </span>
        </div>
      ))}
    </div>
  );
}
