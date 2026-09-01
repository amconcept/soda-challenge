# Design spec: SOD+A CHALLENGE — animated hero (logo string-in + press-fit mark + partner strip)

## Overview
The landing-page hero for the SOD+A CHALLENGE site. On load the SOD+A logotype "strings"
itself into existence stroke by stroke, CAD construction geometry fades in alongside each
letter, the CHALLENGE wordmark fills in, a two-piece press-fit mark assembles, then every
element begins an independent slow float. Partner stickers land last, followed by a
DISCOVER scroll cue. Total sequence ≈ 9.2s at speed = 1.

## About the Design Files
The files in this bundle are **design references authored in HTML/SVG** — a working
prototype of the intended look, timing and behaviour. They are **not production code to
paste in**. Recreate this hero inside the target codebase using its own conventions
(React/Vue/Astro/etc., its animation library, its asset pipeline). If no codebase exists
yet, pick the framework best suited to a content-driven scrolling marketing site
(Next.js/Astro are both good fits) and implement it there.

`SODA Logo Reveal.dc.html` is a self-contained single file: open it directly in a browser
to watch the reference animation. The logic class at the bottom of the file holds the
palette application, replay, and the (currently unused) WebAudio cue engine.

## Fidelity
**High fidelity.** Geometry, timings, easings, stroke weights and colours are final and
should be matched. The one deliberately open area is the page *below* the hero — it does
not exist yet; DISCOVER is wired to scroll one viewport.

## Screens / Views

### Hero (single full-viewport view)
- **Purpose**: brand statement + entry point to the scrolling site.
- **Layout**: root is a `100vh` flex column, `align-items:center; justify-content:center`,
  `gap:0.6vh`, `padding:2vh 0 4vh`, `overflow:hidden`.
  1. **Logo stage** — inline SVG, `width:88%; max-width:1240px; flex:1 1 auto; min-height:0`,
     `viewBox="300 110 1330 870"`. All artwork lives in this one coordinate space, so the
     whole lockup scales as one unit and letterboxes on short viewports.
  2. **Partner strip** — flex column, `gap:5vh`, `margin-top:-4vh`, `flex:0 0 auto`.
     Row 1: 46px rule + label + 46px rule (rules are 1px, `opacity:.45`).
     Row 2: three sticker images, `gap:clamp(24px,4vw,52px)`, each
     `height:clamp(84px,16vh,132px)`.
  3. **DISCOVER button** — `margin-top:3.4vh`, pill, see below.
  4. **Replay control** — `position:fixed; bottom:24px; left:24px; z-index:5`.

#### Components
- **SOD+A logotype**: stroke-only SVG paths, `fill:none`, `stroke:currentColor`,
  `stroke-linecap/linejoin:round`, stroke-width = `strokeWeight` token (default 2, range 2–26;
  the reference screenshots use 5). Letters are built from circular arcs: S centres
  (489.35, 264.15) and (489.35, 459.52) r=121.78; O centre (743.66, 459.52) r=121.78;
  D centre (998.30, 459.52) r=121.78 with stems at x=1104.06 / 1120.08; A centre
  (1344.50, 465.70) r=121.78. The "+" is a rounded-corner cross path at (1140–1201, 422–495),
  stroke-only at stroke-width 7. Three separator dots: circles r=15.87 at
  (614.55, 560.03), (865.45, 560.03), (1515.24, 560.03) — filled, stroke-width 2.
- **CHALLENGE wordmark**: 9 filled glyph paths spanning x 376–1421, y 638–773. Each is
  drawn as an outline first (stroke-width 1.6) then its fill fades in
  (`fill-opacity 0 → 1`).
- **Press-fit mark** (toggle `showMark`, default off): two pieces at x 1425–1573, y 677–925,
  stroke-width 4. *Base* = slotted slab (polygon + 4 edge lines). *Tab* = upright slab with
  a bottom tenon (5 polylines + 4 lines). They draw while held apart, then assemble.
- **CAD construction layer** (toggle `showSchematic`, default on): `stroke-width:1.3`,
  group `opacity:.5`. Dashed radius circles r=145 around all five arc centres
  (`stroke-dasharray:9 7`); dash-dot centreline y=459.52 from x=330→1500 and vertical axes
  at x=489.35, 1120.08, 1344.5 (`stroke-dasharray:26 8 6 8`); 29px center-mark crosses at
  the S/O/D/A centres. (No dimension lines, arrowheads, hatch marks, numeric labels or
  wordmark baseline — those were explicitly removed.)
- **Partner stickers**: three SVGs — OCAD University, Fab Lab BCN, LCC Fab Lab. Black
  artwork (#111) on a cream die-cut plate (#f7f2ea) with a 3px #111 keyline, so they stay
  legible on any background.
- **Label**: "Co-created by", 11px, `letter-spacing:.26em`, uppercase, `opacity:.7`,
  colour = line colour.
- **DISCOVER button**: pill, transparent fill, `1px solid currentColor`, colour = line
  colour, 12px / `letter-spacing:.26em` / uppercase, `padding:13px 26px 13px 28px`,
  `border-radius:999px`, `gap:12px`, with a 13×17 down-arrow (1px stem + chevron,
  stroke-width 1.6) that loops a 5px vertical nudge every 1.9s.
- **Replay button**: same pill recipe, 11px, `letter-spacing:.14em`, colour derived from the
  line colour at 55% alpha.
- **Typography**: one family throughout — `ui-monospace, SFMono-Regular, Menlo, monospace`.
  All type is UI chrome; there is no body copy in the hero.

## Interactions & Behavior

### The string-in technique
Every stroke carries `pathLength="1"` plus `stroke-dasharray:1; stroke-dashoffset:1`, and a
`draw` keyframe animates `stroke-dashoffset` to 0. Normalising pathLength to 1 makes long
and short strokes draw in the same time regardless of real length — reproduce this rather
than measuring `getTotalLength()`.

### Timeline (seconds, at speed = 1)
| t | event |
|---|---|
| 0.15–1.18 | S draws (4 arcs, 0.85s each, 0.06s stagger) + centreline & S axis fade in |
| 0.75–1.78 | O draws (circle + 3 arcs); O crosshair at 0.95 |
| 1.35–2.62 | D draws (8 strokes); D axis at 1.5 (x=998.30, through the bowl centre) |
| 1.95–2.65 | "+" draws (0.7s) |
| 2.25–3.22 | A draws (3 arcs); A circle/axis at 2.35–2.4 |
| 2.90–3.11 | three dots draw (0.5s each) then fill |
| 3.15–4.00 | press-fit pieces draw while apart |
| 3.50–4.96 | CHALLENGE letters draw (0.6s, 0.07s stagger) then fill (0.45s) |
| 4.50–5.55 | base slides in `translate(-96px,62px) scale(.94) → 0`, cubic-bezier(.34,1.3,.5,1) |
| 4.60–5.85 | tab drops `translate(58px,-186px) rotate(-8deg)` → overshoot 13px → settle, cubic-bezier(.5,.02,.24,1) |
| 5.45 | seat recoil on the base (0.55s, 6px dip + 0.985 scaleY) |
| 5.60→7.00 | float loops begin, staggered per element |
| 7.00 | "In partnership with" fades in (0.9s) |
| 7.30 / 7.50 / 7.70 | stickers pop in (0.8s, cubic-bezier(.2,1.3,.4,1)), then join the float |
| 8.40 | DISCOVER fades in; arrow nudge loop from 9.2 |

### Float loops (post-assembly)
Four keyframes, applied per element with `transform-box:fill-box; transform-origin:center`
so each letter drifts about its own centre:
- `floatA`: 0 → -20px → 0
- `floatB`: -6px/rotate(-.5deg) → 14px/rotate(.4deg)
- `floatC`: 4px → -16px
- `floatD`: -10px/rotate(.6deg) → 8px/rotate(-.3deg)
- `hover3d` (assembled mark): -9px/rotate(-1.1deg) → 11px/rotate(1.1deg)
Durations 5.4–8.2s, `ease-in-out`, `infinite`, delays 5.6–7.0s so nothing moves until the
lockup is complete. **Never start a float before its element has finished drawing.**

### Controls
- **Replay**: resets every non-float animation to `currentTime = 0` via the Web Animations
  API (`element.getAnimations({subtree:true})`) — no remount, float loops keep running.
- **DISCOVER**: scrolls one viewport down; if the document is not yet taller than the
  viewport it scrolls back to top instead (guard against a dead click on the standalone hero).
- **Speed**: `playbackRate` is set on every non-float animation, so one token retimes the
  whole sequence.

### Responsive behaviour
The logo is one SVG with a single viewBox, so it scales without reflow;
`preserveAspectRatio` letterboxing handles short viewports. Sticker height and the
sticker gap are `clamp()`ed. Below ~640px wide, stack the stickers 3-up in a row at the
clamp minimum (84px) or wrap to a 2+1 grid — not specified in the prototype.

## State Management
Almost none — the hero is declarative CSS animation. What exists:
- `props` (design tokens, see below) applied imperatively in `apply()`: line colour on the
  SVG (`color`, everything else uses `currentColor`), background on the root, glow as a
  `filter`, `stroke-width` on `[data-w="main"]` strokes, `display` on the schematic /
  mark / partner layers, `playbackRate` for speed, pause-at-0 for float off.
- No data fetching. No route state. In the real site the hero should mount once and not
  re-render (re-rendering restarts nothing, but keep it out of a re-rendering parent).

## Design Tokens
Colours (all swatches offered in the prototype):
- Backgrounds: `#dfe9e6` (default), `#1a1410`, `#0e0d0c`, `#141b26`, `#20182a`,
  `#f6efe6`, `#e8dfd2`, `#f3e4e7`
- Line: `#0e0d0c` (default), `#f4ede1`, `#ffffff`, `#f7c9d3`, `#bfe3d8`, `#cfd7f5`,
  `#f8e2b0`, `#d9c6ef`
- Glow halo: `#8fe3cf` (default), `#f7c9d3`, `#bfe3d8`, `#cfd7f5`, `#f8e2b0`, `#d9c6ef`,
  `#ffb98a`, `#ffffff`
- Sticker plate `#f7f2ea`, sticker ink `#111`
Glow: `drop-shadow(0 0 (0.5+g*2)px <line>) drop-shadow(0 0 (4+g*12)px <glowColor>)`,
g = 0–1, default 0 (off).
Stroke weights: main letters `strokeWeight` 2–26 (default 2); "+" 7; press-fit 4;
wordmark outline 1.6; CAD layer 1.3 at 50% opacity. Shipping defaults: line `#0e0d0c`,
background `#dfe9e6`, strokeWeight 5, speed 0.7, glow 0, floating on, mark hidden.
Radii: 999px (pills). Spacing: vh-based (2vh / 0.6vh / 3.4vh / 4vh / 5vh / -4vh) plus
`clamp(24px,4vw,52px)` sticker gap. Type scale: 11px / 12px, tracking .14em / .26em.
No shadows other than the optional glow.

## Assets
- `assets/SODA_logo_source.svg` — the original user-supplied logo artwork (SOD+A arcs,
  CHALLENGE wordmark, separator dots, press-fit mark). All path data in the prototype is
  taken verbatim from this file; use it as the source of truth.
- `assets/partners/soda-16.svg` — OCAD University sticker
- `assets/partners/soda-17.svg` — Fab Lab BCN sticker
- `assets/partners/soda-18.svg` — LCC Fab Lab sticker
  All three were rebuilt from the user's sticker files: an embedded raster layer with no
  image data was removed, and class-based fills were flattened to presentation attributes
  so they render correctly when loaded via `<img>`.

## Files
- `design/SODA Logo Reveal.dc.html` — the complete reference animation. Open in a browser.
- `design/assets/` — logo source + partner stickers.

## Notes / open items
- A WebAudio cue engine (swish per stroke, reverbed bell chimes per letter/dot/plus,
  press-fit thunk) is still present in the logic class but no longer exposed in the UI.
  Delete it or re-expose it behind a mute control — browsers require a user gesture
  before audio can start.
- `prefers-reduced-motion`: not handled in the prototype. In production, render the final
  assembled state with no draw-on and no float when it is set.
- The page below the hero does not exist yet; DISCOVER is a placeholder scroll of one viewport.
