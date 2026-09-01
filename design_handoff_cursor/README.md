# SOD+A CHALLENGE — hero handoff (Cursor)

## What's here
```
.cursor/rules/soda-hero.mdc   Project rule — auto-loads the spec when working on hero code
design/SPEC.md                Full design spec: timeline, geometry, tokens, behaviour
design/SODA Logo Reveal.dc.html   Reference animation — open in a browser
design/assets/                Logo source SVG + three partner sticker SVGs
```

## Setup
1. Copy `.cursor/` and `design/` into the root of your repo.
2. Open the repo in Cursor. The rule attaches automatically on hero-related files; to pull
   it in manually, reference `@design/SPEC.md` in chat.
3. Open `design/SODA Logo Reveal.dc.html` in a browser and watch the sequence before
   implementing — the timing is the design.

## Suggested first prompt
> Read @design/SPEC.md. Build the hero section as a component in this codebase's
> framework and conventions, matching the timeline, geometry and tokens exactly. Use the
> SVG path data from @design/assets/SODA_logo_source.svg. It is one full-viewport section;
> the rest of the page comes later.

## Fidelity
High. Geometry, timings, easings, stroke weights and colours are final. The only open area
is the page below the hero, which does not exist yet.
