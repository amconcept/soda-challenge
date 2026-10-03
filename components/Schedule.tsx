"use client";

import { useEffect, useId, useMemo, useState, type CSSProperties } from "react";
import { useLanguage } from "./LanguageProvider";
import {
  DEFAULT_RULERS,
  loadSchedule,
  placeOnLine,
  type ScheduleItem,
} from "@/lib/schedule";
import "./schedule.css";

/** Distinct fill for each dot, in timeline order. Repeats only after the palette runs out. */
const DOT_COLORS = [
  "#e24b4b",
  "#3b6cff",
  "#1aa36a",
  "#e39b12",
  "#8b4dff",
  "#12a3b8",
  "#e85aa0",
  "#f26b2b",
];

const TICK =
  "repeating-linear-gradient(180deg, currentColor 0 10px, transparent 10px 14px, currentColor 14px 18px, transparent 18px 22px)";

/** True once the calendar day is over in the viewer's timezone. Today stays in color. */
function isPast(date: Date): boolean {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return date.getTime() < today;
}

export default function Schedule() {
  const { t, locale } = useLanguage();
  const [sheet, setSheet] = useState<ScheduleItem[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const tipId = useId();

  const fallback = useMemo(
    () =>
      placeOnLine(
        DEFAULT_RULERS.map((mark, index) => ({
          id: mark.id,
          date: new Date(mark.time),
          kind: "ruler" as const,
          title: t.schedule.months[index] ?? "",
          detail: "",
          school: null,
          showcase: false,
        })),
      ),
    [t],
  );

  useEffect(() => {
    let cancelled = false;
    loadSchedule(locale)
      .then((rows) => {
        if (!cancelled) setSheet(rows);
      })
      .catch(() => {
        if (!cancelled) setSheet(null);
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const items = sheet ?? fallback;
  const rulers = items.filter((item) => item.kind === "ruler");
  const dots = items.filter((item) => item.kind === "dot");

  return (
    <section id="schedule" className="brief-section">
      <p className="brief-kicker">{t.schedule.kicker}</p>
      <h2>{t.schedule.title}</h2>
      <p>{t.schedule.intro}</p>

      <div className="schedule-scroll">
        <div className="schedule-track">
          <div className="schedule-axis" aria-hidden="true" />

          {rulers.map((mark, index) => (
            <div
              key={mark.id}
              className={`schedule-mark ${index % 2 === 0 ? "is-above" : "is-below"}${isPast(mark.date) ? " is-past" : ""}`}
              style={{ left: `${mark.position}%` }}
            >
              <span className="schedule-tick" style={{ background: TICK }} aria-hidden="true" />
              <span className="schedule-mark-label">{mark.title}</span>
            </div>
          ))}

          {dots.map((event, index) => {
            const open = openId === event.id;
            const edge =
              event.position < 18 ? "schedule-dot--start" : event.position > 82 ? "schedule-dot--end" : "";
            const past = isPast(event.date);
            const color = past ? "#9a9590" : DOT_COLORS[index % DOT_COLORS.length];
            const when = new Intl.DateTimeFormat(locale, {
              month: "long",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC",
            }).format(event.date);
            return (
              <button
                key={event.id}
                type="button"
                className={`schedule-dot${past ? " is-past" : ""}${event.showcase ? " is-showcase" : ""}${open ? " is-open" : ""} ${edge}`}
                style={{ left: `${event.position}%`, "--dot": color } as CSSProperties}
                aria-expanded={open}
                aria-describedby={open ? `${tipId}-${event.id}` : undefined}
                onClick={() => setOpenId(open ? null : event.id)}
                onKeyDown={(keyboard) => {
                  if (keyboard.key === "Escape") setOpenId(null);
                }}
              >
                <span className="schedule-dot-mark" aria-hidden="true" />
                {event.school ? (
                  <>
                    <span className="schedule-leader" aria-hidden="true" />
                    <img
                      className={`schedule-sticker${event.school.id === "soda" ? " schedule-sticker--soda" : ""}`}
                      src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/partners/${event.school.file}`}
                      alt=""
                    />
                  </>
                ) : null}
                <span className="visually-hidden">
                  {when}. {event.title}
                  {event.school ? `. ${event.school.label}` : ""}
                </span>
                <span className="schedule-tip" id={`${tipId}-${event.id}`} role="tooltip">
                  <span className="schedule-tip-date">{when}</span>
                  <strong>{event.title}</strong>
                  {event.detail ? <span>{event.detail}</span> : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
