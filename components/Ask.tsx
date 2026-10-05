"use client";

import { useState, type CSSProperties } from "react";
import { useLanguage } from "./LanguageProvider";
import { WORLD_H, WORLD_OUTLINE, WORLD_W } from "@/lib/worldOutline";
import "./reach.css";

type CityId = "calgary" | "monterey" | "toronto" | "montreal" | "barcelona";

/** Positions are the Natural Earth projection of each city, same sheet as the coast. */
const CITIES: { id: CityId; x: number; y: number; color: string; side: "left" | "up" | "down" | "right" }[] = [
  { id: "calgary", x: 220.76, y: 131.6, color: "#e39b12", side: "left" },
  // Monterey, Mexico. Spelled as given. See DESIGN_DECISIONS.md.
  { id: "monterey", x: 226.74, y: 213.8, color: "#c45c26", side: "down" },
  { id: "toronto", x: 297.59, y: 155.14, color: "#1aa36a", side: "down" },
  { id: "montreal", x: 314.16, y: 149.19, color: "#3b6cff", side: "up" },
  { id: "barcelona", x: 505.6, y: 162.46, color: "#e24b4b", side: "right" },
];

const CITY_AT = Object.fromEntries(CITIES.map((city) => [city.id, city])) as Record<
  CityId,
  (typeof CITIES)[number]
>;

/** A curve that bows north of the straight line, the way a flight route does. See DESIGN_DECISIONS.md. */
function flightArc(fromId: CityId, toId: CityId) {
  const from = CITY_AT[fromId];
  const to = CITY_AT[toId];
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  // Perpendicular. Flip so the bow points up the map (north).
  let px = -dy;
  let py = dx;
  if (py > 0) {
    px = -px;
    py = -py;
  }
  const bow = Math.min(78, Math.max(18, len * 0.22));
  const cx = (from.x + to.x) / 2 + (px / len) * bow;
  const cy = (from.y + to.y) / 2 + (py / len) * bow;
  return `M ${from.x.toFixed(2)} ${from.y.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${to.x.toFixed(2)} ${to.y.toFixed(2)}`;
}

/* Mexico–Calgary, Mexico–Barcelona, Calgary–Montreal, Calgary–Barcelona, Toronto–Mexico, Toronto–Barcelona. */
const FLIGHTS: [CityId, CityId][] = [
  ["monterey", "calgary"],
  ["monterey", "barcelona"],
  ["calgary", "montreal"],
  ["calgary", "barcelona"],
  ["toronto", "monterey"],
  ["toronto", "barcelona"],
];

const ROUTE = FLIGHTS.map(([from, to]) => flightArc(from, to)).join(" ");

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

export default function Ask() {
  const { t } = useLanguage();
  const block = t.ask;

  return (
    <section className="ask" id="ask">
      <p className="ask-kicker">{block.kicker}</p>
      {block.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <ReachMap />
    </section>
  );
}
