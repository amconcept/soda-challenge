/**
 * Design challenge deck from Rando Calrissian.
 * Includes and Explores lock to one grouping, physical or digital.
 * Uses is the "that has been" list. It is not a named tool, and it is not
 * locked to a grouping. Spanish and French lines are machine drafts.
 * See DESIGN_DECISIONS.md.
 */
import type { Locale } from "@/lib/copy";

type Line = { en: string; es: string; fr: string };

function line(en: string, es: string, fr: string): Line {
  return { en, es, fr };
}

const DECK = {
  physical: {
    includes: [
      line("paper", "papel", "papier"),
      line("cardboard", "cartón", "carton"),
      line("string", "cuerda", "ficelle"),
      line("wire", "alambre", "fil de fer"),
      line("fabric scraps", "retazos de tela", "chutes de tissu"),
      line("packaging", "embalaje", "emballage"),
    ],
    explores: [
      line("balance", "equilibrio", "équilibre"),
      line("support", "soporte", "appui"),
      line("wobble", "tambaleo", "vacillement"),
      line("motion", "movimiento", "mouvement"),
      line("slowness", "lentitud", "lenteur"),
      line("rhythm", "ritmo", "rythme"),
      line("patterns", "patrones", "motifs"),
    ],
  },
  digital: {
    includes: [
      line("light", "luz", "lumière"),
      line("shadow", "sombra", "ombre"),
      line("sound", "sonido", "son"),
      line("your voice", "tu voz", "votre voix"),
      line("data", "datos", "données"),
      line("air", "aire", "air"),
    ],
    explores: [
      line("opposites", "opuestos", "contraires"),
      line("chance", "azar", "hasard"),
      line("surprise", "sorpresa", "surprise"),
      line("illusions", "ilusiones", "illusions"),
      line("echoes", "ecos", "échos"),
      line("memory", "memoria", "mémoire"),
    ],
  },
} as const;

/** Completes "make something that...." Not a machine name. */
const BEEN = [
  line("cut", "cortado", "coupé"),
  line("printed", "impreso", "imprimé"),
  line("scanned", "escaneado", "scanné"),
  line("coded", "codificado", "codé"),
  line("modeled", "modelado", "modelé"),
  line("projected", "proyectado", "projeté"),
  line("layered", "en capas", "en couches"),
  line("embroidered", "bordado", "brodé"),
  line("soldered", "soldado", "soudé"),
  line("folded", "doblado", "plié"),
  line("cooked", "cocinado", "cuit"),
  line("animated", "animado", "animé"),
] as const;

type Group = keyof typeof DECK;
type MaterialColumn = "includes" | "explores";

export type SlotPick = { group: Group; index: number };

export type PromptPick = {
  includes: SlotPick;
  uses: number;
  explores: SlotPick;
};

const GROUPS = Object.keys(DECK) as Group[];

function pickIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

function slot(group: Group, column: MaterialColumn): SlotPick {
  return { group, index: pickIndex(DECK[group][column].length) };
}

/** One finished draw. Includes and Explores share a grouping. Uses is open. */
export function drawHand(): PromptPick {
  const group = GROUPS[pickIndex(GROUPS.length)];
  return {
    includes: slot(group, "includes"),
    uses: pickIndex(BEEN.length),
    explores: slot(group, "explores"),
  };
}

/** A flicker frame. Columns are mixed so the landing is not given away. */
export function scrambleHand(): PromptPick {
  const mixed = (column: MaterialColumn): SlotPick =>
    slot(GROUPS[pickIndex(GROUPS.length)], column);
  return {
    includes: mixed("includes"),
    uses: pickIndex(BEEN.length),
    explores: mixed("explores"),
  };
}

/** The words for a draw in the visitor's language. */
export function phrase(
  pick: SlotPick | number,
  column: "includes" | "uses" | "explores",
  locale: Locale,
): string {
  if (column === "uses") return BEEN[pick as number][locale];
  const slotPick = pick as SlotPick;
  return DECK[slotPick.group][column][slotPick.index][locale];
}

/** Shown when the visitor has asked the browser to skip animation. Cardboard, printed, support. */
export const STILL_HAND: PromptPick = {
  includes: { group: "physical", index: 1 },
  uses: 1,
  explores: { group: "physical", index: 1 },
};
