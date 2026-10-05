"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

const exampleAsset = (id: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/examples/${id}.jpg`;

/** A short sideways strip. One board opens under it. See DESIGN_DECISIONS.md. */
export default function StudentBoards() {
  const { t } = useLanguage();
  const boards = t.involve.examples;
  const [openId, setOpenId] = useState<string | null>(null);
  const open = boards.find((board) => board.id === openId) ?? null;

  useEffect(() => {
    if (!openId) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  return (
    <div className="year-roll">
      <p className="year-roll-label">{t.involve.examplesTitle}</p>
      <ul className="year-roll-strip">
        {boards.map((board) => {
          const on = openId === board.id;
          return (
            <li key={board.id}>
              <button
                type="button"
                className={`year-roll-card${on ? " is-open" : ""}`}
                aria-expanded={on}
                onClick={() => setOpenId(on ? null : board.id)}
              >
                <img src={exampleAsset(board.id)} alt="" />
                <span>{board.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {open ? (
        <button
          type="button"
          className="year-roll-open"
          onClick={() => setOpenId(null)}
          aria-label={open.name}
        >
          <img src={exampleAsset(open.id)} alt={open.name} />
        </button>
      ) : null}
    </div>
  );
}
