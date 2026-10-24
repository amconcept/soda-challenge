/**
 * Design challenge deck from Rando Calrissian.
 * A draw locks to one grouping, then takes one line from each column.
 * Blank cells in the activity are left out.
 * Spanish and French lines are machine drafts and need a native read.
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
    uses: [
      line("a cutting machine", "una máquina de corte", "une machine de découpe"),
      line("a printer", "una impresora", "une imprimante"),
      line("embroidery", "bordado", "broderie"),
      line("sewing", "costura", "couture"),
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
    uses: [
      line("a scanner", "un escáner", "un scanner"),
      line("LEDs and microcontroller", "LEDs y un microcontrolador", "des LED et un microcontrôleur"),
      line("a sound sensor", "un sensor de sonido", "un capteur de son"),
      line("a servo motor", "un servomotor", "un servomoteur"),
      line("a capacitive sensor", "un sensor capacitivo", "un capteur capacitif"),
      line("projection", "proyección", "projection"),
      line("vectors", "vectores", "vecteurs"),
      line("3D modelling", "modelado 3D", "modélisation 3D"),
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

type Group = keyof typeof DECK;
type Column = "includes" | "uses" | "explores";

export type SlotPick = { group: Group; index: number };

export type PromptPick = {
  includes: SlotPick;
  uses: SlotPick;
  explores: SlotPick;
};

const GROUPS = Object.keys(DECK) as Group[];

function pickIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

function slot(group: Group, column: Column): SlotPick {
  return { group, index: pickIndex(DECK[group][column].length) };
}

/** One finished draw. Every column comes from the same grouping. */
export function drawHand(): PromptPick {
  const group = GROUPS[pickIndex(GROUPS.length)];
  return {
    includes: slot(group, "includes"),
    uses: slot(group, "uses"),
    explores: slot(group, "explores"),
  };
}

/** A flicker frame. Columns are mixed so the landing is not given away. */
export function scrambleHand(): PromptPick {
  const mixed = (column: Column): SlotPick => slot(GROUPS[pickIndex(GROUPS.length)], column);
  return {
    includes: mixed("includes"),
    uses: mixed("uses"),
    explores: mixed("explores"),
  };
}

/** The words for a draw in the visitor's language. */
export function phrase(pick: SlotPick, column: Column, locale: Locale): string {
  return DECK[pick.group][column][pick.index][locale];
}

/** Shown when the visitor has asked the browser to skip animation. Cardboard, a printer, support. */
export const STILL_HAND: PromptPick = {
  includes: { group: "physical", index: 1 },
  uses: { group: "physical", index: 1 },
  explores: { group: "physical", index: 1 },
};
