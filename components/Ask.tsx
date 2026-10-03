"use client";

import { useState, type CSSProperties } from "react";
import { useLanguage } from "./LanguageProvider";
import { WORLD_H, WORLD_OUTLINE, WORLD_W } from "@/lib/worldOutline";
import "./reach.css";

type CityId = "calgary" | "toronto" | "montreal" | "barcelona";

/** Positions are the Natural Earth projection of each city, same sheet as the coast. */
const CITIES: { id: CityId; x: number; y: number; color: string; side: "left" | "up" | "down" | "right" }[] = [
  { id: "calgary", x: 220.76, y: 131.6, color: "#e39b12", side: "left" },
  { id: "toronto", x: 297.59, y: 155.14, color: "#1aa36a", side: "down" },
  { id: "montreal", x: 314.16, y: 149.19, color: "#3b6cff", side: "up" },
  { id: "barcelona", x: 505.6, y: 162.46, color: "#e24b4b", side: "right" },
];

/* Calgary–Toronto–Montreal, then a northern arc to Barcelona. */
const ROUTE =
  "M 220.76 131.60 L 297.59 155.14 L 314.16 149.19 Q 418.39 98.37 505.60 162.46";

function ReachMap() {
  const { t } = useLanguage();
  const reach = t.reach;
  const [pinned, setPinned] = useState<CityId | null>(null);
  const [hover, setHover] = useState<CityId | null>(null);
  const active = hover ?? pinned;

  function show(id: CityId | null) {
    setHover(id);
  }

  return (
    <div className="reach">
      <div className="reach-map">
        <svg viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} role="img" aria-label={reach.mapLabel}>
          <path className="reach-land" d={WORLD_OUTLINE} />
          {/* Same dash rhythm as the hero drafting line, scaled to this sheet. */}
          <path className="reach-route" d={ROUTE} />
        </svg>
        {CITIES.map((city) => {
          const name = reach.cities[city.id];
          const place = reach.places[city.id];
          const on = active === city.id;
          return (
            <button
              key={city.id}
              type="button"
              className={`reach-pin${on ? " is-on" : ""}`}
              data-side={city.side}
              style={{
                left: `${(city.x / WORLD_W) * 100}%`,
                top: `${(city.y / WORLD_H) * 100}%`,
                "--dot": city.color,
              } as CSSProperties}
              aria-pressed={on}
              aria-label={place ? `${name}. ${place}` : name}
              onMouseEnter={() => show(city.id)}
              onMouseLeave={() => show(null)}
              onFocus={() => show(city.id)}
              onBlur={() => show(null)}
              onClick={() => setPinned((current) => (current === city.id ? null : city.id))}
            >
              <span className="reach-pin-dot" />
              <span className="reach-pin-label">
                <strong>{name}</strong>
                {place ? <span>{place}</span> : null}
              </span>
            </button>
          );
        })}
      </div>
      <div className="reach-cities" role="group" aria-label={reach.mapLabel}>
        {CITIES.map((city) => {
          const name = reach.cities[city.id];
          const on = active === city.id;
          return (
            <button
              key={city.id}
              type="button"
              className={`reach-city${on ? " is-on" : ""}`}
              style={{ "--dot": city.color } as CSSProperties}
              aria-pressed={on}
              onMouseEnter={() => show(city.id)}
              onMouseLeave={() => show(null)}
              onFocus={() => show(city.id)}
              onBlur={() => show(null)}
              onClick={() => setPinned((current) => (current === city.id ? null : city.id))}
            >
              <span className="reach-city-dot" aria-hidden="true" />
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Ask({ variant }: { variant: "main" | "partner" }) {
  const { t } = useLanguage();
  const block = variant === "main" ? t.ask : t.partnerAsk;

  return (
    <section className={`ask${variant === "partner" ? " ask--partner" : ""}`} id={variant === "main" ? "ask" : undefined}>
      <p className="ask-kicker">{block.kicker}</p>
      {block.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <ReachMap />
    </section>
  );
}
