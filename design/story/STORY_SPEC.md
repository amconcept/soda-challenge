# Design spec: SOD+A story film + balloon reveal in the hero

## Overview
The stick-figure explainer (four approved test animatics) stitched into one canvas
engine that plays transparently over the hero. Two uses:

1. **Page load, logo first.** The hook line plays as now. Four balloons float up and
   pop in reading order. Each pop shows one part of the site's own lockup, which then
   floats exactly as it does today. Replaces the technical string-in draw.
2. **Watch the story.** A pill beside DISCOVER plays the whole film (about 74 s) in the
   hero. It ends in the same balloon reveal, back on the floating logo.

The canvas never draws the logo. `HeroLockup.tsx` stays the single source of the mark.

## Files
| Path | What |
|---|---|
| `components/story/engine/index.js` | Player: timeline, seams, sizing, cues, pause offscreen. Public API. |
| `components/story/engine/index.d.ts` | Types for strict TSX. |
| `components/story/engine/core.js` | Shared ink and math (line boil, wobble, weights). Was duplicated four times. |
| `components/story/engine/reveal.js` | Balloons, puffs, pop lines, final ding. Aims at page elements. |
| `components/story/engine/chapters/ch1-button.js` | Chapter 1, 16.5 s. Lazy loaded. |
| `components/story/engine/chapters/ch2-share.js` | Chapter 2, 18.8 s. Lazy loaded. |
| `components/story/engine/chapters/ch3-codesign.js` | Chapter 3, 34.5 s. Lazy loaded. |
| `design/story/SODA Story.reference.html` | Open in a browser. Hero mock with the full behaviour and a Review panel. |
| `design/story/reference/` | Template + regrouped lockup SVG the reference is built from. |
| `design/story/animatics/` | The four approved tests, each with its tuning panel. Provenance only. |

Chapter files are the approved scene code, unchanged except: shared helpers come from
`core.js`, the player UI is removed, `render()` draws to a transparent canvas. Verified
pixel identical to the approved tests at 20 sample frames.

## Timeline
| Story t (s) | Event |
|---|---|
| 0 to 16.5 | Chapter 1: the button |
| 16.5 to 17.25 | Seam: hand-drawn pen line wipes right to left |
| 16.5 to 35.3 | Chapter 2: making and sharing, planet, board |
| 35.3 to 36.1 | Seam: cross-dissolve (same camera and board, so they stay solid) |
| 35.3 to 69.8 | Chapter 3: co-design, celebration, balloons rise |
| 69.8 | Reveal takes over chapter 3's four balloons in place (invisible cut) |
| +1.3 / 1.65 / 2.0 | Pops: S.o. / d+a. / CHALLENGE |
| +2.45 | Ding over the finished logo |
| +2.9 | Pop: partner row (stickers land) |
| +4.2 | `done` |

Logo-first reveal: balloons rise from below the hero. `playReveal({ firstPop })` sets
when the first pop lands; pops follow 0.35 s apart, partners 0.9 s after CHALLENGE.
Drawn at 12 fps on twos, like the tests. Line boil 8 per second.

## Engine API
```ts
import { createStory } from "@/components/story/engine/index.js";
const story = createStory(canvas, {
  ink: () => css("--hero-line"),      // line colour
  paper: () => css("--page-bg"),      // knockout colour, read every frame (ScrollHue wash)
  targets: () => [rectS_O, rectD_A, rectCHALLENGE, rectStickers], // CSS px, relative to canvas
  onCue: (name, d) => {},             // see below
});
story.playReveal({ firstPop: 2.2 });  // page load
await story.playStory();              // Watch the story (chapters download on first use)
story.preload();                      // call on hover/focus of the Watch pill
story.skip(); story.pause(); story.resume(); story.destroy();
```
Cues: `reset` (hide all parts), `pop` {i, instant}, `ding`, `chapter` {chapter},
`state` {state: loading | story | reveal | done}, `done`. Drive the DOM with classList
and dataset on refs, not React state, so the hero does not re-render (SPEC rule).

Transparency: the canvas is cleared, never filled. Heads, bubbles and the board use
`paper` as a knockout, so it must be the live page colour. `--page-bg` is set by
`ScrollHue.tsx` every frame on the hero.

## Lockup changes (HeroLockup.tsx)
Path data stays verbatim. Regroup into reveal parts:
- `data-reveal="0"`: S group, O group, dots at cx 614.55 and 865.45
- `data-reveal="1"`: D, plus, A groups, dot at cx 1515.24
- `data-reveal="2"`: the nine CHALLENGE glyphs
- `data-reveal="3"`: on `.hero-partners`; aim the balloon at `.hero-stickers`
- CAD construction layer: hidden in balloon mode (`data-show-schematic="false"`).

`design/story/reference/lockup-reveal.svg` shows the exact regrouping.

## CSS for the hand-off (port from the reference)
- Hidden parts keep layout: `[data-reveal]:not(.is-in) { opacity: 0 }` (no transform, so
  the balloons measure true sizes).
- Pop: `.is-in` runs `revealPop` 0.3 s `cubic-bezier(.34,1.56,.64,1)`, scale .8 to 1,
  opacity in by 27%. `.instant` skips it.
- Strokes fully drawn in balloon mode: no `draw`/`fillIn`, `stroke-dashoffset: 0`,
  glyph and dot `fill-opacity: 1`.
- Floats: existing `floatA` to `floatD` and per-element `--float-dur`, started by `.is-in`
  with 0.3 s delay. Nothing floats before it lands.
- Partners: `.hero-partners.is-in` fades the label and runs `stickerIn` with 0, .2, .3, .4 s
  stagger, then floats.
- Season label, DISCOVER and Watch the story fade in on `done`.
- Story mode `[data-mode="story"]`: hide `.hero-play` and the hook; show it again when
  `data-chapter="reveal"`. Canvas `position:absolute; inset:0; pointer-events:none; z-index:3`.
- Controls bottom right: Pause and Skip pills (DISCOVER recipe, smaller). 2px progress
  line at the bottom of the hero.

## Behaviour
- Page load: keep the hook line (`--hero-seq` 3.9 s). Call `playReveal({ firstPop: 2.2 })`
  1.7 s after ready, so the first pop lands at 3.9 s where SOD+A used to start drawing.
  The lockup sits at its final position (rest transforms, no `lockupRise`).
- 20 s fade and replay loop: off in balloon mode. The logo floats indefinitely.
- Watch the story: focus moves to Pause. Esc skips, Space pauses. On `done`, focus
  returns to Watch the story.
- Phones in portrait: request fullscreen on the hero and try
  `screen.orientation.lock('landscape')`. iOS ignores both and plays inline.
- Offscreen or hidden tab: the engine pauses itself and resumes where it was.
- Reduced motion: `playReveal` shows the final state at once. Watch the story is still
  offered, because it is the person's choice, with Pause available.
- Chapters 1 to 3 are a separate chunk (about 140 KB raw), loaded on first Watch.

## Copy (lib/copy.ts)
| key | en | es (machine draft) | fr (machine draft) |
|---|---|---|---|
| watchStory | Watch the story | Ver la historia | Voir l'histoire |
| skip | Skip | Saltar | Passer |
| pause | Pause | Pausa | Pause |
| play | Play | Reproducir | Lecture |
| storyLine (only if the closing line is turned on) | From discovery to action | Del descubrimiento a la acción | De la découverte à l'action |

## Decisions to log in DESIGN_DECISIONS.md (flagged, not final)
1. Logo first on load, film on request. A 74 s film before the logo would hide the brand.
2. Fourth balloon reveals the partner row. The press-fit mark is not in the live lockup.
3. Closing line "From discovery to action" is off in the hero. It competes with the hook
   and lands where the partner row sits. Engine option `tagline` turns it on; it then
   writes under CHALLENGE and clears before the partners land (try it in the Review panel).
   Needs Caveat via `next/font` if turned on.
4. No 20 s replay loop in balloon mode.
5. CAD construction layer hidden in balloon mode.
6. Ink uses the hero line colour `#0e0d0c` (tests used `#141414`).

## Known limits
- Film length is 74 s. A shorter social cut needs a separate edit.
- iPhone plays the 16:9 film inline in portrait.
- Not built or tested inside Next here (no package access in this workspace). Engine and
  reference were tested in Chromium at 1440, 1280 and 390 wide; API type-checks under strict TS.
