import type { Locale } from "./copy";

/**
 * Every mark on the timeline is a row in a Google Sheet.
 * Add a row to place something, change its date to move it, delete the row to remove it.
 *
 * Header (row 1):
 *   date | kind | title | detail | school | title_es | detail_es | title_fr | detail_fr
 * kind:
 *   ruler — vertical drafting tick and a label (September, a deadline name, …)
 *   dot   — a point you can hover for title + detail
 * school (optional): bcn, ocad, or lcc. If the column is blank, a mention in the
 * title or detail still shows that school’s sticker (for example “Fab Lab BCN”).
 * Two or more schools on one date show the SOD+A sticker instead of a stack.
 * A title, detail, or kind that contains “showcase” draws a diamond and the
 * celebrate sticker (balloons). That sticker replaces a school sticker on the
 * same date.
 * If kind is blank, a row with detail is a dot; a row with only a title is a ruler.
 * Dates: 2026-09-15, or a normal Sheets date cell.
 * Detail: a line break is kept. A line that starts with • is a bullet.
 * Wrap a word in *asterisks* to make it bold. The bold button in the sheet
 * does not travel with the public feed, so the asterisks are the mark that does.
 *
 * 1. Share the file as “Anyone with the link” → Viewer.
 * 2. Paste the ID (the long string in the sheet URL) below.
 */
export const SCHEDULE_SHEET_ID = "1k3HFf9WBIDVUyIq2d2cBxMLXVSBvgugDS_EKfLZOjr8";

/** Shown only until a sheet is connected. The sheet replaces these entirely. */
export const DEFAULT_RULERS = [
  { id: "sep", time: Date.UTC(2026, 8, 1) },
  { id: "nov", time: Date.UTC(2026, 10, 1) },
  { id: "feb", time: Date.UTC(2027, 1, 1) },
  { id: "may", time: Date.UTC(2027, 4, 1) },
] as const;

export type ScheduleKind = "ruler" | "dot";

export type ScheduleSchool = {
  id: "bcn" | "ocad" | "lcc" | "soda";
  file: string;
  label: string;
};

/** Shown when a date names more than one school. */
export const SODA_STICKER: ScheduleSchool = {
  id: "soda",
  file: "soda-sticker.png",
  label: "SOD+A",
};

const SCHOOLS: { id: ScheduleSchool["id"]; file: string; label: string; keys: string[] }[] = [
  {
    id: "bcn",
    file: "soda-17.svg",
    label: "Fab Lab Barcelona",
    keys: ["fab lab bcn", "fablab bcn", "fab lab barcelona", "fablab barcelona", "barcelona", "bcn"],
  },
  {
    id: "ocad",
    file: "soda-16.svg",
    label: "OCAD University",
    keys: ["ocad university", "ocadu", "ocad"],
  },
  {
    id: "lcc",
    file: "soda-18.svg",
    label: "LCC Fab Lab",
    keys: ["lower canada", "lcc fab lab", "lcc"],
  },
];

/** Every partner named in a cell. “soda” means the shared mark on its own. */
export function schoolsFromText(value: string): ScheduleSchool[] {
  const text = value.trim().toLowerCase();
  if (!text) return [];
  if (/\bsoda\b|sod\s*\+\s*a/.test(text)) return [SODA_STICKER];
  const found: ScheduleSchool[] = [];
  for (const school of SCHOOLS) {
    if (school.keys.some((key) => text.includes(key))) {
      found.push({ id: school.id, file: school.file, label: school.label });
    }
  }
  return found;
}

/** One school keeps its sticker. Two or more become the SOD+A sticker. */
export function stickerForSchools(groups: ScheduleSchool[][]): ScheduleSchool | null {
  const seen = new Map<ScheduleSchool["id"], ScheduleSchool>();
  for (const group of groups) {
    for (const school of group) {
      if (school.id === "soda") return SODA_STICKER;
      seen.set(school.id, school);
    }
  }
  if (seen.size > 1) return SODA_STICKER;
  return [...seen.values()][0] ?? null;
}

export type ScheduleItem = {
  id: string;
  date: Date;
  /** 0–100 along the axis, from the earliest row to the latest. */
  position: number;
  kind: ScheduleKind;
  title: string;
  detail: string;
  school: ScheduleSchool | null;
  /** Title, detail, or kind contains “showcase”. Diamond on the line, celebrate sticker above. */
  showcase: boolean;
};

/** Spread items from the first date to the last, inset so end labels are not clipped. */
export function placeOnLine(items: Omit<ScheduleItem, "position">[]): ScheduleItem[] {
  if (!items.length) return [];
  const times = items.map((item) => item.date.getTime());
  const start = Math.min(...times);
  const end = Math.max(...times);
  const span = end - start;
  return [...items]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((item) => ({
      ...item,
      position: span === 0 ? 50 : 12 + ((item.date.getTime() - start) / span) * 76,
    }));
}

function sheetId(value: string): string {
  const fromUrl = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return (fromUrl?.[1] ?? value).trim();
}

function parseDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const iso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3]));
  const sheets = trimmed.match(/^Date\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (sheets) return new Date(Date.UTC(+sheets[1], +sheets[2], +sheets[3]));
  const parsed = Date.parse(trimmed);
  if (Number.isNaN(parsed)) return null;
  const local = new Date(parsed);
  return new Date(Date.UTC(local.getFullYear(), local.getMonth(), local.getDate()));
}

function cellText(cell: { v?: unknown; f?: unknown } | null | undefined): string {
  if (!cell) return "";
  if (typeof cell.v === "string" && /^Date\(/.test(cell.v)) return cell.v;
  if (typeof cell.f === "string" && cell.f.trim()) return cell.f.trim();
  if (typeof cell.v === "string") return cell.v.trim();
  if (typeof cell.v === "number") return String(cell.v);
  return "";
}

type Gviz = {
  table?: {
    cols?: { label?: string }[];
    rows?: { c?: ({ v?: unknown; f?: unknown } | null)[] }[];
  };
};

function kindOf(raw: string, detail: string): ScheduleKind {
  const value = raw.trim().toLowerCase();
  if (["ruler", "tick", "month", "divider", "mark", "line"].includes(value)) return "ruler";
  if (["dot", "event", "date"].includes(value)) return "dot";
  return detail ? "dot" : "ruler";
}

/** Turn a gviz response into timeline rows. Blank date rows are skipped. */
export function itemsFromGviz(payload: string, locale: Locale): ScheduleItem[] {
  const start = payload.indexOf("{");
  const end = payload.lastIndexOf("}");
  if (start < 0 || end < start) return [];
  let data: Gviz;
  try {
    data = JSON.parse(payload.slice(start, end + 1)) as Gviz;
  } catch {
    return [];
  }
  const cols = (data.table?.cols ?? []).map((col) => (col.label ?? "").trim().toLowerCase());
  const index = (name: string) => cols.indexOf(name);

  const dateCol = index("date") >= 0 ? index("date") : index("when");
  const kindCol = index("kind") >= 0 ? index("kind") : index("type");
  const titleCol = ["title", "event", "label", "month"].map(index).find((i) => i >= 0) ?? -1;
  const detailCol = ["detail", "details", "description", "notes"]
    .map(index)
    .find((i) => i >= 0) ?? -1;
  const schoolCol = ["school", "host", "partner", "logo"].map(index).find((i) => i >= 0) ?? -1;
  if (dateCol < 0) return [];

  const titleKey = locale === "en" ? "title" : `title_${locale}`;
  const titleAlt = locale === "en" ? "title" : `titles_${locale}`;
  const detailKey = locale === "en" ? "detail" : `detail_${locale}`;
  const titleLocale = index(titleKey) >= 0 ? index(titleKey) : index(titleAlt);
  const detailLocale = index(detailKey);

  const items: Omit<ScheduleItem, "position">[] = [];
  for (const row of data.table?.rows ?? []) {
    const cells = row.c ?? [];
    const date = parseDate(cellText(cells[dateCol]));
    if (!date) continue;
    const title =
      (titleLocale >= 0 ? cellText(cells[titleLocale]) : "") ||
      (titleCol >= 0 ? cellText(cells[titleCol]) : "");
    const detail =
      (detailLocale >= 0 ? cellText(cells[detailLocale]) : "") ||
      (detailCol >= 0 ? cellText(cells[detailCol]) : "");
    const kindText = kindCol >= 0 ? cellText(cells[kindCol]) : "";
    const kind = kindOf(kindText, detail);
    const englishTitle = titleCol >= 0 ? cellText(cells[titleCol]) : "";
    const schoolText = schoolCol >= 0 ? cellText(cells[schoolCol]) : "";
    const school = stickerForSchools([
      schoolsFromText(schoolText),
      schoolsFromText(title),
      schoolsFromText(detail),
    ]);
    const showcase = /showcase/i.test(`${kindText} ${englishTitle} ${title} ${detail}`);
    items.push({
      id: `${kind}-${date.toISOString()}-${title}`,
      date,
      kind,
      title: title || date.toISOString().slice(0, 10),
      detail: kind === "dot" ? detail : "",
      school: kind === "dot" ? school : null,
      showcase: kind === "dot" && showcase,
    });
  }
  return placeOnLine(items);
}

/** Sheet rows, or null when no sheet is connected (the page keeps its default rulers). */
export async function loadSchedule(locale: Locale): Promise<ScheduleItem[] | null> {
  const id = sheetId(SCHEDULE_SHEET_ID || process.env.NEXT_PUBLIC_SCHEDULE_SHEET_ID || "");
  if (!id) return null;
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&headers=1`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;
  return itemsFromGviz(await response.text(), locale);
}
